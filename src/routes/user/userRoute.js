import express from "express";
import {
  getUserInfo,
  updateUser,
} from "../../controllers/user/userController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { forgotPassword } from "../../controllers/password/forgotPassword.js";
import { resetPassword } from "../../controllers/password/resetPassword.js";

const router = express.Router();

//get user
router.get("/getUser", authMiddleware, getUserInfo);
router.put("/updateUser", authMiddleware, updateUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
