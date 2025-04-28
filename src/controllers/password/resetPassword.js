import crypto from "crypto";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
//reset password controller
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    //hash token again to match what we stored
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }
    //hashing password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    //update user's password
    user.password = hashedPassword;
    //clear the reset token and expiry fields
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);

    //save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can log in with your new password",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while reseting password",
    });
  }
};
