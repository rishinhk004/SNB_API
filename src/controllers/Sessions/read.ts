import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import dayjs from "dayjs";

const getTodayStatus: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res
        .status(400)
        .json(Utils.Response.error("courseId is required", 400));
    }

    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const todaySession = await prisma.classSession.findFirst({
      where: {
        courseId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (!todaySession) {
      return res
        .status(200)
        .json(Utils.Response.success({ message: "No class scheduled today" }));
    }

    return res.status(200).json(
      Utils.Response.success({
        status: todaySession.isCanceled ? "Cancelled" : "Scheduled",
        session: todaySession,
      })
    );
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default getTodayStatus;
