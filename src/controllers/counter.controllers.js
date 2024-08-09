/** __________ Models __________ */
import Counter from "../models/counter.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Create Counter
 */
export const authCreateCounter = asyncHandler(async (req, res) => {
    const isCounterExists = await Counter.findOne();
    if (isCounterExists) {
        throw new ApiError(409, "Counter already exists");
    }

    trimObjects(req.body);

    await Counter.create(req.body);

    return res
        .status(201)
        .json(new ApiResponse("Counter created successfully"));
});

/**
 * Update Counter
 */
export const authUpdateCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findOne();
    if (!counter) {
        throw new ApiError(404, "Counter not found");
    }

    trimObjects(req.body);

    if (req.body.totalStudents) {
        counter.totalStudents = req.body.totalStudents;
    }

    if (req.body.totalSuccessfullStudents) {
        counter.totalSuccessfullStudents = req.body.totalSuccessfullStudents;
    }

    if (req.body.totalCountries) {
        counter.totalCountries = req.body.totalCountries;
    }

    if (req.body.totalCourses) {
        counter.totalCourses = req.body.totalCourses;
    }

    await counter.save();

    return res
        .status(200)
        .json(new ApiResponse("Counter updated successfully"));
});

/**
 * Get Counter
 */
export const publicGetCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findOne();
    if (!counter) {
        return res
            .status(200)
            .json(new ApiResponse("There is no any counter", counter));
    }

    return res
        .status(200)
        .json(new ApiResponse("Counter fetched successfully", counter));
});
