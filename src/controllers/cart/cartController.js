import Cart from "../../models/cartModel.js";
import Food from "../../models/foodModel.js";

// Get cart
export const getCart = async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.query.guestId;

  if (!userId && !guestId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: missing user ID or guest ID",
      });
  }

  try {
    const cart = await Cart.findOne(
      userId ? { user: userId } : { guestId }
    ).populate("items.food", "title imageUrl price");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  const userId = req.user?.id;
  const { foodId, quantity, guestId } = req.body;

  if (!userId && !guestId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: missing user ID or guest ID",
      });
  }

  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    let cart = await Cart.findOne(userId ? { user: userId } : { guestId });

    if (!cart) {
      cart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || undefined,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      cart.items.push({
        food: foodId,
        quantity,
        price: food.price,
        total: food.price * quantity,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.food",
      "title imageUrl price"
    );

    res.status(200).json({
      success: true,
      message: "Food added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item to cart" });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  const userId = req.user?.id;
  const { foodId, quantity, guestId } = req.body;

  if (!userId && !guestId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: missing user ID or guest ID",
      });
  }

  try {
    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );
    if (itemIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Item not in cart" });

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.food",
      "title imageUrl price"
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating cart item" });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user?.id;
  const { foodId, guestId } = req.body;

  if (!userId && !guestId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: missing user ID or guest ID",
      });
  }

  try {
    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.food",
      "title imageUrl price"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error removing item from cart" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  const userId = req.user?.id;
  const { guestId } = req.body;

  if (!userId && !guestId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: missing user ID or guest ID",
      });
  }

  try {
    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};
