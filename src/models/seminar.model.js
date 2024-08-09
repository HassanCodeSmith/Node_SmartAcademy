import mongoose, { Schema } from "mongoose";

const seminarSchema = new Schema(
    {
        image: {
            type: String,
            required: [true, "Seminar image is required"],
            trim: true,
        },

        phoneNo: {
            type: String,
            required: true,
            trim: true,
        },

        description: [
            {
                active: {
                    type: Boolean,
                    default: true,
                },
                date: {
                    type: Date,
                    required: true,
                },
                details: {
                    type: String,
                    trim: true,
                    required: true,
                },
            },
        ],

        status: {
            type: String,
            enum: ["Pending", "OnGoing", "Completed"],
            default: "Pending",
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
    { timestamps: true, collection: "Seminars" }
);

const Seminar = mongoose.model("Seminar", seminarSchema);

export default Seminar;
