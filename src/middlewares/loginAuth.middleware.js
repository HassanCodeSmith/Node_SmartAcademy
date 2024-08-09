/** __________ Models __________ */
import User from "../models/user.model.js";

/** __________ Utils __________ */
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";

/** __________ Modules __________ */
import jwt from "jsonwebtoken";

/**
 * Login Auth
 */
const loginAuth = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log("loginAuth Error: Token must be provided");
        throw new ApiError(401, "Token must be provided");
    }

    const payload = jwt.verify(
        token.split(" ")[1],
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findOne({
        _id: payload.userId,
        permanentDeleted: false,
    });

    if (!user) {
        console.log("==> Invalid user id in token");
        throw new ApiError(401, "User not found with provided token");
    }

    req.userId = payload.userId;
    req.userRole = payload.userRole;
    req.email = payload.email;

    next();
});

export { loginAuth };
