import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Enrollments.createEnrollment);
router.delete("/", Controllers.Enrollments.deleteEnrollment);

export default router;
