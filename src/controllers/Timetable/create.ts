import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const createTimetable: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const { courseId, dayOfWeek, startTime, endTime, location } = req.body;
  try {
    if (!courseId || !dayOfWeek || !startTime || !endTime) {
      return res.json(Utils.Response.error("Missing required fields", 400));
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.json(Utils.Response.error("Course not found", 404));
    }
    const newTimetable = await prisma.timetable.create({
      data: {
        courseId,
        dayOfWeek,
        startTime,
        endTime,
        location,
      },
    });
    return res.json(Utils.Response.success(newTimetable, 201));
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};
export default createTimetable;
