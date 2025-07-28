import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.get("/", Controllers.User.readAll);
router.get("/:id", Controllers.User.read);
router.patch("/:id", Controllers.User.update);
router.get("/timetable", Controllers.User.routine);

export default router;
