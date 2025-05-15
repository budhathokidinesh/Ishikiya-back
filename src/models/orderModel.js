import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      method: { type: String, default: "Cash" },
      transitionId: { type: String },
      status: { type: String, default: "Pending" },
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Order Placed", "Processing", "Ready", "Completed", "Cancelled"],
      default: "Order placed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
