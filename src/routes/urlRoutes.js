import { Router } from "express";

import { urlShorten } from "./../controllers/urlController.js";

import { validateToken } from "./../middlewares/authMiddleware.js";
import { validateUrl } from "./../middlewares/urlMiddleware.js";

const urlRoutes = Router();

urlRoutes.post("/shorten", validateToken, validateUrl, urlShorten);

export default urlRoutes;
