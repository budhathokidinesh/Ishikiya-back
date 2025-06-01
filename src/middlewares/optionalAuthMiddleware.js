import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user; // attach user if exists
      }
    } catch (error) {
      // If token is invalid/expired, skip (don’t block guest)
      console.log("Optional auth failed: ", error.message);
    }
  }

  next(); // Always proceed
};
