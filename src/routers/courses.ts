import express from "express";
import * as Controllers from "../controllers";
import * as Middlewares from "../middlewares";

const router = express.Router();

router.post(
  "/",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Courses.create
);
router.get("/", Controllers.Courses.readAll);
router.get("/:id", Controllers.Courses.read);
router.delete(
  "/:id",
  Middlewares.authenticate,
  Middlewares.isProfessor,
  Controllers.Courses.del
);

export default router;
