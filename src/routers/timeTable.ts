import express from "express";
import * as Controllers from "../controllers";
import * as Middlewares from "../middlewares";

const router = express.Router();

router.post(
  "/",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.TimeTable.createTimetable
);
router.patch(
  "/:id",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.TimeTable.updateTimetable
);
router.delete(
  "/",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.TimeTable.del
);
export default router;
