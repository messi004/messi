import app, { setupPromise } from "../server/index.js";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
    try {
        // Ensure the app routing and database are fully initialized before handling
        await setupPromise;
        return app(req, res);
    } catch (error: any) {
        console.error("Vercel Initialization Error:", error);

        // Return a 500 error with the exception details so we can debug it
        return res.status(500).json({
            error: "Development Initialization Error",
            message: error?.message || String(error),
            stack: error?.stack,
            dbUrlPresent: !!process.env.DATABASE_URL
        });
    }
}
