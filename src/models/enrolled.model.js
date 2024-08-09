import { Schema, model } from "mongoose";

const enrolledSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
        },

        qualification: {
            type: String,
            trim: true,
        },

        degree: {
            type: String,
            trim: true,
        },

        cnic: {
            type: String,
            trim: true,
        },

        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },

        status: {
            type: String,
            enum: ["Pending", "Confirm", "Rejected", "Complete"],
            default: "Pending",
        },
    },
    { timestamps: true, collection: "Enrolled" }
);

const Enrolled = model("Enrolled", enrolledSchema);

export default Enrolled;
