import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const getTodayStatus: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res
        .status(400)
        .json(Utils.Response.error("courseId is required", 400));
    }

    const Sessions = await prisma.classSession.findMany({
      where: {
        courseId,
      },
    });

    return res.status(200).json(
      Utils.Response.success({
        Sessions,
      })
    );
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default getTodayStatus;
