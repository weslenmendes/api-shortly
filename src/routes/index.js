import { Router } from "express";

import authRoutes from "./authRoutes.js";
import urlRoutes from "./urlRoutes.js";

const routes = Router();

routes.use("/", authRoutes);
routes.use("/urls", urlRoutes);

export default routes;
