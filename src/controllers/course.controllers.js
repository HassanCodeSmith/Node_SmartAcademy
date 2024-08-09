/** __________ Models __________ */
import Course from "../models/course.model.js";
import CourseCategory from "../models/courseCategory.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Crate Course
 */
export const createCourse = asyncHandler(async (req, res) => {
    const userId = req.userId;

    trimObjects(req.body);

    const requiredFields = [
        "title",
        "courseCategoryId",
        "courseDuration",
        "lectures",
        "level",
        "duration",
        "days",
        "fromTime",
        "toTime",
        "pricePerMonth",
        "description",
        "FAQs",
        "courseFeatures",
    ];

    const missingFields = filterMissingFields(req.body, requiredFields);

    let icon;
    let image;

    if (req.files) {
        icon = req?.files["icon"]
            ? req.files["icon"][0].path.replace(/\\/g, "/")
            : null;
        image = req?.files["image"]
            ? req.files["image"][0].path.replace(/\\/g, "/")
            : null;
    }

    if (!icon) {
        missingFields.push("icon");
    }

    if (!image) {
        missingFields.push("image");
    }

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }

        throw new ApiError(401, `Please provide ${missingFields.join(", ")}`);
    }

    const newCourse = await Course.create({
        ...req.body,
        icon,
        image,
        createdBy: userId,
    });

    return res
        .status(200)
        .json(new ApiResponse("Course created successfully", newCourse));
});

/**
 * Public Api - Get All Courses
 */
export const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ permanentDeleted: false })
        .populate("createdBy", "name email role")
        .populate("courseCategoryId", "title");

    const message =
        courses.length === 0
            ? "Courses collection is empty"
            : "Courses collection fetched successfully";

    return res.status(200).json(new ApiResponse(message, courses));
});

/**
 * Get All Courses With Categories
 */
export const getAllCoursesWithCategory = asyncHandler(async (req, res) => {
    const { courseCategoryId } = req.params;

    const courses = await Course.find({
        courseCategoryId,
        permanentDeleted: false,
    }).populate({
        path: "courseCategoryId",
        select: "-permanentDeleted",
        populate: {
            path: "createdBy",
            select: "-password -forgotPasswordOtp -permanentDeleted",
        },
    });

    if (courses.length === 0) {
        new ApiResponse(
            "There is no any course exist according to provided category",
            courses
        );
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                "All courses according to provided category are fetched",
                courses
            )
        );
});

/**
 * Get All Courses According to Categories
 */
export const getAllCoursesAccordingToCategories = asyncHandler(
    async (req, res) => {
        const categories = await CourseCategory.find({
            permanentDeleted: false,
        });

        const formattedData = [];

        for (const category of categories) {
            const courses = await Course.find({
                courseCategoryId: category._id,
                permanentDeleted: false,
            });

            const courseData = courses.map((course) => ({
                ...course.toObject(),
                id: course._id,
                title: course.title,
                img: course.image,
                icon: course.icon,
            }));

            formattedData.push({
                id: category._id,
                title: category.title,
                courseData,
            });
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    "All courses according to category are fetched",
                    formattedData
                )
            );
    }
);

/**
 * Public Api - Get Course By Id
 */
export const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findOne({
        _id: courseId,
        permanentDeleted: false,
    })
        .populate("createdBy", "name email role")
        .populate("courseCategoryId", "title courseFeatures");

    if (!course) {
        throw new ApiError(401, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse("Course found successfully", course));
});

/**
 * Update Course
 */
export const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findOne({
        _id: courseId,
        permanentDeleted: false,
    });

    if (!course) {
        throw new ApiError(401, "Course not found");
    }

    if (req.files && req?.files["icon"]) {
        course.icon = req.files["icon"][0].path;
    }

    if (req.files && req?.files["image"]) {
        course.image = req.files["image"][0].path;
    }

    if (req.body.title) {
        course.title = req.body.title;
    }

    if (req.body.courseCategoryId) {
        course.courseCategoryId = req.body.courseCategoryId;
    }

    if (req.body.courseDuration) {
        course.courseDuration = req.body.courseDuration;
    }

    if (req.body.lectures) {
        course.lectures = req.body.lectures;
    }

    if (req.body.level) {
        course.level = req.body.level;
    }

    if (req.body.duration) {
        course.duration = req.body.duration;
    }

    if (req.body.days) {
        course.days = req.body.days;
    }

    if (req.body.fromTime) {
        course.fromTime = req.body.fromTime;
    }

    if (req.body.toTime) {
        course.toTime = req.body.toTime;
    }

    if (req.body.pricePerMonth) {
        course.pricePerMonth = req.body.pricePerMonth;
    }

    if (req.body.description) {
        course.description = req.body.description;
    }

    if (req.body.FAQs) {
        course.FAQs = req.body.FAQs;
    }

    if (req.body.courseFeatures) {
        course.courseFeatures = req.body.courseFeatures;
    }

    if (req.body.enrolled) {
        course.enrolled = req.body.enrolled;
    }

    await course.save();

    return res
        .status(201)
        .json(new ApiResponse("Course updated successfully", course));
});

/**
 * Delete Course
 */
export const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findOneAndUpdate(
        { _id: courseId, permanentDeleted: false },
        { permanentDeleted: true },
        { new: true }
    );

    if (!course) {
        throw new ApiError(401, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse("Course deleted successfully", course));
});

/**
 * Retrieve Related Courses
 */
export const getRelatedCourses = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findOne({
        _id: courseId,
        permanentDeleted: false,
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const relatedCourses = await Course.find({
        courseCategoryId: course.courseCategoryId,
        _id: { $ne: courseId }, // Exclude the current course
    });

    if (relatedCourses.length === 0) {
        throw new ApiError(404, "No related courses found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                "Related courses fetched successfully",
                relatedCourses
            )
        );
});
