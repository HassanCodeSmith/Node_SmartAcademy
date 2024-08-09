/** __________ Modules __________ */
import { Router } from "express";

/** __________ Middlewares __________ */
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

/** __________ Router Instance __________ */
const router = Router();

/** __________ Controllers __________ */
import {
    authCreateAboutUs,
    authUpdateAboutUs,
    publicGetAboutUs,
} from "../controllers/aboutUs.controllers.js";

// __/aboutUs/create
router.route("/create").post(
    loginAuth,
    adminAuth,
    upload.fields([
        { name: "aboutIcon", maxCount: 1 },
        { name: "aboutImage", maxCount: 1 },
    ]),
    authCreateAboutUs
);

// __/aboutUs/update
router.route("/update").post(
    loginAuth,
    adminAuth,
    upload.fields([
        { name: "aboutIcon", maxCount: 1 },
        { name: "aboutImage", maxCount: 1 },
    ]),
    authUpdateAboutUs
);

// __/aboutUs/get
router.route("/get").get(publicGetAboutUs);

export default router;
