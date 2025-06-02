import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const createEnrollment: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const { courseId, userId } = req.body;
  try {
    if (!courseId || !userId) {
      return res.json(Utils.Response.error("CourseId or userId missing", 400));
    }
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        courseId,
        userId,
      },
    });
    if (existingEnrollment) {
      return res.json(Utils.Response.error("Already exists", 409));
    }
    const newEnrollment = await prisma.enrollment.create({
      data: {
        courseId,
        userId,
      },
    });
    return res.json(Utils.Response.success(newEnrollment, 201));
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};

export default createEnrollment;
