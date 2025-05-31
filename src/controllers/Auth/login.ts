import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Login: Interfaces.Controllers.Async = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return next(Utils.Response.error("Invalid password", 401));
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );
    const { hashedPassword: _, ...userSafe } = user;
    return res
      .status(200)
      .json(Utils.Response.success({ user: userSafe, token }, 200));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default Login;
