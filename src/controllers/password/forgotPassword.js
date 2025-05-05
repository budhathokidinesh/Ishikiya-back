import nodemailer from "nodemailer";
import User from "../../models/userModel.js";
import crypto from "crypto";
// stmp transporter set up

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false,
});

//forgot password controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    //email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }
    const user = await User.findOne({ email });
    //user validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    //generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //save token and expiry date in user
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();
    //setting url
    const resetUrl = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;

    //Email content
    const mailOptions = {
      from: '"Restaurant Support" <physmarika@gmail.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
             <h1>Forgot Your Password?</h1>
        <p>We received a request to reset your password. Click the link below to choose a new password:</p>
        <a href="${resetUrl}" style="padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none;">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
            `,
    };
    await transporter.sendMail(mailOptions);

    //response
    res.status(200).json({
      success: true,
      message: `Reset password link sent to ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
