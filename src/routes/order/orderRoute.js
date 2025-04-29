import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  orderController,
  orderStatusController,
} from "../../controllers/order/ordersController.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = express.Router();
//place order
router.post("/placeOrder", authMiddleware, orderController);
router.post(
  "/orderStatus/:id",
  authMiddleware,
  adminMiddleware,
  orderStatusController
);

export default router;
