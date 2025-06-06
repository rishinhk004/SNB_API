import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const read: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(Utils.Response.error("Announcement ID is required", 400));
    }
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
    if (!announcement) {
      return res
        .status(404)
        .json(Utils.Response.error("Announcement not found", 404));
    }
    return res.status(200).json(Utils.Response.success(announcement));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

const readAll: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res
        .status(400)
        .json(Utils.Response.error("courseId is required", 400));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res
        .status(404)
        .json(Utils.Response.error("Course not found", 404));
    }

    const announcements = await prisma.announcement.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(Utils.Response.success(announcements));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { read, readAll };
