import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const updateTimetable: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const { timetableId, dayOfWeek, startTime, endTime, location } = req.body;
  try {
    if (!timetableId) {
      return res.json(Utils.Response.error("Timetable ID is required", 400));
    }
    const existing = await prisma.timetable.findUnique({
      where: { id: timetableId },
    });
    if (!existing) {
      return res.json(Utils.Response.error("Timetable not found", 404));
    }
    const updated = await prisma.timetable.update({
      where: { id: timetableId },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        location,
      },
    });
    return res.json(Utils.Response.success(updated, 200));
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};
export default updateTimetable;
