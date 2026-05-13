import express from "express";
import { register, verify, login, getProfile } from "../controllers/user.controller.js";
import isLoggedin from "../middleware/isLoggedin.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verify);
router.post("/login", login);  
router.get("/get-profile", isLoggedin, getProfile);

export default router;