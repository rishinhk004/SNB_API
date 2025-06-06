import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const read: Interfaces.Controllers.Async = async (req, res, next) => {
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

export default read;
