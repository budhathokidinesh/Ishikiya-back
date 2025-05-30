import mongoose from "mongoose";
//this is review schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//this is food model
const FoodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://images.pexels.com/photos/1123250/pexels-photo-1123250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", FoodSchema);
export default Food;
