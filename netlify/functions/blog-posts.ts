import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = process.env.NEON_DATABASE_URL ? neon(process.env.NEON_DATABASE_URL) : null;
const adminToken = process.env.BLOG_ADMIN_TOKEN || process.env.ADMIN_API_TOKEN;

function authorized(event: Parameters<Handler>[0]) {
  const token = event.headers.authorization?.replace(/^Bearer\s+/i, '');
  return Boolean(adminToken && token === adminToken);
}

function json(statusCode: number, body: unknown) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function validPost(body: any) {
  return body && typeof body.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)
    && typeof body.title === 'string' && body.title.trim().length > 0
    && typeof body.excerpt === 'string' && body.excerpt.trim().length > 0
    && typeof body.category === 'string' && typeof body.publishedAt === 'string'
    && typeof body.readingTime === 'string' && Array.isArray(body.sections) && Array.isArray(body.takeaways);
}

export const handler: Handler = async (event) => {
  if (!sql) return json(500, { error: 'Database not configured' });

  if (event.httpMethod === 'GET' && !authorized(event)) {
    const posts = await sql`
      SELECT slug, title, excerpt, category, published_at AS "publishedAt", reading_time AS "readingTime", sections, takeaways
      FROM blog_posts WHERE is_published = true ORDER BY published_at DESC, id DESC
    `;
    return json(200, posts);
  }

  if (!authorized(event)) return json(401, { error: 'Unauthorized' });

  try {
    if (event.httpMethod === 'GET') {
      const posts = await sql`
        SELECT id, slug, title, excerpt, category, published_at AS "publishedAt", reading_time AS "readingTime", sections, takeaways, is_published AS "isPublished"
        FROM blog_posts ORDER BY published_at DESC, id DESC
      `;
      return json(200, posts);
    }

    const body = event.body ? JSON.parse(event.body) : {};
    if (!validPost(body)) return json(400, { error: 'Invalid post data' });

    if (event.httpMethod === 'POST') {
      const [post] = await sql`
        INSERT INTO blog_posts (slug, title, excerpt, category, published_at, reading_time, sections, takeaways, is_published)
        VALUES (${body.slug}, ${body.title.trim()}, ${body.excerpt.trim()}, ${body.category}, ${body.publishedAt}, ${body.readingTime}, ${JSON.stringify(body.sections)}::jsonb, ${JSON.stringify(body.takeaways)}::jsonb, ${Boolean(body.isPublished)})
        RETURNING id
      `;
      return json(201, post);
    }

    if (event.httpMethod === 'PUT') {
      const id = Number(event.queryStringParameters?.id);
      if (!Number.isInteger(id)) return json(400, { error: 'A valid post id is required' });
      await sql`
        UPDATE blog_posts SET slug = ${body.slug}, title = ${body.title.trim()}, excerpt = ${body.excerpt.trim()}, category = ${body.category}, published_at = ${body.publishedAt}, reading_time = ${body.readingTime}, sections = ${JSON.stringify(body.sections)}::jsonb, takeaways = ${JSON.stringify(body.takeaways)}::jsonb, is_published = ${Boolean(body.isPublished)}, updated_at = now()
        WHERE id = ${id}
      `;
      return json(200, { saved: true });
    }

    if (event.httpMethod === 'DELETE') {
      const id = Number(event.queryStringParameters?.id);
      if (!Number.isInteger(id)) return json(400, { error: 'A valid post id is required' });
      await sql`DELETE FROM blog_posts WHERE id = ${id}`;
      return json(204, null);
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error('blog-posts request failed', error);
    return json(500, { error: 'Blog request failed' });
  }
};