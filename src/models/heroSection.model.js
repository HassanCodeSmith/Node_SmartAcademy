import mongoose, { Schema } from "mongoose";

const heroSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Hero section's title is required"],
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Hero section's description is required"],
      trim: true,
      lowercase: true,
    },

    bgColor: {
      type: String,
      required: [true, "Hero section's bgColor is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Hero section's image is required"],
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "HeroSection" }
);

const HeroSection = mongoose.model("HeroSection", heroSectionSchema);

export default HeroSection;
