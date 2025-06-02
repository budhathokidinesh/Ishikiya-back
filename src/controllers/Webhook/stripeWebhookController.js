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
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const cart = JSON.parse(session.metadata.cart || "[]");
    const userId = session.metadata.userId || null;
    const guestId = session.metadata.guestId || null;
    const guestInfo = JSON.parse(session.metadata.guestInfo || "{}");

    try {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart) {
        const food = await Food.findById(item.foodId);
        if (!food) {
          console.warn(`Food item not found: ${item.foodId}`);
          continue;
        }

        const itemTotal = food.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          food: food._id,
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
        buyer: userId || null,
        guestId: guestId || null,
        guestInfo: guestInfo || null, // Optional: if you're storing guest info
        status: "Order Placed",
      });

      console.log("✅ Order created successfully (user or guest)");
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Error saving order:", err);
      return res.status(500).send("Failed to process order");
    }
  }

  res.status(200).json({ received: true }); // for other event types
};
