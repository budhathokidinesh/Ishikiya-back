import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;

import cors from "cors";
import cookieparser from "cookie-parser";
import { dbConnect } from "./src/config/dbConfig.js";

//importing routes
import authRoutes from "./src/routes/auth/authRoute.js";

import adminRoutes from "./src/routes/admin/adminRoutes.js";
import morgan from "morgan";

//middlewares
app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(morgan("dev"));

//endpoit APIs
app.use("/api/v1/auth", authRoutes);

app.use("/api/admin", adminRoutes);

//this is for health check
app.get("/", (req, res) => {
  console.log("server is live");
  res.send("Server is live");
});

//db connection and server setup
dbConnect().then(() => {
  app.listen(PORT, (error) => {
    error
      ? console.log(error)
      : console.log("Server is running at http://localhost:" + PORT);
  });
});
