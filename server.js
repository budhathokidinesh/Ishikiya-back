import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;

import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";
import { dbConnect } from "./src/config/dbConfig.js";

//importing routes
import authRoutes from "./src/routes/auth/authRoute.js";
import adminRoutes from "./src/routes/admin/adminRoutes.js";
import userRoutes from "./src/routes/user/userRoute.js";
import foodRoutes from "./src/routes/food/foodRoute.js";

//middlewares
app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(morgan("dev"));

//endpoit APIs(auth)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
//end points APIs(food)
app.use("/api/v1/food", foodRoutes);
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
