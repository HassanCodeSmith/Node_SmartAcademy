import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            trim: true,
            required: true,
        },

        courseCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseCategory",
            required: true,
        },

        courseDuration: {
            type: String,
            trim: true,
            required: true,
        },

        lectures: {
            type: String,
            trim: true,
        },

        level: {
            type: String,
            trim: true,
        },

        duration: {
            type: String,
            trim: true,
        },

        days: [],

        fromTime: {
            type: Date,
        },

        toTime: {
            type: Date,
        },

        pricePerMonth: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        FAQs: [
            {
                question: String,
                answer: String,
            },
        ],

        enrolled: {
            type: String,
            default: "",
        },

        courseFeatures: {
            type: String,
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        permanentDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: "Courses" }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
