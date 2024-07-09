import express from "express";
//import { auth } from "../middleware/auth.js";

import { signup, login, logout } from "../controllers/user.js";

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);


export { router as userRoute };