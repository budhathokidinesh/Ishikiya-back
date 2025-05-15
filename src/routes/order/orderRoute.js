import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  fetchOrderHistory,
  orderController,
  orderStatusController,
} from "../../controllers/order/ordersController.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = express.Router();
//place order(user)
router.post("/placeOrder", authMiddleware, orderController);
//this is for changing order status(admin)
router.put(
  "/orderStatus/:id",
  authMiddleware,
  adminMiddleware,
  orderStatusController
);
//this is for order history(user)
router.get("/history", authMiddleware, fetchOrderHistory);
//this is for order history(Admin)
router.get(
  "/admin/history",
  authMiddleware,
  adminMiddleware,
  fetchOrderHistory
);

export default router;
