import { db } from "./db.js";
import {
  projects,
  contactMessages,
  pageSeo,
  schemaMarkup,
  sitemapConfig,
  robotsConfig,
  analyticsConfig,
  globalSeo,
  redirects,
  pageViews,
  type Project,
  type InsertProject,
  type ContactMessage,
  type InsertContactMessage,
  type PageSeo,
  type InsertPageSeo,
  type SchemaMarkup,
  type InsertSchemaMarkup,
  type SitemapConfig,
  type InsertSitemapConfig,
  type RobotsConfig,
  type InsertRobotsConfig,
  type AnalyticsConfig,
  type InsertAnalyticsConfig,
  type GlobalSeo,
  type InsertGlobalSeo,
  type Redirect,
  type InsertRedirect,
  type PageView
} from "../shared/schema.js";
import { eq, desc, sql } from "drizzle-orm";

export class DatabaseStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Page SEO
  async getAllPageSeo(): Promise<PageSeo[]> {
    return await db.select().from(pageSeo);
  }

  async getPageSeo(pageSlug: string): Promise<PageSeo | undefined> {
    const [seo] = await db.select().from(pageSeo).where(eq(pageSeo.pageSlug, pageSlug));
    return seo;
  }

  async upsertPageSeo(data: InsertPageSeo): Promise<PageSeo> {
    try {
      const existing = await this.getPageSeo(data.pageSlug);
      if (existing) {
        const [updated] = await db.update(pageSeo)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(pageSeo.pageSlug, data.pageSlug))
          .returning();
        return updated;
      }
      const [created] = await db.insert(pageSeo).values(data).returning();
      return created;
    } catch (error) {
      console.error(`Error in upsertPageSeo for slug ${data.pageSlug}:`, error);
      throw error;
    }
  }

  async deletePageSeo(pageSlug: string): Promise<void> {
    await db.delete(pageSeo).where(eq(pageSeo.pageSlug, pageSlug));
  }

  // Schema Markup
  async getAllSchemaMarkup(): Promise<SchemaMarkup[]> {
    return await db.select().from(schemaMarkup);
  }

  async getSchemaMarkupByPage(pageSlug: string): Promise<SchemaMarkup[]> {
    return await db.select().from(schemaMarkup).where(eq(schemaMarkup.pageSlug, pageSlug));
  }

  async createSchemaMarkup(data: InsertSchemaMarkup): Promise<SchemaMarkup> {
    const [created] = await db.insert(schemaMarkup).values(data).returning();
    return created;
  }

  async updateSchemaMarkup(id: number, data: Partial<InsertSchemaMarkup>): Promise<SchemaMarkup> {
    const [updated] = await db.update(schemaMarkup)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schemaMarkup.id, id))
      .returning();
    return updated;
  }

  async deleteSchemaMarkup(id: number): Promise<void> {
    await db.delete(schemaMarkup).where(eq(schemaMarkup.id, id));
  }

  // Sitemap Config
  async getAllSitemapConfig(): Promise<SitemapConfig[]> {
    return await db.select().from(sitemapConfig);
  }

  async upsertSitemapConfig(data: InsertSitemapConfig): Promise<SitemapConfig> {
    const [existing] = await db.select().from(sitemapConfig).where(eq(sitemapConfig.pageSlug, data.pageSlug));
    if (existing) {
      const [updated] = await db.update(sitemapConfig)
        .set({ ...data, lastModified: new Date() })
        .where(eq(sitemapConfig.pageSlug, data.pageSlug))
        .returning();
      return updated;
    }
    const [created] = await db.insert(sitemapConfig).values(data).returning();
    return created;
  }

  // Robots Config
  async getRobotsConfig(environment: string): Promise<RobotsConfig | undefined> {
    const [config] = await db.select().from(robotsConfig).where(eq(robotsConfig.environment, environment));
    return config;
  }

  async upsertRobotsConfig(data: InsertRobotsConfig): Promise<RobotsConfig> {
    const existing = await this.getRobotsConfig(data.environment || 'production');
    if (existing) {
      const [updated] = await db.update(robotsConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(robotsConfig.environment, data.environment || 'production'))
        .returning();
      return updated;
    }
    const [created] = await db.insert(robotsConfig).values(data).returning();
    return created;
  }

  // Analytics Config
  async getAnalyticsConfig(): Promise<AnalyticsConfig | undefined> {
    const [config] = await db.select().from(analyticsConfig);
    return config;
  }

  async upsertAnalyticsConfig(data: InsertAnalyticsConfig): Promise<AnalyticsConfig> {
    const existing = await this.getAnalyticsConfig();
    if (existing) {
      const [updated] = await db.update(analyticsConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(analyticsConfig.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(analyticsConfig).values(data).returning();
    return created;
  }

  // Global SEO
  async getGlobalSeo(): Promise<GlobalSeo | undefined> {
    const [config] = await db.select().from(globalSeo);
    return config;
  }

  async upsertGlobalSeo(data: InsertGlobalSeo): Promise<GlobalSeo> {
    const existing = await this.getGlobalSeo();
    if (existing) {
      const [updated] = await db.update(globalSeo)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(globalSeo.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(globalSeo).values(data).returning();
    return created;
  }

  // Redirects
  async getAllRedirects(): Promise<Redirect[]> {
    return await db.select().from(redirects).orderBy(desc(redirects.createdAt));
  }

  async getRedirect(fromPath: string): Promise<Redirect | undefined> {
    const [redirect] = await db.select().from(redirects).where(eq(redirects.fromPath, fromPath));
    return redirect;
  }

  async createRedirect(data: InsertRedirect): Promise<Redirect> {
    const [created] = await db.insert(redirects).values(data).returning();
    return created;
  }

  async updateRedirect(id: number, data: Partial<InsertRedirect>): Promise<Redirect> {
    const [updated] = await db.update(redirects)
      .set(data)
      .where(eq(redirects.id, id))
      .returning();
    return updated;
  }

  async deleteRedirect(id: number): Promise<void> {
    await db.delete(redirects).where(eq(redirects.id, id));
  }

  // Page Views (Simple Analytics)
  async getAllPageViews(): Promise<PageView[]> {
    return await db.select().from(pageViews).orderBy(desc(pageViews.viewCount));
  }

  async trackPageView(pageSlug: string): Promise<void> {
    const [existing] = await db.select().from(pageViews).where(eq(pageViews.pageSlug, pageSlug));
    if (existing) {
      await db.update(pageViews)
        .set({
          viewCount: sql`${pageViews.viewCount} + 1`,
          lastViewed: new Date()
        })
        .where(eq(pageViews.pageSlug, pageSlug));
    } else {
      await db.insert(pageViews).values({ pageSlug, viewCount: 1 });
    }
  }

  async resetPageViews(): Promise<void> {
    await db.delete(pageViews);
  }
}

export const storage = new DatabaseStorage();
