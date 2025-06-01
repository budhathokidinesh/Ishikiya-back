import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../controllers/cart/cartController.js";
import { optionalAuth } from "../../middlewares/optionalAuthMiddleware.js";

const router = express.Router();

//cart routers
router.get("/getCart", optionalAuth, getCart);
router.post("/addCart", optionalAuth, addToCart);
router.put("/updateCart", optionalAuth, updateCartItem);
router.delete("/deleteCartItem", optionalAuth, removeFromCart);
router.delete("/clearCart", optionalAuth, clearCart);

export default router;
