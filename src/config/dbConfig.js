import mongoose from "mongoose";
export const dbConnect = () => {
  if (!process.env.MONGO_URL) {
    throw new Error("Please provide MONGO_URL connection string");
  }
  return mongoose.connect(process.env.MONGO_URL);
};
