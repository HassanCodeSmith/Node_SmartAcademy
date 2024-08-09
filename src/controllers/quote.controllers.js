/** __________ Models __________ */
import Quote from "../models/quote.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";
import { validateEmail } from "../utils/emailValidator.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Crate Quote
 */
export const createQuote = asyncHandler(async (req, res) => {
    trimObjects(req.body);
    const { fullName, phoneNo, email, select, message } = req.body;

    const requiredFields = [
        "fullName",
        "phoneNo",
        "email",
        "select",
        "message",
    ];

    const missingFields = filterMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }
        throw new ApiError(400, `Please provide ${missingFields.join(", ")}`);
    }

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    const newQuote = await Quote.create(req.body);

    return res
        .status(201)
        .json(new ApiResponse("Quote created successfully", newQuote));
});

/**
 * Get All Quotes
 */
export const getAllQuotes = asyncHandler(async (req, res) => {
    const quotes = await Quote.find({});

    const message =
        quotes.length === 0 ? "Quotes collection is empty" : "Quotes fetched";

    return res.status(200).json(new ApiResponse(message, quotes));
});
