import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import { User } from "@prisma/client"; // ✅ Import the Prisma User type

const read: Interfaces.Controllers.Async = async (req, res, next) => {
  const { id } = req.params as { id?: string };

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              include: {
                professor: {
                  select: { name: true },
                },
              },
            },
          },
        },
        coursesTaught: true,
      },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    const userSafe = Utils.omit(user, ["firebaseId"]);
    return res.json(Utils.Response.success(userSafe));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

const readAll: Interfaces.Controllers.Async = async (_req, res, next) => {
  try {
    const users: User[] = await prisma.user.findMany();

    // ✅ Explicitly type the map callback parameter
    const usersSafe = users.map((user: User) =>
      Utils.omit(user, ["firebaseId"])
    );

    return res.json(Utils.Response.success(usersSafe));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export { read, readAll };
