import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId, userId, content } = req.body;

    if (!courseId || !userId || !content) {
      return next(
        Utils.Response.error(
          "Course ID, User ID, and Content are required",
          400
        )
      );
    }

    const question = await prisma.question.create({
      data: {
        courseId,
        userId,
        content,
      },
    });

    return res.status(201).json(Utils.Response.success(question));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default create;
