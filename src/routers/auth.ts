import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/signUp", Controllers.Auth.create);
router.post("/signIn", Controllers.Auth.Login);

export default router;
