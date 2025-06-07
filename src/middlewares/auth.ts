import { Request, Response, NextFunction } from "express";
import { prisma } from "src/utils";
import * as Utils from "src/utils";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const firebaseAdmin = Utils.getFirebaseAuth();
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(Utils.Response.error("No token provided", 401));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await firebaseAdmin.verifyIdToken(token);
    const firebaseId = decodedToken.uid;
    const user = await prisma.user.findUnique({ where: { firebaseId } });

    if (!user) {
      return res.status(401).json(Utils.Response.error("User not found", 401));
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json(Utils.Response.error("Invalid token", 401));
  }
};
