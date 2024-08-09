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
    authCreateHeroSection,
    authUpdateHeroSection,
    publicGetHeroSection,
} from "../controllers/heroSection.controllers.js";

// __/heroSection/create
router
    .route("/create")
    .post(
        loginAuth,
        adminAuth,
        upload.single("heroImage"),
        authCreateHeroSection
    );

// __/heroSection/update
router
    .route("/update")
    .post(
        loginAuth,
        adminAuth,
        upload.single("heroImage"),
        authUpdateHeroSection
    );

// __/heroSection/get
router.route("/get").get(publicGetHeroSection);

export default router;
