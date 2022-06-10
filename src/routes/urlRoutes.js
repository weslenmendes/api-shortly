import { Router } from "express";

import {
  urlShorten,
  getUrl,
  redirect,
  deleteUrl,
} from "./../controllers/urlController.js";

import { validateToken } from "./../middlewares/authMiddleware.js";
import { validateUrl } from "./../middlewares/validationMiddleware.js";

const urlRoutes = Router();

urlRoutes.post("/shorten", validateToken, validateUrl, urlShorten);
urlRoutes.get("/:id", getUrl);
urlRoutes.get("/open/:shortUrl", redirect);
urlRoutes.delete("/:id", validateToken, deleteUrl);

export default urlRoutes;
