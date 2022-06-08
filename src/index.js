import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(json());

app.use(routes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
