import Cart from "../../models/cartModel.js";
import Food from "../../models/foodModel.js";

// Get cart
export const getCart = async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.query.guestId;

  if (!userId && !guestId) {
    return res.status(401).json({
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
    return res.status(401).json({
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
    return res.status(401).json({
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
    return res.status(401).json({
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
    return res.status(401).json({
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

//This is synchronizing the cart items

export const syncGuestCartToUser = async (req, res) => {
  const userId = req.user?.id;
  const { guestId } = req.body;

  if (!userId || !guestId) {
    return res.status(400).json({
      success: false,
      message: "Missing user ID or guest ID for cart sync",
    });
  }

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    if (!guestCart || guestCart.items.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No guest cart to sync" });
    }

    if (!userCart) {
      // If user has no cart, assign guest cart to user
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json({
        success: true,
        message: "Guest cart assigned to user",
        cart: guestCart,
      });
    }

    // Merge items if both carts exist
    const mergedItems = mergeCartItems(userCart.items, guestCart.items);

    userCart.items = mergedItems;
    await userCart.save();

    // Delete the guest cart
    await Cart.deleteOne({ guestId });

    const populatedCart = await Cart.findById(userCart._id).populate(
      "items.food",
      "title imageUrl price"
    );

    res.status(200).json({
      success: true,
      message: "Guest cart merged into user cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ success: false, message: "Error syncing carts" });
  }
};

function mergeCartItems(userItems, guestItems) {
  const map = new Map();

  for (const item of userItems) {
    map.set(item.food.toString(), { ...item.toObject() });
  }

  for (const item of guestItems) {
    const foodId = item.food.toString();
    if (map.has(foodId)) {
      const existing = map.get(foodId);
      existing.quantity += item.quantity;
      existing.total = existing.quantity * existing.price;
    } else {
      map.set(foodId, { ...item.toObject() });
    }
  }

  return Array.from(map.values());
}
