import express from "express";
import {
  foodController,
  getAllFoodController,
  getSingleFood,
} from "../../controllers/food/foodController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();
//add food
router.post("/addFood", authMiddleware, foodController);
//get all foods
router.get("/getAllFoods", getAllFoodController);

//get single food
router.get("/getFood/:id", getSingleFood);

export default router;
