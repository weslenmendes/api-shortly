import { Router } from "express";

import { signUp, signIn } from "./../controllers/authController.js";

import {
  validateSignInBody,
  validateSignUpBody,
} from "./../middlewares/validationMiddleware.js";

import {
  validateSignUp,
  validateSignIn,
} from "./../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignUpBody, validateSignUp, signUp);
authRoutes.post("/signin", validateSignInBody, validateSignIn, signIn);

export default authRoutes;
