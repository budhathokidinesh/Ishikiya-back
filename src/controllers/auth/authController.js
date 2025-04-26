import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = (req, res) => {
  try {
    console.log("This page is comming soon");
    res.status(200).json({
      success: true,
      message: "User is registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while registering the user",
    });
  }
};
