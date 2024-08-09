import mongoose from "mongoose";

const latestNewsSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },

        introduction: {
            type: String,
            required: true,
        },

        header: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        readingTime: {
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
    { timestamps: true, collection: "LatestNews" }
);

const LatestNews = mongoose.model("LatestNews", latestNewsSchema);

export default LatestNews;
