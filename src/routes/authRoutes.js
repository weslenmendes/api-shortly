import { Router } from "express";

import { signUp, signIn } from "./../controllers/authController.js";

import {
  validateSignUp,
  validateSignIn,
} from "./../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignUp, signUp);
authRoutes.post("/signin", validateSignIn, signIn);

export default authRoutes;
