/** __________ Models __________ */
import Subscription from "../models/subscription.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { validateEmail } from "../utils/emailValidator.util.js";

/**
 * Create Subscription
 */
export const createSubscription = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { name, email } = req.body;

    if (!(name && email)) {
        throw new ApiError(400, "Name and Email are required");
    }

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please enter valid formated email");
    }

    const existingEmail = await Subscription.findOne({ email });
    if (existingEmail) {
        throw new ApiError(409, "Email already exists");
    }

    await Subscription.create(req.body);

    return res.status(201).json(new ApiResponse("Subscribed successfully"));
});

/**
 * Get All Subscriptions
 */
export const getAllSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({});

    if (subscriptions.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    "There is no any subscription right now",
                    subscriptions
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse("Subscriptions fetched successfully", subscriptions)
        );
});
