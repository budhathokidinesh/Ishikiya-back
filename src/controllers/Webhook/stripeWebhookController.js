import Stripe from "stripe";
import Order from "../../models/orderModel.js";
import Food from "../../models/foodModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
  console.log("➡️ Webhook received");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // from your Stripe dashboard
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle only completed payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const cart = JSON.parse(session.metadata.cart);

    try {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart) {
        const food = await Food.findById(item.foodId);
        if (!food) {
          console.warn(`Food item not found in webhook: ${item.foodId}`);
          continue;
        }

        const itemTotal = food.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          food: item.foodId,
          quantity: item.quantity,
          price: food.price,
        });
      }

      await Order.create({
        items: orderItems,
        totalAmount,
        payment: {
          method: "Stripe",
          status: "Paid",
          transitionId: session.payment_intent,
        },
        buyer: userId,
        status: "Order Placed",
      });

      console.log("✅ Order successfully created after payment");
      res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Error creating order from webhook:", err);
      res.status(500).send("Error processing order");
    }
  } else {
    res.status(200).json({ received: true }); // For unhandled events
  }
};
