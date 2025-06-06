import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { content, questionId, userId } = req.body;

    if (!content || !questionId || !userId) {
      return next(
        Utils.Response.error(
          "Content, Question ID, and User ID are required",
          400
        )
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        userId,
      },
    });

    return res.status(201).json(Utils.Response.success(answer));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { create };
