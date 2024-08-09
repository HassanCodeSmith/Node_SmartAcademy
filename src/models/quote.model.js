import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
        },

        phoneNo: {
            type: String,
            required: [true, "Phone Number is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already taken"],
            trim: true,
            lowercase: true,
        },

        select: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: [true, "Message is required"],
        },
    },
    { timestamps: true, collection: "Quotes" }
);

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
