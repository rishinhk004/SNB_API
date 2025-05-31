import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  const { name, email, username, password, role, RollNo, Branch } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        hashedPassword,
        role,
        RollNo,
        Branch,
      },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const { hashedPassword: _, ...userSafe } = user;
    return res
      .status(201)
      .json(Utils.Response.success({ user: userSafe, token }, 201));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default create;
