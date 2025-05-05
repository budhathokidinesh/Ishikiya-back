import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
} from "../../controllers/auth/authController.js";
import { forgotPassword } from "../../controllers/password/forgotPassword.js";
import { resetPassword } from "../../controllers/password/resetPassword.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user,
  });
});

export default router;
