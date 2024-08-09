/** __________ Models __________ */
import Seminar from "../models/seminar.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Create Seminar
 */
export const createSeminar = asyncHandler(async (req, res) => {
    const userId = req.userId;

    trimObjects(req.body);

    const { description, phoneNo } = req.body;

    let missingFields = [];

    if (!description) {
        missingFields.push("Description");
    }

    description.forEach((item) => {
        if (item.date === "") {
            missingFields.push("Date");
        }
        if (item.details === "") {
            missingFields.push("Details");
        }
    });

    if (!phoneNo) {
        missingFields.push("Phone No");
    }

    if (!req.file) {
        missingFields.push("Image");
    }

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }
        throw new ApiError(400, `Please provide ${missingFields.join(", ")}`);
    }

    req.body.image = req.file.path.replace(/\\/g, "/");

    req.body.createdBy = userId;

    await Seminar.create(req.body);

    return res
        .status(200)
        .json(new ApiResponse("Seminar created successfully."));
});

/**
 * Update Seminar
 */
export const authUpdateSeminar = asyncHandler(async (req, res) => {
    const { seminarId } = req.params;

    const seminar = await Seminar.findOne({ _id: seminarId });

    if (!seminar) {
        throw new ApiError(409, "Seminar not found");
    }

    /** trim req.body object */
    trimObjects(req.body);

    if (req?.body?.phoneNo) {
        seminar.phoneNo = req.body.phoneNo;
    }

    if (req?.body?.description) {
        seminar.description = req.body.description;
    }

    if (req?.file) {
        seminar.image = req.file.path.replace(/\\/g, "/");
    }

    await seminar.save();

    return res
        .status(200)
        .json(new ApiResponse("Seminar updated successfully."));
});

/**
 * get seminar
 */
export const getAllSeminars = asyncHandler(async (req, res) => {
    /** get seminar details from db */
    const seminar = await Seminar.find({
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    if (!seminar) {
        return res
            .status(200)
            .json(new ApiResponse("There is no any seminar conducted"));
    }

    return res
        .status(200)
        .json(new ApiResponse("Seminar fetched successfully.", seminar));
});

/**
 * Get By Id
 */
export const getSeminar = asyncHandler(async (req, res) => {
    const { seminarId } = req.params;

    const semianr = await Seminar.findOne({
        _id: seminarId,
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    if (!semianr) {
        throw new ApiError(404, "Seminar not found");
    }

    return res
        .status(200)
        .json(new ApiResponse("Seminar found successfully", semianr));
});
