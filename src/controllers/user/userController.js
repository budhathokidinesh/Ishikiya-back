import User from "../../models/userModel.js";
//get userInfo
export const getUserInfo = async (req, res) => {
  try {
    //find user
    const user = await User.findById({ _id: req.user.id });
    //validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //hide password
    (user.password = undefined),
      //respond
      res.status(200).json({
        success: true,
        message: "User found successfully",
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while getting user info",
    });
  }
};
//updating user
export const updateUser = async (req, res) => {
  try {
    const { name, phone, imageUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(imageUrl && { imageUrl }),
      },
      { new: true, runValidators: true }
    );
    //validation
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updating user",
    });
  }
};
