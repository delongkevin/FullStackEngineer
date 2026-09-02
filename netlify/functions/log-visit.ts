import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';

const sql = process.env.NEON_DATABASE_URL ? neon(process.env.NEON_DATABASE_URL) : null;

// Never store raw IPs; hash with a server-side salt so visits can still be grouped by unique visitor.
function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || '';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!sql) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Database not configured' }) };
  }

  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown';

  let path = '/';
  let referrer: string | null = null;
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    if (typeof body.path === 'string') path = body.path.slice(0, 512);
    if (typeof body.referrer === 'string' && body.referrer) referrer = body.referrer.slice(0, 512);
  } catch {
    // Malformed body: keep defaults rather than failing the request.
  }

  // Netlify populates request geolocation on `context.geo` for both Functions and Edge Functions.
  const geo = (context as unknown as { geo?: { country?: { name?: string }; subdivision?: { name?: string }; city?: string } }).geo ?? {};

  try {
    await sql`
      INSERT INTO visitor_logs (ip_hash, country, region, city, path, referrer, user_agent)
      VALUES (
        ${hashIp(ip)},
        ${geo.country?.name ?? null},
        ${geo.subdivision?.name ?? null},
        ${geo.city ?? null},
        ${path},
        ${referrer},
        ${event.headers['user-agent'] ?? null}
      )
    `;
    return { statusCode: 204, body: '' };
  } catch (error) {
    console.error('log-visit insert failed', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to log visit' }) };
  }
};
