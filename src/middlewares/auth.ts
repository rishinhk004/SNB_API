import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "src/utils";
import * as Utils from "src/utils";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(Utils.Response.error("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json(Utils.Response.error("User not found", 401));
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json(Utils.Response.error("Invalid token", 401));
  }
};
