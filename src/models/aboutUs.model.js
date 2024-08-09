import mongoose, { Schema } from "mongoose";

const aboutUsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "About us title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "About us description is required"],
      trim: true,
    },

    aboutList: [
      {
        type: String,
        required: [true, "About us list is required"],
        trim: true,
      },
    ],

    aboutIcon: {
      type: String,
      required: [true, "Icon is required"],
    },

    aboutImage: {
      type: String,
      required: [true, "Image is required"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "AboutUs" }
);

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

export default AboutUs;
