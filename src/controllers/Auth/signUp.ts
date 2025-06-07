import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  const { name, email, username, password, role, RollNo, Branch } = req.body;
  const firebaseAdmin = Utils.getFirebaseAuth();
  try {
    const firebaseUser = await firebaseAdmin.createUser({
      email,
      password,
      displayName: name,
    });
    const user = await prisma.user.create({
      data: {
        firebaseId: firebaseUser.uid,
        name,
        email,
        username,
        role,
        RollNo,
        Branch,
      },
    });
    const token = await firebaseAdmin.createCustomToken(firebaseUser.uid, {
      role,
    });
    return res.json(Utils.Response.success({ user, token }, 201));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default create;
