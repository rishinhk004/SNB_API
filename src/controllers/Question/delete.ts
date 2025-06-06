import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const deleteById: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({
      where: { id },
    });

    return res.status(204).end();
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { deleteById };
