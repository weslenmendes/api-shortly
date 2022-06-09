import { Router } from "express";

import { getUser } from "./../controllers/userController.js";

import { validateToken } from "./../middlewares/authMiddleware.js";

const userRoutes = Router();

userRoutes.get("/:id", validateToken, getUser);

export default userRoutes;
