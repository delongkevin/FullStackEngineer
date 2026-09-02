#!/usr/bin/env node
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.NEON_DATABASE_URL;
if (!databaseUrl) {
  console.error('NEON_DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    published_at DATE NOT NULL,
    reading_time TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (is_published, published_at DESC)`;
console.log('blog_posts table is ready.');