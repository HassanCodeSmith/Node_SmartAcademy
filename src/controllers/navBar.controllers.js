/** __________ Models __________ */
import NavBar from "../models/navBar.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";

/**
 * Create Navbar
 */
export const createNavbar = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    await NavBar.deleteMany({});
    await NavBar.create(req.body);

    return res.status(201).json(new ApiResponse("Key added successfully"));
});

/**
 * Get All Navbar
 */
export const getAllKeys = asyncHandler(async (req, res) => {
    const navBar = await NavBar.findOne({});

    if (!navBar) {
        return res.status(404).json(new ApiError(404, "Navbar not found"));
    }
    const data = navBar.navBarLinks;
    return res
        .status(200)
        .json(new ApiResponse("All navbar keys fetched successfully.", data));
});
