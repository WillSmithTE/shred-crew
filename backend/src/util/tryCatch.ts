import { Response } from "express";
import { HttpError } from "./HttpError";

export async function tryCatch(consumer: () => Promise<void>, res: Response) {
    try {
        await consumer()
    } catch (e) {
        console.log(e);
        if (e instanceof HttpError) res.status(e.code).json({ error: e.message })
        else res.status(500).json({ error: e })
    }
}