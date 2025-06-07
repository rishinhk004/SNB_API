import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const Login: Interfaces.Controllers.Async = async (req, res, next) => {
  const { token } = req.body;
  const firebaseAdmin = Utils.getFirebaseAuth();
  try {
    const decodedToken = await firebaseAdmin.verifyIdToken(token);
    const firebaseuid = decodedToken.uid;
    const user = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseuid,
      },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    return res.json(Utils.Response.success({ user }, 200));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 401));
  }
};

export default Login;
