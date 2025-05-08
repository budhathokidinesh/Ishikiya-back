import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../controllers/cart/cartController.js";

const router = express.Router();

//cart routers
router.get("/getCart", authMiddleware, getCart);
router.post("/addCart", authMiddleware, addToCart);
router.put("/updateCart", authMiddleware, updateCartItem);
router.delete("/deleteCartItem", authMiddleware, removeFromCart);
router.delete("/clearCart", authMiddleware, clearCart);

export default router;
