/** __________ Models __________ */
import HeroSection from "../models/heroSection.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Create Hero Section
 */
export const authCreateHeroSection = asyncHandler(async (req, res) => {
    const isAlreadyCreated = await HeroSection.find();

    if (isAlreadyCreated.length > 0) {
        throw new ApiError(
            409,
            "Hero section already created now you just update it"
        );
    }

    trimObjects(req.body);

    const { title, description, bgColor } = req.body;

    if (!(title && description && bgColor)) {
        throw new ApiError(
            400,
            "All fields (title, description and background color) are required"
        );
    }

    if (!req.file) {
        throw new ApiError(400, "Image is required");
    }

    req.body.image = req.file.path.replace(/\\/g, "/");
    req.body.createdBy = req.userId;

    await HeroSection.create(req.body);

    res.status(201).json(new ApiResponse("Hero section created successfully"));
});

/**
 * Update Hero Section
 */
export const authUpdateHeroSection = asyncHandler(async (req, res) => {
    const existingHeroSection = await HeroSection.findOne();

    if (!existingHeroSection) {
        throw new ApiError(
            404,
            "Hero section does not exist, please create it first"
        );
    }

    trimObjects(req.body);

    const { title, description, bgColor } = req.body;

    if (title) {
        existingHeroSection.title = title;
    }

    if (description) {
        existingHeroSection.description = description;
    }

    if (bgColor) {
        existingHeroSection.bgColor = bgColor;
    }

    if (req.file) {
        existingHeroSection.image = req.file.path.replace(/\\/g, "/");
    }

    await existingHeroSection.save();

    res.status(200).json(new ApiResponse("Hero section updated successfully"));
});

/**
 * publi API get hero section
 */
export const publicGetHeroSection = asyncHandler(async (req, res) => {
    const heroSection = await HeroSection.findOne({}).populate(
        "createdBy",
        "name email role"
    );

    if (!heroSection) {
        return res
            .status(200)
            .json(new ApiResponse("There is no any hero section"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse("Hero section successfully fetched", heroSection)
        );
});
