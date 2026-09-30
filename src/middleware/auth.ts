import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("X-User-Id");

  if (!header || isNaN(Number(header))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.locals.userId = Number(header);
  next();
}
