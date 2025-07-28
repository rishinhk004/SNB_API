import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const routine: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.headers["firebase-id"] as string;

  if (!firebaseId) {
    return next(Utils.Response.error("Firebase ID missing in headers", 400));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId },
      include: {
        courses: {
          include: {
            course: {
              include: {
                timetable: true,
              },
            },
          },
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

    const routine = user.courses
      .flatMap((enrollment) =>
        enrollment.course.timetable.map((slot) => ({
          courseName: enrollment.course.name,
          courseCode: enrollment.course.code,
          day: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          location: slot.location,
        }))
      )
      .sort((a, b) => {
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
