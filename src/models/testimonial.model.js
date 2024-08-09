import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        jobRole: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        permanentDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: "Testimonials" }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
