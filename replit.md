# Messi - Professional Portfolio Website

## Overview

A full-stack professional portfolio website featuring a public-facing site and a comprehensive admin panel. The application showcases projects, services, and skills for a developer specializing in automation, bot development, and ethical hacking. It includes complete SEO management tools, contact form handling, and analytics tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with Shadcn UI components (New York style)
- **Animations**: Framer Motion for page transitions and UI effects
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with typed contracts defined in `shared/routes.ts`
- **Session Management**: express-session with MemoryStore for authentication
- **File Uploads**: Multer with in-memory storage, uploaded to Supabase Storage
- **Schema Validation**: Zod for request/response validation

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Supabase PostgreSQL (hosted)
- **Schema**: Defined in `shared/schema.ts` with tables for:
  - `projects` - Portfolio project entries
  - `contact_messages` - Contact form submissions
  - `page_seo` - Per-page SEO settings
  - `schema_markup` - JSON-LD structured data
  - `sitemap_config` - Sitemap generation settings
  - `robots_config` - Robots.txt configuration
  - `redirects` - URL redirect rules
  - `page_views` - Analytics tracking
  - `analytics_config` - Analytics settings
  - `global_seo` - Site-wide SEO defaults

### Authentication
- Hardcoded admin credentials (username: `admin`, password: `Messi@876910`)
- Session-based authentication with HTTP-only cookies
- Protected routes via `requireAuth` middleware
- 24-hour session expiration

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # UI components (Shadcn + custom)
│       ├── pages/       # Route pages (public + admin)
│       ├── hooks/       # Custom React hooks for data fetching
│       └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point with middleware
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations class
│   ├── db.ts         # Drizzle database connection
│   └── supabase.ts   # Supabase storage client
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle table definitions
│   └── routes.ts     # API contract definitions with Zod
└── script/           # Build scripts
```

### Key Design Patterns
- **Type-safe API contracts**: Shared route definitions with Zod schemas ensure type safety across client-server boundary
- **Storage abstraction**: `DatabaseStorage` class encapsulates all database operations
- **Component composition**: Shadcn UI primitives composed into feature components
- **Query hooks pattern**: Custom hooks wrap TanStack Query for data fetching

## External Dependencies

### Supabase
- **PostgreSQL Database**: Primary data storage via connection pooler
- **Storage Buckets**: File uploads for project images stored in 'portfolio' bucket
- **Connection**: Direct postgres connection with SSL required

### Third-Party Services
- **Google Fonts**: Inter and Montserrat font families
- **React Icons**: Social media icons (FaGithub, FaTelegram, FaWhatsapp, SiHuggingface)

### Key NPM Packages
- **drizzle-orm** + **postgres**: Database ORM and PostgreSQL driver
- **@supabase/supabase-js**: Supabase client for storage operations
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **react-hook-form** + **@hookform/resolvers**: Form handling with Zod validation
- **express-session** + **memorystore**: Session management
- **multer**: File upload handling
- **zod**: Schema validation throughout the stack