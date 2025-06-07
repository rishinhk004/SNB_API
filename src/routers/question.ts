import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Questions.create);
router.delete("/:id", Controllers.Questions.deleteById);
router.get("/course/:courseId", Controllers.Questions.read);

export default router;
