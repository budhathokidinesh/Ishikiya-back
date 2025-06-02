import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  fetchAllOrdersAdmin,
  fetchOrderHistory,
  orderController,
  orderStatusController,
} from "../../controllers/order/ordersController.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { optionalAuth } from "../../middlewares/optionalAuthMiddleware.js";

const router = express.Router();
//place order(user)
router.post("/placeOrder", optionalAuth, orderController);
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
  fetchAllOrdersAdmin
);

export default router;
