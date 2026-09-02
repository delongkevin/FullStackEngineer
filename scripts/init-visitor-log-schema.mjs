#!/usr/bin/env node
// One-time setup: creates the visitor_logs table used by the Netlify visit-logging functions.
// Usage: NEON_DATABASE_URL=postgres://... node scripts/init-visitor-log-schema.mjs
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.NEON_DATABASE_URL;
if (!databaseUrl) {
  console.error('NEON_DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql`
  CREATE TABLE IF NOT EXISTS visitor_logs (
    id BIGSERIAL PRIMARY KEY,
    ip_hash TEXT NOT NULL,
    country TEXT,
    region TEXT,
    city TEXT,
    path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS visitor_logs_created_at_idx ON visitor_logs (created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS visitor_logs_location_idx ON visitor_logs (country, region, city)`;

console.log('visitor_logs table is ready.');
