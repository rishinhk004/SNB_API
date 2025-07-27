import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

// GET /course/:id
const del: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id },
    });
    return res.json(Utils.Response.success("Course deleted successfully", 200));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};
export default del;
