import express from "express";
import { getUserInfo } from "../../controllers/user/userController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

//get user
router.get("/getUser", authMiddleware, getUserInfo);

export default router;
