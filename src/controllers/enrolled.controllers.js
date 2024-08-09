/** __________ Models __________ */
import Enrolled from "../models/enrolled.model.js";
import Course from "../models/course.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";
import { validateEmail } from "../utils/emailValidator.util.js";
import { validateCNIC } from "../utils/cnicValidator.util.js";

/**
 * Save Enrolled Student
 */
export const saveEnrolledStudent = asyncHandler(async (req, res) => {
    trimObjects(req.body);
    const requiredFields = [
        "name",
        "email",
        "qualification",
        "degree",
        "cnic",
        "course",
    ];

    const missingFields = filterMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }

        throw new ApiError(401, `Please provide ${missingFields.join(", ")}`);
    }

    if (!validateEmail(req.body.email)) {
        throw new ApiError(400, "Please enter valid email address");
    }

    const isValidCourse = await Course.findOne({
        _id: req.body.course,
        permanentDeleted: false,
    });

    if (!isValidCourse) {
        throw new ApiError(400, "Please select valid course");
    }

    const { CNICStatus, formatedCNIC } = validateCNIC(req.body.cnic);
    if (!CNICStatus) {
        throw new ApiError(400, "Please enter valid cnic");
    }

    const newEnrollment = await Enrolled.create({
        name: req.body.name,
        email: req.body.email,
        qualification: req.body.qualification,
        degree: req.body.degree,
        cnic: formatedCNIC,
        course: req.body.course,
    });

    return res
        .status(201)
        .json(new ApiResponse("Enrolled successfully", newEnrollment));
});

/**
 * Get All Enrolled Students
 */
export const getAllEnrolledStudents = asyncHandler(async (req, res) => {
    const students = await Enrolled.find({}).populate("course");

    const message =
        students.length === 0
            ? `Collection is empty`
            : "Students fetched successfully";

    return res.status(200).json(new ApiResponse(message, students));
});

/**
 * Get Enrolled Students by Query -- NOT USED RIGHT NOW (Remove this message when it is use)
 */
export const getEnrolledStudentsByQuery = asyncHandler(async (req, res) => {
    const { query } = req.query;

    const validQueryStrings = ["Pending", "Confirm", "Rejected", "Complete"];

    if (!validQueryStrings.includes(query)) {
        throw new ApiError(404, "Invalid Query");
    }

    const students = await Enrolled.find({ status: query }).populate("course");

    const message =
        students.length === 0
            ? `Collection is empty`
            : "Students fetched successfully";

    return res.status(200).json(new ApiResponse(message, students));
});

/**
 * Get Enrolled Student By ID
 */
export const getEnrolledStudentById = asyncHandler(async (req, res) => {
    const { underScoreId } = req.params;

    const student = await Enrolled.findOne({ _id: underScoreId }).populate(
        "course"
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return res
        .status(200)
        .json(new ApiResponse("Student found successfully", student));
});

/**
 * Confirm Enrolled Student
 */
export const updateEnrolledStudentStatus = asyncHandler(async (req, res) => {
    const { underScoreId } = req.params;

    trimObjects(req.body);

    const { status } = req.body;

    const validStatusStrings = ["Pending", "Confirm", "Rejected", "Complete"];

    if (!validStatusStrings.includes(status)) {
        throw new ApiError(404, "Invalid Status");
    }

    const updatedStudent = await Enrolled.findOneAndUpdate(
        {
            _id: underScoreId,
        },
        { status: status },
        { new: true }
    );

    if (!updatedStudent) {
        throw new ApiError(404, "Student not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                "Enrolled student status updated successfully",
                updatedStudent
            )
        );
});
