/** __________ Modules __________ */
import { Router } from "express";

/** __________ Middlewares __________ */
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { adminAndAccountantAuth } from "../middlewares/adminAndAccountantAuth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

/** __________ Router Instance __________ */
const router = Router();

/** __________ Controllers __________ */
import {
    createUser,
    forgotPassword,
    getProfile,
    login,
    resetPassword,
    verifyForgotPasswordOtp,
} from "../controllers/user.controllers.js";

// __/user/register
router.route("/register").post(upload.none(), createUser);

// __/user/login
router.route("/login").post(upload.none(), login);

// __/user/get
router.route("/get").get(loginAuth, adminAndAccountantAuth, getProfile);

// __/user/forgotPassword
router.route("/forgotPassword").post(upload.none(), forgotPassword);

// __/user/verifyForgotPasswordOtp
router
    .route("/verifyForgotPasswordOtp")
    .post(upload.none(), verifyForgotPasswordOtp);

// __/user/resetPassword
router.route("/resetPassword").post(upload.none(), resetPassword);

export default router;
