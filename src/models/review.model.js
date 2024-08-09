import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },

        name: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            trim: true,
            required: true,
        },

        phoneNo: {
            type: String,
            trim: true,
            required: true,
        },

        rating: {
            type: Number,
            default: 0,
        },

        review: {
            type: String,
            default: 0,
        },
    },
    { timestamps: true, collection: "Reviews" }
);

const Review = model("Reviews", reviewSchema);

export default Review;
