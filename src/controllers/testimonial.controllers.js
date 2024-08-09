/** __________ Models __________ */
import Testimonial from "../models/testimonial.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Create Testimonial
 */
export const createTestimonial = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const requiredFields = ["name", "jobRole", "message"];

    const missingFields = filterMissingFields(req.body, requiredFields);

    if (!req.file) {
        missingFields.push("image");
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

    const testimonial = await Testimonial.create(req.body);

    return res
        .status(201)
        .json(new ApiResponse("Tesimonial created successfully", testimonial));
});

/**
 * Get All Testimonials
 */
export const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    const message =
        testimonials.length === 0
            ? "Testimonials collection is empty"
            : "Testimonials fetched";

    return res.status(200).json(new ApiResponse(message, testimonials));
});

/**
 * Get Testimonial
 */
export const getTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;
    const testimonials = await Testimonial.findOne({
        _id: testimonialId,
        permanentDeleted: false,
    }).populate("createdBy", "name email role");

    if (!testimonials) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse("Testimonial fetched successfully", testimonials)
        );
});

/**
 * Update Testimonial
 */
export const updateTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    const testimonial = await Testimonial.findOne({
        _id: testimonialId,
        permanentDeleted: false,
    });

    if (!testimonial) {
        throw new ApiError(401, "Testimonial not found");
    }

    if (req.body.name) {
        testimonial.name = req.body.name;
    }

    if (req.body.jobRole) {
        testimonial.jobRole = req.body.jobRole;
    }

    if (req.body.message) {
        testimonial.message = req.body.message;
    }

    if (req.file) {
        testimonial.image = req.file.path.replace(/\\/g, "/");
    }

    await testimonial.save();

    return res
        .status(201)
        .json(new ApiResponse("Testimonail updated successfully", testimonial));
});

/**
 * Delete Testimonial
 */
export const deleteTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    const deletedTestimonial = await Testimonial.findOneAndUpdate(
        {
            _id: testimonialId,
            permanentDeleted: false,
        },
        { permanentDeleted: true },
        { new: true }
    );

    if (!deletedTestimonial) {
        throw new ApiError(401, "Testimonial not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                "Testimonial deleted successfully",
                deletedTestimonial
            )
        );
});
