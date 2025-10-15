import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import { Course, Timetable, Enrollment } from "@prisma/client";

interface RoutineSlot {
  courseName: string;
  courseCode: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string | null;
}

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
    const enrolledRoutines: RoutineSlot[] = user.courses.flatMap(
      (
        enrollment: Enrollment & {
          course: Course & { timetable: Timetable[] };
        }
      ) =>
        enrollment.course.timetable.map((slot: Timetable) => ({
          courseName: enrollment.course.name,
          courseCode: enrollment.course.code,
          day: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          location: slot.location,
        }))
    );

    // Sessions from taught courses (Professor role)
    const taughtRoutines: RoutineSlot[] =
      user.role === "Professor"
        ? user.coursesTaught.flatMap(
            (course: Course & { timetable: Timetable[] }) =>
              course.timetable.map((slot: Timetable) => ({
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
    const routineList: RoutineSlot[] = [
      ...enrolledRoutines,
      ...taughtRoutines,
    ].sort((a: RoutineSlot, b: RoutineSlot) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime);
    });

    return res.json(Utils.Response.success(routineList));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { routine };
