/** __________ Models __________ */
import LatestNews from "../models/latestNews.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Create Latest News
 */
export const createLatestNews = asyncHandler(async (req, res) => {
    const userId = req.userId;

    trimObjects(req.body);

    const requiredFields = [
        "date",
        "introduction",
        "header",
        "description",
        "readingTime",
    ];

    const missingFields = filterMissingFields(req.body, requiredFields);

    if (!req.file) {
        missingFields.push("image");
    }

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }

        throw new ApiError(401, `Please provide ${missingFields.join(", ")}`);
    }

    req.body.image = req.file.path.replace(/\\/g, "/");
    req.body.createdBy = userId;

    const newLatestNews = await LatestNews.create(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse("Lates news created successfully", newLatestNews)
        );
});

/**
 * Get All Latest Newses
 */
export const getAllLatestNewses = asyncHandler(async (req, res) => {
    const allLatestNewses = await LatestNews.find({
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    const message =
        allLatestNewses.length === 0
            ? "Latest News collection is empty"
            : "Latest News collection fetched successfully";

    return res.status(200).json(new ApiResponse(message, allLatestNewses));
});

/**
 * Get Latest News
 */
export const getLatestNews = asyncHandler(async (req, res) => {
    const { latestNewsId } = req.params;

    const latestNews = await LatestNews.findOne({
        _id: latestNewsId,
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    if (!latestNews) {
        throw new ApiError(401, "Latest News not found");
    }

    return res
        .status(200)
        .json(new ApiResponse("Latest News found successfully", latestNews));
});

/**
 * Update Latest News
 */
export const updateLatestNews = asyncHandler(async (req, res) => {
    const { latestNewsId } = req.params;

    const latestNews = await LatestNews.findOne({
        _id: latestNewsId,
        permanentDeleted: false,
    });

    if (!latestNews) {
        throw new ApiError(401, "Latest news not found");
    }

    trimObjects(req.body);

    if (req.body.date) {
        latestNews.date = req.body.date;
    }

    if (req.body.introduction) {
        latestNews.introduction = req.body.introduction;
    }

    if (req.body.header) {
        latestNews.header = req.body.header;
    }

    if (req.body.description) {
        latestNews.description = req.body.description;
    }

    if (req.body.readingTime) {
        latestNews.readingTime = req.body.readingTime;
    }

    if (req.file) {
        latestNews.image = req.file.path.replace(/\\/g, "/");
    }

    await latestNews.save();

    return res
        .status(200)
        .json(new ApiResponse("Latest News updated successfully", latestNews));
});

/**
 * Delete Latest News
 */
export const deleteLatestNews = asyncHandler(async (req, res) => {
    const { latestNewsId } = req.params;

    const deletedLatestNews = await LatestNews.findOneAndUpdate(
        {
            _id: latestNewsId,
            permanentDeleted: false,
        },
        { permanentDeleted: true },
        { new: true }
    );

    if (!deletedLatestNews) {
        throw new ApiError(404, "Latest news not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                "Latest news deleted successfully",
                deletedLatestNews
            )
        );
});
