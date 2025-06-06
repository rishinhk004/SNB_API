import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import dayjs from "dayjs";

const createSession: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId, date } = req.body;

    if (!courseId || !date) {
      return res
        .status(400)
        .json(Utils.Response.error("courseId and date are required", 400));
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res
        .status(404)
        .json(Utils.Response.error("Course not found", 404));
    }

    const sessionDate = dayjs(date).toDate();

    const existingSession = await prisma.classSession.findFirst({
      where: {
        courseId,
        date: {
          gte: dayjs(sessionDate).startOf("day").toDate(),
          lte: dayjs(sessionDate).endOf("day").toDate(),
        },
      },
    });

    if (existingSession) {
      return res
        .status(409)
        .json(Utils.Response.error("Session already exists for that day", 409));
    }

    const session = await prisma.classSession.create({
      data: {
        courseId,
        date: sessionDate,
      },
    });

    return res.status(201).json(Utils.Response.success(session));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default createSession;
