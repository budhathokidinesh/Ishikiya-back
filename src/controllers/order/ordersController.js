import Order from "../../models/orderModel.js";
import Food from "../../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//placing order
export const orderController = async (req, res) => {
  const { cart, paymentMethod, transitionId, stripePaymentId } = req.body;
  const userId = req.user.id;
  try {
    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart can not be empty",
      });
    }
    //calculate total price
    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item with ID ${item.foodId} not found`,
        });
      }
      orderItems.push({
        food: item.foodId,
        quantity: item.quantity,
        price: food.price,
      });

      totalAmount += item.quantity * food.price;
    }
    totalAmount = parseFloat(totalAmount.toFixed(2));

    //this is for stripe payment
    let paymentTransitionId = transitionId || null;
    if (paymentMethod === "Stripe") {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100),
          currency: "aud",
          payment_method: stripePaymentId,
          confirm: true,
        });
        paymentTransitionId = paymentIntent.id;
      } catch (stripeError) {
        return res.status(400).json({
          success: false,
          message: "Stripe payment failed",
          error: stripeError.message,
        });
      }
    }
    // this is for other type of order
    const newOrder = await Order.create({
      items: orderItems,
      totalAmount,
      payment: {
        method: paymentMethod || "Cash",
        transitionId: transitionId || null,
        status: paymentMethod === "Stripe" ? "Paid" : "Pending",
      },
      buyer: userId,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while placing order",
    });
  }
};
//changing order status
export const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    //validation
    if (!orderId) {
      return res.status(404).json({
        success: false,
        message: "Please provide orderId",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    //validation for order
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Order status is updated successfuly",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while changing order status",
    });
  }
};

//Ths is for fetching the Order History for loggedin user
export const fetchOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ buyer: userId })
      .populate("items.food", "title imageUrl price")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured while fetching order history",
    });
  }
};
//this is for fetching all the order history for admin
export const fetchAllOrdersAdmin = async (req, res) => {
  try {
    //admin validation
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only",
      });
    }
    const orders = await Order.find()
      .populate("foods", "title imageUrl price")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured while fetching order history",
    });
  }
};
