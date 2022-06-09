import { Router } from "express";

import authRoutes from "./authRoutes.js";
import urlRoutes from "./urlRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = Router();

routes.use("/", authRoutes);
routes.use("/urls", urlRoutes);
routes.use("/users", userRoutes);

export default routes;
