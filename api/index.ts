import app, { setupPromise } from "../server/index.js";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
    // Ensure the app routing and database are fully initialized before handling
    await setupPromise;
    return app(req, res);
}
