import Order from "../../models/orderModel.js";
//placing order
export const orderController = async (req, res) => {
  const { cart } = req.body;
  try {
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Please provide food cart or payment method",
      });
    }
    //calculate total price
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
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
