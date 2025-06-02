import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const deleteEnrollment: Interfaces.Controllers.Async = async (
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

    if (!existingEnrollment) {
      return res.json(Utils.Response.error("Enrollment not found", 404));
    }

    await prisma.enrollment.delete({
      where: {
        id: existingEnrollment.id,
      },
    });

    return res.json(
      Utils.Response.success("Enrollment deleted successfully", 200)
    );
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};

export default deleteEnrollment;
