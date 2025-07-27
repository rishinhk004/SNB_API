import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

// DELETE /course/:id
const del: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { courseId: id },
      select: { id: true },
    });
    const questionIds = questions.map((q) => q.id);
    await prisma.$transaction([
      prisma.answer.deleteMany({ where: { questionId: { in: questionIds } } }),
      prisma.question.deleteMany({ where: { courseId: id } }),
      prisma.enrollment.deleteMany({ where: { courseId: id } }),
      prisma.timetable.deleteMany({ where: { courseId: id } }),
      prisma.announcement.deleteMany({ where: { courseId: id } }),
      prisma.classSession.deleteMany({ where: { courseId: id } }),
      prisma.course.delete({ where: { id } }),
    ]);

    return res.json(
      Utils.Response.success(
        "Course and all related data deleted successfully",
        200
      )
    );
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default del;
