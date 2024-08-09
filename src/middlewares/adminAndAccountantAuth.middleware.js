/** __________ Models __________ */
import User from "../models/user.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";

const adminAndAccountantAuth = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.role !== "admin" && user.role !== "accountant") {
        throw new ApiError(401, "Invalid user role");
    }
    next();
});

export { adminAndAccountantAuth };
