import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema(
    {
        totalStudents: {
            type: Number,
            default: 0,
        },

        totalSuccessfullStudents: {
            type: Number,
            default: 0,
        },

        totalCountries: {
            type: Number,
            default: 0,
        },

        totalCourses: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, collection: "Counters" }
);

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
