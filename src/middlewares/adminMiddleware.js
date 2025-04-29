import User from "../models/userModel.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    console.log(req.user);

    const user = await User.findById(req.user?.id);
    console.log("User role:", user?.role);
    if (user?.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Only admin user",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};
