import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId, title, content, attachment } = req.body;
    if (!courseId || !title || !content) {
      return res
        .status(400)
        .json(
          Utils.Response.error("courseId, title and content is required", 400)
        );
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res
        .status(404)
        .json(Utils.Response.error("Course not found", 404));
    }
    const announcement = await prisma.announcement.create({
      data: {
        courseId,
        title,
        content,
        attachment,
      },
    });

    return res.status(201).json(Utils.Response.success(announcement));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default create;
