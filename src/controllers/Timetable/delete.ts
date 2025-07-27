import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const del: Interfaces.Controllers.Async = async (req, res, next) => {
  const { timetableId } = req.body;
  try {
    if (!timetableId) {
      return res.json(Utils.Response.error("Timetable ID is required", 400));
    }

    await prisma.timetable.delete({
      where: { id: timetableId },
    });

    return res.json(
      Utils.Response.success("Timetable deleted successfully", 200)
    );
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};

export default del;
