import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import dayjs from "dayjs";

// Map of day names to numerical dayjs weekday values
const dayMap: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

// Define an interface for the sessions to create
interface SessionInput {
  courseId: string;
  date: Date;
}

const generateSessions: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const {
      courseId,
      startDate,
      endDate,
    }: { courseId?: string; startDate?: string; endDate?: string } = req.body;

    if (!courseId || !startDate || !endDate) {
      return res
        .status(400)
        .json(
          Utils.Response.error(
            "courseId, startDate, and endDate are required",
            400
          )
        );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res
        .status(404)
        .json(Utils.Response.error("Course not found", 404));
    }

    const timetable = await prisma.timetable.findMany({ where: { courseId } });
    if (timetable.length === 0) {
      return res
        .status(404)
        .json(Utils.Response.error("No timetable found for this course", 404));
    }

    let current = dayjs(startDate);
    const end = dayjs(endDate);

    const sessionsToCreate: SessionInput[] = [];

    while (current.isBefore(end) || current.isSame(end, "day")) {
      for (const entry of timetable) {
        // entry.dayOfWeek should be a string like "Monday"
        if (current.day() === dayMap[entry.dayOfWeek]) {
          const [hour, minute] = entry.startTime.split(":").map(Number);

          // Construct full date with time for the session
          const sessionDate = current
            .hour(hour)
            .minute(minute)
            .second(0)
            .millisecond(0)
            .toDate();

          sessionsToCreate.push({
            courseId,
            date: sessionDate,
          });
        }
      }
      current = current.add(1, "day");
    }

    // Extract session dates
    const sessionDates: Date[] = sessionsToCreate.map(
      (s: SessionInput) => s.date
    );

    // Fetch existing sessions to avoid duplicates
    const existingSessions = await prisma.classSession.findMany({
      where: {
        courseId,
        date: { in: sessionDates },
      },
    });

    const existingDatesSet = new Set<string>(
      existingSessions.map((s: { date: Date }) => s.date.toISOString())
    );

    const filteredSessions: SessionInput[] = sessionsToCreate.filter(
      (s: SessionInput) => !existingDatesSet.has(s.date.toISOString())
    );

    if (filteredSessions.length === 0) {
      return res.status(200).json(
        Utils.Response.success({
          createdCount: 0,
          message: "No new sessions to create",
        })
      );
    }

    const created = await prisma.classSession.createMany({
      data: filteredSessions,
    });

    return res.json(Utils.Response.success({ createdCount: created.count }));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default generateSessions;
