import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription's name is required"],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Subscription's email is required"],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true, collection: "Subscriptions" }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
