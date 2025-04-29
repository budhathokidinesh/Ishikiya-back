import Food from "../../models/foodModel.js";

//adding food controller
export const foodController = async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    imageUrl,
    salePrice,
    code,
    isAvailable,
    rating,
    ratingCount,
  } = req.body;
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
      salePrice,
      code,
      isAvailable,
      rating,
      ratingCount,
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
    const food = await Food.findById(foodId);
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
      rating,
      ratingCount,
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
        rating,
        ratingCount,
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
