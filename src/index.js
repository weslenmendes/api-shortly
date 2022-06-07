import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send({ msg: "Server is running" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
