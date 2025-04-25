import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;

import cors from "cors";
import cookieparser from "cookie-parser";
import { dbConnect } from "./src/config/dbConfig.js";

//middlewares
app.use(cors());
app.use(cookieparser());
app.use(express.json());

//this is for health check
app.get("/", (req, res) => {
  console.log("server is live");
});

//db connection and server setup
dbConnect().then(() => {
  app.listen(PORT, (error) => {
    error
      ? console.log(error)
      : console.log("Server is running at http://localhost:" + PORT);
  });
});
