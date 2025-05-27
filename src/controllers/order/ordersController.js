import Order from "../../models/orderModel.js";
import Food from "../../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//placing order
export const orderController = async (req, res) => {
  const { cart, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart cannot be empty",
      });
    }

    // Calculate total and prepare order items
    const stripeLineItems = [];
    for (const item of cart) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item not found: ${item.foodId}`,
        });
      }

      stripeLineItems.push({
        price_data: {
          currency: "aud",
          product_data: {
            name: food.title,
          },
          unit_amount: Math.round(food.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
    }

    // For Stripe payments

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: userId.toString(),
        cart: JSON.stringify(cart),
      },
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id, // Include sessionId
      url: session.url, // Include Stripe URL
      message: "Stripe session created",
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Order processing failed",
    });
  }
};
//changing order status
export const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus, paymentStatus } = req.body;
    //validation
    if (!orderId) {
      return res.status(404).json({
        success: false,
        message: "Please provide orderId",
      });
    }
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData["payment.status"] = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
    //validation for order
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Order status is updated successfuly",
      order: updatedOrder,
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
    const orders = await Order.find()
      .populate({
        path: "items.food",
        select: "title imageUrl price",
        model: "Food",
      })
      .populate({
        path: "buyer",
        select: "name email",
        model: "User",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 })
      .lean();

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
