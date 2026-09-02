import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = process.env.NEON_DATABASE_URL ? neon(process.env.NEON_DATABASE_URL) : null;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = event.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!process.env.ADMIN_API_TOKEN || token !== process.env.ADMIN_API_TOKEN) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  if (!sql) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Database not configured' }) };
  }

  try {
    const [summary, recent] = await Promise.all([
      sql`
        SELECT
          country, region, city,
          COUNT(DISTINCT ip_hash) AS unique_visitors,
          COUNT(*) AS total_visits,
          MAX(created_at) AS last_seen
        FROM visitor_logs
        GROUP BY country, region, city
        ORDER BY total_visits DESC
        LIMIT 100
      `,
      sql`
        SELECT ip_hash, country, region, city, path, referrer, created_at
        FROM visitor_logs
        ORDER BY created_at DESC
        LIMIT 200
      `,
    ]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary, recent }),
    };
  } catch (error) {
    console.error('get-visits query failed', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch visits' }) };
  }
};
