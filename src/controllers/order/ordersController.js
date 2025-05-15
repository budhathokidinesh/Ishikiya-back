import Order from "../../models/orderModel.js";
//placing order
export const orderController = async (req, res) => {
  const { cart, paymentMethod, transitionId } = req.body;
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
    const newOrder = new Order({
      foods: cart,
      payment: total,
      buyer: req.body.id,
    });
    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      newOrder,
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
    //validation
    if (!orderId) {
      return res.status(404).json({
        success: false,
        message: "Please provide orderId",
      });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Order status is updated successfuly",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while changing order status",
    });
  }
};
