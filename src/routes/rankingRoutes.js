import { Router } from "express";

import { ranking } from "./../controllers/userController.js";

const rankingRoutes = Router();

rankingRoutes.get("/", ranking);

export default rankingRoutes;
