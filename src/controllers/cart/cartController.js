import Cart from "../../models/cartModel.js";
import Food from "../../models/foodModel.js";

//Get cart items
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food",
      "title imageUrl price"
    );
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching the cart",
    });
  }
};

//Add item to cart
export const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  try {
    //validation
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    //get user cart and create a new one
    let cart = await Cart.findOne({ user: req.user.id });

    //validation
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }
    //checking if food is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (itemIndex > -1) {
      //food already in the cart, update quantity
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      //food not in cart, add new item
      cart.items.push({
        food: foodId,
        quantity,
        price: food.price,
        total: food.price * quantity,
      });
    }
    cart.totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    await cart.save();
    //populae the  food before sending the response
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while adding the items in cart",
    });
  }
};

//update cart item quantity
export const updateCartItem = async (req, res) => {
  const { foodId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    //validation
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );
    if (itemIndex > -1) {
      //food already in the cart, update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    cart.totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    await cart.save();
    //populae the  food before sending the response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.food",
      "title imageUrl price"
    );
    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updated  cart item",
    });
  }
};

//Removing items from the cart
export const removeFromCart = async (req, res) => {
  const { foodId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);
    cart.totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    await cart.save();
    //populae the  food before sending the response
    const populatedCart = await Cart.findById(cart._id).populate("items.food");
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updated  cart item",
    });
  }
};

//clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while clearing  whole cart",
    });
  }
};
