/** __________ Models __________ */
import CourseCategory from "../models/courseCategory.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Create Course Category
 */
export const createCourseCategory = asyncHandler(async (req, res) => {
    const userId = req.userId;

    trimObjects(req.body);

    const requiredFields = ["title", "description"];

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

    const newCourseCategory = new CourseCategory(req.body);

    await newCourseCategory.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                "Course Category created successfully",
                newCourseCategory
            )
        );
});

/**
 * Update Course Category
 */
export const updateCourseCategory = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { courseCategoryId } = req.params;

    const courseCategory = await CourseCategory.findById(courseCategoryId);

    if (!courseCategory) {
        throw new ApiError(404, "Course Category not found");
    }

    if (req?.body?.title) {
        courseCategory.title = req.body.title;
    }

    if (req?.file) {
        req.body.image = req.file.path.replace(/\\/g, "/");
    }

    if (req?.body?.description) {
        courseCategory.description = req.body.description;
    }

    await courseCategory.save();

    return res
        .status(200)
        .json(new ApiResponse("Course Category updated successfully"));
});

/**
 * Delete Course Category
 */
export const deleteCourseCategory = asyncHandler(async (req, res) => {
    const { courseCategoryId } = req.params;

    const courseCategory = await CourseCategory.findById(courseCategoryId);

    if (!courseCategory) {
        throw new ApiError(404, "Course Category not found");
    }

    courseCategory.permanentDeleted = true;
    await courseCategory.save();

    return res
        .status(200)
        .json(new ApiResponse("Course Category deleted successfully"));
});

/**
 * Get All Course Categories
 */
export const getAllCourseCategories = asyncHandler(async (req, res) => {
    const courseCategories = await CourseCategory.find({
        permanentDeleted: false,
    });
    if (courseCategories.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    "No any course categories exists",
                    courseCategories
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                "All course categories fetched successfully",
                courseCategories
            )
        );
});

/**
 * Get Course Category By Id
 */
export const getCourseCategory = asyncHandler(async (req, res) => {
    const { courseCategoryId } = req.params;

    const courseCategory = await CourseCategory.findOne({
        _id: courseCategoryId,
        permanentDeleted: false,
    });

    if (!courseCategory) {
        throw new ApiError(401, "Course category not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                "Course category fetched successfully",
                courseCategory
            )
        );
});
