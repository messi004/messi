import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { uploadToSupabase } from "./supabase";
import { initializeDatabase } from "./db";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await initializeDatabase();

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && (req.session as any).authenticated) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // === REDIRECTS MIDDLEWARE ===
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
      return next();
    }
    const redirect = await storage.getRedirect(req.path);
    if (redirect && redirect.isActive) {
      return res.redirect(redirect.statusCode, redirect.toPath);
    }
    next();
  });

  // === PAGE VIEW TRACKING ===
  app.post('/api/track', async (req, res) => {
    const { pageSlug } = req.body;
    if (pageSlug) {
      await storage.trackPageView(pageSlug);
    }
    res.json({ success: true });
  });

  // === AUTHENTICATION ===
  app.post(api.auth.login.path, (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "Messi@876910") {
      (req.session as any).authenticated = true;
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.check.path, (req, res) => {
    const authenticated = !!(req.session as any)?.authenticated;
    res.json({ authenticated });
  });

  // === PROJECTS CRUD ===
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post(api.projects.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.projects.update.path, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(id, input);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.projects.delete.path, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // === CONTACT MESSAGES ===
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.contact.list.path, requireAuth, async (req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.delete(api.contact.delete.path, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    await storage.deleteContactMessage(id);
    res.status(204).send();
  });

  // === IMAGE UPLOAD (Supabase Storage) ===
  app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const url = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
      res.json({ url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed. Check Supabase storage configuration." });
    }
  });

  // === REDIRECTS API ===
  app.get('/api/redirects', requireAuth, async (req, res) => {
    const redirects = await storage.getAllRedirects();
    res.json(redirects);
  });

  app.post('/api/redirects', requireAuth, async (req, res) => {
    const redirect = await storage.createRedirect(req.body);
    res.json(redirect);
  });

  app.patch('/api/redirects/:id', requireAuth, async (req, res) => {
    const redirect = await storage.updateRedirect(parseInt(req.params.id as string), req.body);
    res.json(redirect);
  });

  app.delete('/api/redirects/:id', requireAuth, async (req, res) => {
    await storage.deleteRedirect(parseInt(req.params.id as string));
    res.status(204).send();
  });

  // === PAGE VIEWS (Simple Analytics) ===
  app.get('/api/analytics/views', requireAuth, async (req, res) => {
    const views = await storage.getAllPageViews();
    res.json(views);
  });

  // === SEO API ROUTES ===

  // Page SEO
  app.get('/api/seo/pages', requireAuth, async (req, res) => {
    const pages = await storage.getAllPageSeo();
    res.json(pages);
  });

  app.get('/api/seo/pages/:slug', async (req, res) => {
    const seo = await storage.getPageSeo(req.params.slug);
    res.json(seo || {});
  });

  app.post('/api/seo/pages', requireAuth, async (req, res) => {
    const seo = await storage.upsertPageSeo(req.body);
    res.json(seo);
  });

  app.delete('/api/seo/pages/:slug', requireAuth, async (req, res) => {
    await storage.deletePageSeo(req.params.slug as string);
    res.status(204).send();
  });

  // Schema Markup
  app.get('/api/seo/schema', requireAuth, async (req, res) => {
    const schemas = await storage.getAllSchemaMarkup();
    res.json(schemas);
  });

  app.get('/api/seo/schema/:slug', async (req, res) => {
    const schemas = await storage.getSchemaMarkupByPage(req.params.slug);
    res.json(schemas);
  });

  app.post('/api/seo/schema', requireAuth, async (req, res) => {
    try {
      JSON.parse(JSON.stringify(req.body.schemaData));
      const schema = await storage.createSchemaMarkup(req.body);
      res.json(schema);
    } catch (e) {
      res.status(400).json({ message: "Invalid JSON-LD data" });
    }
  });

  app.patch('/api/seo/schema/:id', requireAuth, async (req, res) => {
    const schema = await storage.updateSchemaMarkup(parseInt(req.params.id as string), req.body);
    res.json(schema);
  });

  app.delete('/api/seo/schema/:id', requireAuth, async (req, res) => {
    await storage.deleteSchemaMarkup(parseInt(req.params.id as string));
    res.status(204).send();
  });

  // Sitemap Config
  app.get('/api/seo/sitemap', requireAuth, async (req, res) => {
    const config = await storage.getAllSitemapConfig();
    res.json(config);
  });

  app.post('/api/seo/sitemap', requireAuth, async (req, res) => {
    const config = await storage.upsertSitemapConfig(req.body);
    res.json(config);
  });

  // Dynamic sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    const configs = await storage.getAllSitemapConfig();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const config of configs) {
      if (config.includeInSitemap) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${config.pageSlug === 'home' ? '/' : '/' + config.pageSlug}</loc>\n`;
        xml += `    <lastmod>${config.lastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>${config.changeFrequency}</changefreq>\n`;
        xml += `    <priority>${config.priority}</priority>\n`;
        xml += '  </url>\n';
      }
    }
    
    xml += '</urlset>';
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Robots Config
  app.get('/api/seo/robots', requireAuth, async (req, res) => {
    const config = await storage.getRobotsConfig('production');
    res.json(config || { content: '' });
  });

  app.post('/api/seo/robots', requireAuth, async (req, res) => {
    const config = await storage.upsertRobotsConfig(req.body);
    res.json(config);
  });

  // Dynamic robots.txt
  app.get('/robots.txt', async (req, res) => {
    const env = process.env.NODE_ENV === 'production' ? 'production' : 'staging';
    const config = await storage.getRobotsConfig(env);
    
    if (config) {
      res.set('Content-Type', 'text/plain');
      res.send(config.content);
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      res.set('Content-Type', 'text/plain');
      res.send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`);
    }
  });

  // Analytics Config
  app.get('/api/seo/analytics', requireAuth, async (req, res) => {
    const config = await storage.getAnalyticsConfig();
    res.json(config || {});
  });

  app.post('/api/seo/analytics', requireAuth, async (req, res) => {
    const config = await storage.upsertAnalyticsConfig(req.body);
    res.json(config);
  });

  // Global SEO
  app.get('/api/seo/global', async (req, res) => {
    const config = await storage.getGlobalSeo();
    res.json(config || {});
  });

  app.post('/api/seo/global', requireAuth, async (req, res) => {
    const config = await storage.upsertGlobalSeo(req.body);
    res.json(config);
  });

  // Seed default data
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await storage.createProject({
      title: "Portfolio Website",
      description: "A professional portfolio website built with React and Express.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "https://github.com/messi004"
    });
  }

  // Seed default page SEO
  const existingPageSeo = await storage.getAllPageSeo();
  if (existingPageSeo.length === 0) {
    const defaultPages = [
      { pageSlug: 'home', pageName: 'Home', metaTitle: 'Messi - Full Stack Developer', metaDescription: 'Professional portfolio of Messi - Full Stack Developer specializing in automation, bot development, and ethical hacking.' },
      { pageSlug: 'projects', pageName: 'Projects', metaTitle: 'Projects - Messi Portfolio', metaDescription: 'Explore my featured projects in web development, automation, and security.' },
      { pageSlug: 'services', pageName: 'Services', metaTitle: 'Services - Messi Portfolio', metaDescription: 'Web development, bot development, automation tools, and ethical hacking services.' },
      { pageSlug: 'skills', pageName: 'Skills', metaTitle: 'Skills - Messi Portfolio', metaDescription: 'Technical skills including AI, Python, JavaScript, React, Node.js, and more.' },
      { pageSlug: 'contact', pageName: 'Contact', metaTitle: 'Contact - Messi Portfolio', metaDescription: 'Get in touch for project inquiries and collaboration opportunities.' },
    ];
    for (const page of defaultPages) {
      await storage.upsertPageSeo(page);
      await storage.upsertSitemapConfig({ pageSlug: page.pageSlug, includeInSitemap: true, priority: page.pageSlug === 'home' ? '1.0' : '0.8', changeFrequency: 'weekly' });
    }
  }

  return httpServer;
}
