import express from "express";
import * as Controllers from "../controllers";
import * as Middlewares from "../middlewares";
const router = express.Router();

router.post(
  "/",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Sessions.generateSessions
);
router.post(
  "/generateOne",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Sessions.createSession
);
router.get("/course/:courseId/status", Controllers.Sessions.getTodayStatus);
router.patch(
  "course/:courseId/cancelToday",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Sessions.cancelToday
);

export default router;
