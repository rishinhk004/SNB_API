import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const cancelToday: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { courseId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json(Utils.Response.error("sessionId is required", 400));
    }
    const session = await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res
        .status(404)
        .json(Utils.Response.error("No class scheduled today to cancel", 404));
    }

    if (session.isCanceled) {
      return res
        .status(200)
        .json(Utils.Response.success("Class already cancelled"));
    }
    const updatedSession = await prisma.classSession.update({
      where: { id: session.id },
      data: {
        isCanceled: true,
        canceledAt: new Date(),
      },
    });
    const courseWithUsers = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        users: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
    if (courseWithUsers && courseWithUsers.users.length > 0) {
      const courseInfo = {
        name: courseWithUsers.name,
        code: courseWithUsers.code,
      };
      const sessionInfo = { date: updatedSession.date };
      const emailPromises = courseWithUsers.users.map((enrollment) => {
        const studentInfo = { name: enrollment.user.name };
        return Utils.EmailServise.sendClassCancellationEmail(
          enrollment.user.email,
          studentInfo,
          courseInfo,
          sessionInfo
        );
      });
      Promise.allSettled(emailPromises).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            const failedEmail = courseWithUsers.users[index].user.email;
            console.error(
              `Failed to send cancellation email to ${failedEmail}:`,
              result.reason
            );
          }
        });
      });
    }

    return res.status(200).json(
      Utils.Response.success({
        message:
          "Class cancelled successfully. Notifications are being sent to students.",
        session: updatedSession,
      })
    );
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default cancelToday;
