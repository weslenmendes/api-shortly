import { Router } from "express";

import { signUp } from "./../controllers/authController.js";

import { validateSignUp } from "./../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignUp, signUp);

export default authRoutes;
