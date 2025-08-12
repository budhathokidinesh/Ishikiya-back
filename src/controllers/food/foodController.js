import Food from "../../models/foodModel.js";
//I need to fix this one as  well
//adding food controller
export const addFoodController = async (req, res) => {
  const { title, description, category, price, imageUrl, isAvailable } =
    req.body;
  try {
    //validation
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide required field",
      });
    }
    const newFood = new Food({
      title,
      description,
      category,
      price,
      imageUrl,
      isAvailable,
    });
    await newFood.save();
    res.status(201).json({
      success: true,
      message: "Food has been saved",
      newFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while adding food",
    });
  }
};

//get all food controller
export const getAllFoodController = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json({
      success: true,
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        success: false,
        message: "Error occured while fetching all foods",
      });
  }
};
//get sigle food
export const getSingleFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    //validation for Id
    if (!foodId) {
      return res.status(404).json({
        success: false,
        message: "Please provide Id",
      });
    }
    const food = await Food.findById(foodId).populate({
      path: "reviews.user",
      select: "name",
    });
    //validation for food
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food could not found",
      });
    }
    //res
    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while getting single food",
    });
  }
};
//update food item
export const updateFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    //validation of Id
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Please provide food id",
      });
    }
    const food = await Food.findById(foodId);
    //validation of food
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food could not find with this Id",
      });
    }
    const {
      title,
      description,
      category,
      price,
      imageUrl,
      salePrice,
      code,
      isAvailable,
    } = req.body;
    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      {
        title,
        description,
        category,
        price,
        imageUrl,
        salePrice,
        code,
        isAvailable,
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Food item is updated successfully",
      updatedFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updating food",
    });
  }
};
//delete food item
export const deleteFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    //validation of Id
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Please provide food id",
      });
    }
    const food = await Food.findById(foodId);
    //validation of food
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food could not find with this Id",
      });
    }
    await Food.findByIdAndDelete(foodId);
    res.status(200).json({
      success: true,
      message: "Food item is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while deleting food",
    });
  }
};

//this is for food review
export const addFoodReviewController = async (req, res) => {
  const { foodId } = req.params;
  const { comment } = req.body;
  try {
    const food = await Food.findById(foodId);
    //validation
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    //check already reviewed or not
    const alreadyReviewed = food.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this food",
      });
    }
    const review = {
      user: req.user._id,
      comment,
    };
    food.reviews.push(review);
    await food.save();

    res.status(201).json({
      message: true,
      message: "Review added successfully",
      food,
    });
  } catch (error) {
    console.log("Reviews Error", error);
    res.status(500).json({
      success: false,
      message: "Error adding reviews",
    });
  }
};
