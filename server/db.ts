import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createHash } from 'crypto';
import * as schema from "@shared/schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

let client: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

try {
  client = postgres(connectionString, {
    prepare: false,
    ssl: 'require',
    connect_timeout: 30,
    idle_timeout: 30,
    max: 10,
    max_lifetime: 60 * 30,
  });
  db = drizzle(client, { schema });
} catch (error) {
  console.error("Database connection error:", error);
  throw error;
}

export { db, client };

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function initializeDatabase() {
  try {
    console.log("Connecting to Neon database...");

    await client`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        link TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS page_seo (
        id SERIAL PRIMARY KEY,
        page_slug TEXT NOT NULL UNIQUE,
        page_name TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        canonical_url TEXT,
        robots_index BOOLEAN DEFAULT true,
        robots_follow BOOLEAN DEFAULT true,
        og_title TEXT,
        og_description TEXT,
        og_image TEXT,
        og_type TEXT DEFAULT 'website',
        twitter_card TEXT DEFAULT 'summary_large_image',
        twitter_title TEXT,
        twitter_description TEXT,
        twitter_image TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='page_seo' AND column_name='meta_keywords') THEN
          ALTER TABLE page_seo ADD COLUMN meta_keywords TEXT;
        END IF;
      END $$;
    `;

    await client`
      CREATE TABLE IF NOT EXISTS schema_markup (
        id SERIAL PRIMARY KEY,
        page_slug TEXT NOT NULL,
        schema_name TEXT NOT NULL,
        schema_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS sitemap_config (
        id SERIAL PRIMARY KEY,
        page_slug TEXT NOT NULL UNIQUE,
        include_in_sitemap BOOLEAN DEFAULT true,
        priority TEXT DEFAULT '0.5',
        change_frequency TEXT DEFAULT 'monthly',
        last_modified TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS robots_config (
        id SERIAL PRIMARY KEY,
        environment TEXT NOT NULL DEFAULT 'production',
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS analytics_config (
        id SERIAL PRIMARY KEY,
        ga4_measurement_id TEXT,
        search_console_verification TEXT,
        meta_pixel_id TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS global_seo (
        id SERIAL PRIMARY KEY,
        site_name TEXT DEFAULT 'Messi Portfolio',
        site_description TEXT,
        default_og_image TEXT,
        favicon TEXT,
        organization_schema JSONB,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS redirects (
        id SERIAL PRIMARY KEY,
        from_path TEXT NOT NULL UNIQUE,
        to_path TEXT NOT NULL,
        status_code INTEGER NOT NULL DEFAULT 301,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        page_slug TEXT NOT NULL UNIQUE,
        view_count INTEGER DEFAULT 0,
        last_viewed TIMESTAMP DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        data BYTEA NOT NULL,
        size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Seed default admin user if none exists
    const existingAdmins = await client`SELECT id FROM admin_users LIMIT 1`;
    if (existingAdmins.length === 0) {
      const defaultHash = hashPassword('Messi@876910');
      await client`
        INSERT INTO admin_users (username, password_hash) 
        VALUES ('admin', ${defaultHash})
      `;
      console.log("Default admin user created (username: admin)");
    }

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

