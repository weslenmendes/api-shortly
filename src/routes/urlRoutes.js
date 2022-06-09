import { Router } from "express";

import {
  urlShorten,
  getUrl,
  redirect,
} from "./../controllers/urlController.js";

import { validateToken } from "./../middlewares/authMiddleware.js";
import { validateUrl } from "./../middlewares/urlMiddleware.js";

const urlRoutes = Router();

urlRoutes.post("/shorten", validateToken, validateUrl, urlShorten);
urlRoutes.get("/:id", getUrl);
urlRoutes.get("/open/:shortUrl", redirect);

export default urlRoutes;
