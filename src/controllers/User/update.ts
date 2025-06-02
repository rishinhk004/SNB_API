import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const update: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return next(Utils.Response.error("User not found", 404));
    }
    if (updateData.newPassword) {
      const hashed = await bcrypt.hash(updateData.newPassword, SALT_ROUNDS);
      updateData.hashedPassword = hashed;
      delete updateData.newPassword;
    }
    delete updateData.hashedPassword;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    const userSafe = Utils.omit(updatedUser, ["hashpassword"]);
    return res.json(Utils.Response.success(userSafe));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { update };
