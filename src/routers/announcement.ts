import express from "express";
import * as Controllers from "../controllers";
import * as Middlewares from "../middlewares";
const router = express.Router();

router.post(
  "/",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Announcements.create
);
router.delete(
  "/:id",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Announcements.del
);
router.get("/course/:courseId", Controllers.Announcements.readAll);
router.get("/:id", Controllers.Announcements.read);

export default router;
