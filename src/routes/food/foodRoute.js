import express from "express";
import {
  addFoodController,
  addFoodReviewController,
  deleteFoodController,
  getAllFoodController,
  getSingleFood,
  updateFoodController,
} from "../../controllers/food/foodController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = express.Router();
//add food
router.post("/addFood", authMiddleware, addFoodController);
//get all foods
router.get("/getAllFoods", getAllFoodController);

//get single food
router.get("/getFood/:id", getSingleFood);
//update food
router.put(
  "/updateFood/:id",
  authMiddleware,
  adminMiddleware,
  updateFoodController
);
//delete food
router.delete(
  "/deleteFood/:id",
  authMiddleware,
  adminMiddleware,
  deleteFoodController
);
router.post("/:foodId/reviews", authMiddleware, addFoodReviewController);

export default router;
