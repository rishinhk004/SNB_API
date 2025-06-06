import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const del: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(Utils.Response.error("Announcement ID is required", 400));
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res
        .status(404)
        .json(Utils.Response.error("Announcement not found", 404));
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return res
      .status(200)
      .json(Utils.Response.success("Announcement deleted successfully"));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default del;
