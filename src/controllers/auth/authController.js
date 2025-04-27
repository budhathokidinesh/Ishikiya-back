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
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields",
      });
    }
    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Could not find your email. Please create new account. Thank you",
      });
    }
    //checking password
    const checkPasswordMatch = await bcrypt.compare(password, user.password);
    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again",
      });
    }
    //creating JWT
    const token = jwt.sign({ id: user._id }, process.env.CLIENT_SECRET_KEY, {
      expiresIn: "1d",
    });
    //removing password before sending bak
    const { password: pass, ...rest } = user._doc;
    res
      .cookie("token", token, { httpOnly: true, secure: false })
      .status(200)
      .json({
        success: true,
        message: "Logged in successful",
        user: rest,
        token: token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while login",
    });
  }
};

//Logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
