import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

// GET /course/:id
const read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        professor: true,
        users: true,
        timetable: true,
        questions: true,
        announcements: true,
        sessions: true,
      },
    });

    if (!course) {
      return next(Utils.Response.error("Course not found", 404));
    }

    return res.json(Utils.Response.success(course));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

// GET /course
const readAll: Interfaces.Controllers.Async = async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        professor: true,
        users: true,
        timetable: true,
        questions: true,
        announcements: true,
        sessions: true,
      },
    });

    return res.json(Utils.Response.success(courses));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { read, readAll };
