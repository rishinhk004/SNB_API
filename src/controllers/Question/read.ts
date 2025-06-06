import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const getAll: Interfaces.Controllers.Async = async (_req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: true,
        course: true,
        answers: true,
      },
    });

    return res.status(200).json(Utils.Response.success(questions));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

const getByCourseId: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const questions = await prisma.question.findMany({
      where: { courseId },
      include: {
        user: true,
        answers: true,
      },
    });

    return res.status(200).json(Utils.Response.success(questions));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { getAll, getByCourseId };
