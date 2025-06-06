import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import dayjs from "dayjs";

const cancelToday: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;

    if (!courseId) {
      return res
        .status(400)
        .json(Utils.Response.error("courseId is required", 400));
    }

    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const session = await prisma.classSession.findFirst({
      where: {
        courseId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (!session) {
      return res
        .status(404)
        .json(Utils.Response.error("No class scheduled today to cancel", 404));
    }

    if (session.isCanceled) {
      return res
        .status(200)
        .json(Utils.Response.success("Class already cancelled"));
    }

    const updated = await prisma.classSession.update({
      where: { id: session.id },
      data: {
        isCanceled: true,
        canceledAt: new Date(),
      },
    });

    return res
      .status(200)
      .json(
        Utils.Response.success({
          message: "Class cancelled successfully",
          session: updated,
        })
      );
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default cancelToday;
