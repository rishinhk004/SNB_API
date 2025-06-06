import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const getByQuestionId: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const { questionId } = req.params;

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: { user: true },
    });

    return res.status(200).json(Utils.Response.success(answers));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { getByQuestionId };
