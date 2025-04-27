import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";

//Register user
export const registerUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    //validation
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required field",
      });
    }
    //checking duplication
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registerd with this email. Please provide new email",
      });
    }
    //hasing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    //create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });
    await newUser.save();
    res.status(201).send({
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

//Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.res;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while login",
    });
  }
};
