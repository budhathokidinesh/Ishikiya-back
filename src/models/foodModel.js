import mongoose from "mongoose";
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
    salePrice: {
      type: Number,
    },
    code: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", FoodSchema);
export default Food;
