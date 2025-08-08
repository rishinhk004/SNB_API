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
    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, RollNo: true, email: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        name: true,
        code: true,
        description: true,
        semester: true,
        year: true,
        professor: { select: { name: true } },
      },
    });

    // Send email asynchronously (don’t block response)
    if (student?.email && course) {
      Utils.EmailServise.sendCourseRegistrationEmail(
        student.email,
        {
          name: student.name,
          rollNo: student.RollNo ?? undefined,
        },
        {
          name: course.name,
          code: course.code ?? undefined,
          description: course.description ?? undefined,
          professorName: course.professor?.name ?? undefined,
          semester: course.semester ?? undefined,
          year: course.year ?? undefined,
        }
      ).catch((err) =>
        console.error("Failed to send course registration email:", err)
      );
    }
    return res.json(Utils.Response.success(newEnrollment, 201));
  } catch (error) {
    return next(Utils.Response.error((error as Error).message, 500));
  }
};

export default createEnrollment;
