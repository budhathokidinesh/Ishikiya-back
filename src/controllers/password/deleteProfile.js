import User from "../../models/userModel.js";

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    //validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //deleting user permanently
    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while deleting profile",
    });
  }
};
