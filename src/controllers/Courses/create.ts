import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { name, code, description, credits, semester, year, professorId } =
      req.body;
    if (!name || !code) {
      return next(
        Utils.Response.error("Course name and code are required", 400)
      );
    }
    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        credits,
        semester,
        year,
        professorId,
      },
    });

    return res.status(201).json(Utils.Response.success(course));
  } catch (err) {
    if (
      (err as any)?.code === "P2002" &&
      (err as any)?.meta?.target?.includes("code")
    ) {
      return next(Utils.Response.error("Course code must be unique", 409));
    }

    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { create };
