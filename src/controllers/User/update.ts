import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const update: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  const firebaseAdmin = Utils.getFirebaseAuth();
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return next(Utils.Response.error("User not found", 404));
    }
    if (updateData.newPassword) {
      await firebaseAdmin.updateUser(existingUser.firebaseId, {
        password: updateData.newPassword,
      });
      delete updateData.newPassword;
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const userSafe = Utils.omit(updatedUser, ["firebaseId"]);
    return res.json(Utils.Response.success(userSafe));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { update };
