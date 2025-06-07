import { Request, Response, NextFunction } from "express";
import * as Utils from "src/utils";

const isProfessor = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.json(Utils.Response.error("Unauthorized: User not found", 401));
  }
  if (user.role !== "Professor") {
    return res.json(Utils.Response.error("Forbidden: Professors only", 403));
  }
  return next();
};

export default isProfessor;
