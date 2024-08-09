import mongoose, { Schema } from "mongoose";

const courseCategorySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Course category's title is required"],
            trim: true,
        },

        image: {
            type: String,
            trim: true,
            required: true,
        },

        description: {
            type: String,
            trim: true,
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        permanentDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: "CourseCategories" }
);

const CourseCategory = mongoose.model("CourseCategory", courseCategorySchema);

export default CourseCategory;
