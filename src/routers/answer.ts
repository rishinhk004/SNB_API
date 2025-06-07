import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Answers.create);
router.delete("/:id", Controllers.Answers.deleteById);
router.get("/question/:questionId", Controllers.Answers.read);

export default router;
