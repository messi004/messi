import { pgTable, text, serial, integer, boolean, timestamp, jsonb, customType } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ADMIN USERS TABLE ===
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === PROJECTS TABLE ===
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === CONTACT MESSAGES TABLE ===
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SEO TABLES ===

// Page-level SEO settings
export const pageSeo = pgTable("page_seo", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull().unique(),
  pageName: text("page_name").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: text("canonical_url"),
  robotsIndex: boolean("robots_index").default(true),
  robotsFollow: boolean("robots_follow").default(true),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogType: text("og_type").default("website"),
  twitterCard: text("twitter_card").default("summary_large_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema markup (JSON-LD)
export const schemaMarkup = pgTable("schema_markup", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull(),
  schemaName: text("schema_name").notNull(),
  schemaData: jsonb("schema_data").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sitemap configuration
export const sitemapConfig = pgTable("sitemap_config", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull().unique(),
  includeInSitemap: boolean("include_in_sitemap").default(true),
  priority: text("priority").default("0.5"),
  changeFrequency: text("change_frequency").default("monthly"),
  lastModified: timestamp("last_modified").defaultNow(),
});

// Robots.txt configuration
export const robotsConfig = pgTable("robots_config", {
  id: serial("id").primaryKey(),
  environment: text("environment").notNull().default("production"),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics configuration
export const analyticsConfig = pgTable("analytics_config", {
  id: serial("id").primaryKey(),
  ga4MeasurementId: text("ga4_measurement_id"),
  searchConsoleVerification: text("search_console_verification"),
  metaPixelId: text("meta_pixel_id"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global SEO settings
export const globalSeo = pgTable("global_seo", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").default("Messi Portfolio"),
  siteDescription: text("site_description"),
  defaultOgImage: text("default_og_image"),
  favicon: text("favicon"),
  organizationSchema: jsonb("organization_schema"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Redirects table (301 & 302)
export const redirects = pgTable("redirects", {
  id: serial("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Page Analytics (simple)
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull(),
  viewCount: integer("view_count").default(0),
  lastViewed: timestamp("last_viewed").defaultNow(),
});

// === INSERT SCHEMAS ===
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
export const insertPageSeoSchema = createInsertSchema(pageSeo).omit({ id: true, updatedAt: true });
export const insertSchemaMarkupSchema = createInsertSchema(schemaMarkup).omit({ id: true, updatedAt: true });
export const insertSitemapConfigSchema = createInsertSchema(sitemapConfig).omit({ id: true, lastModified: true });
export const insertRobotsConfigSchema = createInsertSchema(robotsConfig).omit({ id: true, updatedAt: true });
export const insertAnalyticsConfigSchema = createInsertSchema(analyticsConfig).omit({ id: true, updatedAt: true });
export const insertGlobalSeoSchema = createInsertSchema(globalSeo).omit({ id: true, updatedAt: true });
export const insertRedirectSchema = createInsertSchema(redirects).omit({ id: true, createdAt: true });

// === TYPES ===
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type PageSeo = typeof pageSeo.$inferSelect;
export type InsertPageSeo = z.infer<typeof insertPageSeoSchema>;

export type SchemaMarkup = typeof schemaMarkup.$inferSelect;
export type InsertSchemaMarkup = z.infer<typeof insertSchemaMarkupSchema>;

export type SitemapConfig = typeof sitemapConfig.$inferSelect;
export type InsertSitemapConfig = z.infer<typeof insertSitemapConfigSchema>;

export type RobotsConfig = typeof robotsConfig.$inferSelect;
export type InsertRobotsConfig = z.infer<typeof insertRobotsConfigSchema>;

export type AnalyticsConfig = typeof analyticsConfig.$inferSelect;
export type InsertAnalyticsConfig = z.infer<typeof insertAnalyticsConfigSchema>;

export type GlobalSeo = typeof globalSeo.$inferSelect;
export type InsertGlobalSeo = z.infer<typeof insertGlobalSeoSchema>;

export type Redirect = typeof redirects.$inferSelect;
export type InsertRedirect = z.infer<typeof insertRedirectSchema>;

export type PageView = typeof pageViews.$inferSelect;

// Auth types
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
