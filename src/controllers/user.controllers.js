/** __________ Models __________ */
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";

/** __________ Utils __________ */
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { validateEmail } from "../utils/emailValidator.util.js";
import { validatePassword } from "../utils/passwordValidator.util.js";
import { sendMail } from "../utils/sendEmail.util.js";
import { trimObjects } from "../utils/trimObjects.util.js";
import { filterMissingFields } from "../utils/filterMissingFields.utils.js";

/**
 * Create User
 */
export const createUser = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { email, password } = req.body;

    const requiredFields = ["name", "email", "password"];

    const missingFields = filterMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        if (missingFields.length > 1) {
            missingFields[missingFields.length - 1] =
                `and ${missingFields[missingFields.length - 1]}`;
        }

        throw new ApiError(401, `Please provide ${missingFields.join(", ")}`);
    }

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please enter valid formated email");
    }

    if (!validatePassword(password)) {
        throw new ApiError(
            400,
            "Password length must 8 and container atleast 1 special character and 1 number and english alphabets"
        );
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new ApiError(409, "Email already exists");
    }

    const newUser = await User.create(req.body);

    res.status(200).json(new ApiResponse("User created successfully", newUser));
});

/**
 * Login User
 */
export const login = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { email, password } = req.body;

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please enter valid email");
    }

    if (!validatePassword(password)) {
        throw new ApiError(
            400,
            "Password length must 8 and container atleast 1 special character and 1 number and english alphabets"
        );
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Wrong email");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Wrong password");
    }

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select(
        "-password -forgotPasswordOtp -createdAt -updatedAt"
    );

    res.status(200).json(
        new ApiResponse("User logged-in successfully", {
            user: loggedInUser,
            accessToken,
        })
    );
});

/**
 * Get Profile
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select(
        "-password -forgotPasswordOtp -createdAt -updatedAt"
    );

    if (!user) {
        throw new ApiError(404, "User not found - invalid token");
    }
    res.status(200).json(
        new ApiResponse("User profile fetched successfully", user)
    );
});

/**
 * Forgot Password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { email } = req.body;

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please enter valid email");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Wrong email");
    }

    const forgotPasswordOtp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();
    console.log("Forgot Password OTP : ", forgotPasswordOtp);

    const forgotPasswordOtpHash =
        await user.generateForgotPasswordOtpHash(forgotPasswordOtp);

    await User.findOneAndUpdate(
        { email },
        {
            $set: {
                "forgotPasswordOtp.otp": forgotPasswordOtpHash,
            },
        },
        { new: true }
    );

    sendMail({
        to: email,
        subject: "Forgot Password OTP",
        html: `<p>Your forgot password OTP is <strong>${forgotPasswordOtp}</strong></p><br><p>Don't share your OTP with anyone - OTP will exipire after <strong>5 minits</strong></p>`,
    });

    const isOtpAlreadyExistForProvidedEmail = await OTP.findOne({ email });

    if (isOtpAlreadyExistForProvidedEmail) {
        await OTP.findOneAndUpdate(
            { email },
            {
                $set: {
                    email,
                    otp: forgotPasswordOtp,
                    createdAt: Date.now(),
                },
            }
        );
    } else {
        await OTP.create({ email, otp: forgotPasswordOtp });
    }

    return res
        .status(200)
        .json(new ApiResponse("OTP sent to your email successfully"));
});

/**
 * Verify Forgot OTP
 */
export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { email, forgotPasswordOtp } = req.body;

    if (!validateEmail(email)) {
        throw new ApiError(400, "Invalid email");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Wrong email - User not found");
    }

    const isOtpExpire = await OTP.findOne({ email });

    if (!isOtpExpire) {
        throw new ApiError(400, "OTP has been expired");
    }

    const isOtpCorrect = await user.compareForgotPasswordOtp(forgotPasswordOtp);

    if (!isOtpCorrect) {
        throw new ApiError(400, "OTP is wrong");
    }

    await User.findOneAndUpdate(
        { email },
        {
            $set: {
                "forgotPasswordOtp.isOtpVarified": true,
            },
        }
    );

    await OTP.findOneAndDelete({ email });

    return res.status(200).json(new ApiResponse("OTP verified successfully"));
});

/**
 * Reset Password
 */
export const resetPassword = asyncHandler(async (req, res) => {
    trimObjects(req.body);

    const { email, resetPassword } = req.body;

    if (!validateEmail(email)) {
        throw new ApiError(400, "Please enter valid formated email");
    }

    if (!validatePassword(resetPassword)) {
        throw new ApiError(
            400,
            "Password length must 8 and container atleast 1 special character and 1 number and english alphabets"
        );
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (!user.forgotPasswordOtp.isOtpVarified) {
        throw new ApiError(400, "Forgot password OTP not verified");
    }

    user.password = resetPassword;
    user.forgotPasswordOtp.otp = "";
    user.forgotPasswordOtp.isOtpVarified = false;

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse("Password updated successfully"));
});
