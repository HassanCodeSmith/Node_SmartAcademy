/** __________ Models __________ */
import Review from "../models/review.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Create Review
 */
export const createReview = asyncHandler(async (req, res) => {
    const userId = req.userId;

    trimObjects(req.body);

    const requiredFields = [
        "courseId",
        "name",
        "email",
        "phoneNo",
        "rating",
        "review",
    ];
    const missingFields = filterMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }

        throw new ApiError(401, `Please provide ${missingFields.join(", ")}`);
    }

    const newReview = await Review.create({ ...req.body, userId });

    return res
        .status(201)
        .json(new ApiResponse("Review submitted successfully", newReview));
});

/**
 * Get Reviews by Course ID
 */
export const getReviews = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const courseReviews = await Review.find({ courseId }).populate("courseId");

    if (courseReviews.length !== 0) {
        let reviewDetails = [];
        const totalReviews = courseReviews.length;
        let totalRating = 0;

        let oneRating = 0;
        let twoRating = 0;
        let threeRating = 0;
        let fourRating = 0;
        let fiveRating = 0;

        courseReviews.forEach((review) => {
            reviewDetails.push({
                name: review.name,
                email: review.email,
                phoneNo: review.phoneNo,
                rating: review.rating,
                review: review.review,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            });

            totalRating += review.rating;

            if (review.rating === 1) {
                oneRating += 1;
            } else if (review.rating === 2) {
                twoRating += 2;
            } else if (review.rating === 3) {
                threeRating += 3;
            } else if (review.rating === 4) {
                fourRating += 4;
            } else if (review.rating === 5) {
                fiveRating += 5;
            }
        });

        const averageRating = totalRating / totalReviews;

        const data = {
            reviewDetails,
            courseReviews,
            averageRating,
            oneRating,
            twoRating,
            threeRating,
            fourRating,
            fiveRating,
        };

        return res
            .status(200)
            .json(
                new ApiResponse("Course reviews fetched successfully", [data])
            );
    }

    return res
        .status(200)
        .json(new ApiResponse("There is no any review for this course", []));
});
