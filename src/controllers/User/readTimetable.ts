import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const routine: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        courses: {
          include: {
            course: {
              include: { timetable: true },
            },
          },
        },
        coursesTaught: {
          include: { timetable: true },
        },
      },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Sessions from enrolled courses (Student role)
    const enrolledRoutines = user.courses.flatMap((enrollment) =>
      enrollment.course.timetable.map((slot) => ({
        courseName: enrollment.course.name,
        courseCode: enrollment.course.code,
        day: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        location: slot.location,
      }))
    );

    // Sessions from taught courses (Professor role)
    const taughtRoutines =
      user.role === "Professor"
        ? user.coursesTaught.flatMap((course) =>
            course.timetable.map((slot) => ({
              courseName: course.name,
              courseCode: course.code,
              day: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              location: slot.location,
            }))
          )
        : [];

    // Merge and sort
    const routine = [...enrolledRoutines, ...taughtRoutines].sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) {
        return dayDiff;
      }
      return a.startTime.localeCompare(b.startTime);
    });

    return res.json(Utils.Response.success(routine));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { routine };
