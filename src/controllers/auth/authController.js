import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

//Register user
export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, profileImage } = req.body;
  try {
    //validation
    if (!name || !email || !password || !phone) {
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
          "Email already registered with this email. Please provide new email",
        code: "EMAIL_EXISTS",
      });
    }
    //hasing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    //create otp
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //create new user
    const newUser = new User({
      name,
      email,
      otp,
      password: hashedPassword,
      phone,
      role,
      profileImage,
    });
    await newUser.save();
    //this is for sending otp for verification email
    //transporter
    //This need to be in seperate controller for handling all the email related controller
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false,
    });
    const mailOptions = {
      from: '"Restaurant Support" <physmarika@gmail.com>',
      to: email,
      subject: "otp for email verification",
      text: `Your verification otp is ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error occured while sending email",
        });
      }
      return res.status(201).json({
        success: true,
        message: "Otp is sent to your email",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while registering the user",
    });
  }
};

//Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
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
    // checking user is verified or not
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is not verified. Please verify your email before logging in",
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
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/",
      })
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "Strict",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
