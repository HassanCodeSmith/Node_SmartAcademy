/** __________ Models __________ */
import AboutUs from "../models/aboutUs.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Create About Us
 */
export const authCreateAboutUs = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const isAboutUsExists = await AboutUs.find();
    if (isAboutUsExists.length > 0) {
        throw new ApiError(409, "About Us already created");
    }

    const aboutIcon = req.files["aboutIcon"] ? req.files["aboutIcon"][0] : null;
    const aboutImage = req.files["aboutImage"]
        ? req.files["aboutImage"][0]
        : null;

    if (!aboutIcon || !aboutImage) {
        throw new ApiError(
            400,
            "Both aboutIcon and aboutImage must be provided"
        );
    }

    trimObjects(req.body);

    const { title, description, aboutList } = req.body;

    if (!(title && description && aboutList.length > 0)) {
        throw new ApiError(400, "All fields must be provided");
    }

    req.body.createdBy = userId;
    req.body.aboutIcon = aboutIcon.path;
    req.body.aboutImage = aboutImage.path;

    await AboutUs.create(req.body);

    return res
        .status(200)
        .json(new ApiResponse("About us created successfully."));
});

/**
 * Update About Us
 */
export const authUpdateAboutUs = asyncHandler(async (req, res) => {
    const aboutUs = await AboutUs.findOne();

    if (aboutUs.length === 0) {
        throw new ApiError(404, "About us not found");
    }

    if (req.body.title) {
        aboutUs.title = req.body.title;
    }
    if (req.body.description) {
        aboutUs.description = req.body.description;
    }
    if (req.body.aboutList) {
        aboutUs.aboutList = req.body.aboutList;
    }

    const aboutIcon = req.files["aboutIcon"] ? req.files["aboutIcon"][0] : null;
    const aboutImage = req.files["aboutImage"]
        ? req.files["aboutImage"][0]
        : null;

    if (aboutIcon) {
        aboutUs.aboutIcon = aboutIcon.path;
    }

    if (aboutImage) {
        aboutUs.aboutImage = aboutImage.path;
    }

    await aboutUs.save();

    return res
        .status(200)
        .json(new ApiResponse("About Us updated successfully"));
});

/**
 * Get About Us
 */
export const publicGetAboutUs = asyncHandler(async (req, res) => {
    const aboutUs = await AboutUs.findOne().populate(
        "createdBy",
        "name email role"
    );

    if (!aboutUs) {
        return res
            .status(200)
            .json(new ApiResponse("There is no any about us"));
    }

    return res.status(200).json(new ApiResponse("Success", aboutUs));
});
