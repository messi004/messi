# Messi - Professional Dev Portfolio

A premium, high-performance portfolio website built for a Full Stack Developer specializing in automation, bot development, and ethical hacking. 

This project features a stunning "Liquid Gold" glassmorphic frontend and a secure, database-driven administrative backend for managing content dynamically.

## 🌟 Key Features

### Premium Public Frontend
*   **Aesthetic Design**: Uses a custom "Liquid Gold" theme (Deep black with warm gold/orange accents) featuring glassmorphic panels and dynamic animated backgrounds.
*   **Responsive Layouts**: Fully responsive grid systems built with Tailwind CSS.
*   **Interactive UI**: Smooth micro-interactions, page transitions, and active scroll states powered by Framer Motion.
*   **Dynamic Sections**: Home, Projects showcase, Services, Technical Skills, and a sleek Contact form.

### Robust Admin Panel
*   **Secure Authentication**: Database-backed session management using `express-session`, `passport`, and Drizzle ORM.
*   **Content Management**: Add, edit, and delete Projects dynamically.
*   **Message Hub**: View and manage contact form submissions directly from the dashboard.
*   **Dynamic SEO**: Manage Global SEO, page-level meta tags, `robots.txt`, and XML sitemaps directly from the UI without code changes.

## 💻 Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI components, Framer Motion, Wouter (routing).
*   **Backend**: Node.js, Express.js.
*   **Database**: PostgreSQL (Neon Database) managed with Drizzle ORM.
*   **Validation**: Zod for end-to-end type safety and schema validation.
*   **Build Tool**: Vite.

## 🚀 Getting Started Locally

### Prerequisites
*   Node.js (v18 or higher recommended)
*   A PostgreSQL Database string (e.g., from Neon.tech, Supabase, or local)

### Installation

1.  **Clone the repository**
2.  **Install dependencies**: 
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL=postgresql://user:password@host/database
    SESSION_SECRET=your_super_secret_session_key
    ```
4.  **Database Migration (Optional/Automatic)**:
    The application is configured to push schemas automatically on startup, but you can manually push using:
    ```bash
    npm run db:push
    ```
5.  **Run Development Server**: 
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

## 🌐 Deployment (Vercel)

This application is structurally configured to deploy on Vercel as a Serverless function.

1.  Push the code to a GitHub repository.
2.  Import the project into Vercel.
3.  In Vercel's **Environment Variables** settings, add the `DATABASE_URL` and `SESSION_SECRET`.
4.  The `vercel.json` config routes API requests to the serverless Express instance while serving the static Vite build for the frontend.
5.  Deploy.

## 📫 Contact

*   **WhatsApp**: [+91 8387041436](https://wa.me/918387041436)
*   **Telegram**: [@Messi0004](https://t.me/Messi0004)
*   **Email**: mksheela@duck.com
*   **GitHub**: [messi004](https://github.com/messi004)

---
*© 2026 Messi. All rights reserved.*
