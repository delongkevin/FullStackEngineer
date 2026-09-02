import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = process.env.NEON_DATABASE_URL ? neon(process.env.NEON_DATABASE_URL) : null;
const adminToken = process.env.BLOG_ADMIN_TOKEN || process.env.ADMIN_API_TOKEN;

function json(statusCode: number, body: unknown) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function authorized(event: Parameters<Handler>[0]) {
  const token = event.headers.authorization?.replace(/^Bearer\s+/i, '');
  return Boolean(adminToken && token === adminToken);
}

function validComment(body: any) {
  return body && typeof body.postSlug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.postSlug)
    && typeof body.authorName === 'string' && body.authorName.trim().length >= 2 && body.authorName.trim().length <= 80
    && typeof body.authorEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.authorEmail.trim())
    && typeof body.commentBody === 'string' && body.commentBody.trim().length >= 3 && body.commentBody.trim().length <= 2000;
}

export const handler: Handler = async (event) => {
  if (!sql) return json(500, { error: 'Database not configured' });

  try {
    if (event.httpMethod === 'GET') {
      const slug = event.queryStringParameters?.slug;
      if (authorized(event)) {
        const comments = await sql`
          SELECT id, post_slug AS "postSlug", author_name AS "authorName", author_email AS "authorEmail", comment_body AS "commentBody", status, created_at AS "createdAt", reviewed_at AS "reviewedAt"
          FROM blog_comments ORDER BY created_at DESC LIMIT 500
        `;
        return json(200, comments);
      }
      if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json(400, { error: 'A valid post slug is required' });
      const comments = await sql`
        SELECT id, author_name AS "authorName", comment_body AS "commentBody", created_at AS "createdAt"
        FROM blog_comments WHERE post_slug = ${slug} AND status = 'approved' ORDER BY created_at ASC
      `;
      return json(200, comments);
    }

    if (event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      if (body.website) return json(201, { submitted: true });
      if (!validComment(body)) return json(400, { error: 'Please provide a valid name, email, and comment.' });
      await sql`
        INSERT INTO blog_comments (post_slug, author_name, author_email, comment_body)
        VALUES (${body.postSlug}, ${body.authorName.trim()}, ${body.authorEmail.trim().toLowerCase()}, ${body.commentBody.trim()})
      `;
      return json(201, { submitted: true });
    }

    if (event.httpMethod === 'PUT') {
      if (!authorized(event)) return json(401, { error: 'Unauthorized' });
      const id = Number(event.queryStringParameters?.id);
      const status = event.body ? JSON.parse(event.body).status : '';
      if (!Number.isInteger(id) || !['pending', 'approved', 'rejected', 'spam'].includes(status)) return json(400, { error: 'Invalid moderation request' });
      await sql`UPDATE blog_comments SET status = ${status}, reviewed_at = now() WHERE id = ${id}`;
      return json(200, { saved: true });
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error('blog-comments request failed', error);
    return json(500, { error: 'Comments are temporarily unavailable' });
  }
};