import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
    try {
        // Dynamically import the server module inside the handler.
        // This ensures that if ANY top-level error occurs (like a missing import file,
        // or a DATABASE_URL check throwing an error inside db.ts), it is caught here 
        // and we can actually read the error message instead of getting a generic 500 page.
        const serverModule = await import("../server/index.js");
        const app = serverModule.default;
        const setupPromise = serverModule.setupPromise;

        // Ensure the app routing and database are fully initialized before handling
        if (setupPromise) {
            await setupPromise;
        }

        return app(req, res);
    } catch (error: any) {
        console.error("Vercel Dynamic Initialization Error:", error);

        // Return a 500 error with the exception details so we can debug it
        return res.status(500).json({
            error: "Development Initialization Error",
            message: error?.message || String(error),
            stack: error?.stack,
            dbUrlPresent: !!process.env.DATABASE_URL
        });
    }
}
