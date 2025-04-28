import express from "express";
import {
  getUserInfo,
  updateUser,
} from "../../controllers/user/userController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { forgotPassword } from "../../controllers/password/forgotPassword.js";

const router = express.Router();

//get user
router.get("/getUser", authMiddleware, getUserInfo);
router.put("/updateUser", authMiddleware, updateUser);
router.post("/forgotPassword", forgotPassword);

export default router;
