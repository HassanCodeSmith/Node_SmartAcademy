/** __________ Modules __________ */
import { Router } from "express";

/** __________ Middlewares __________ */
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

/** __________ Router Instance __________ */
const router = Router();

/** __________ Controllers __________ */
import { createReview, getReviews } from "../controllers/review.controllers.js";

// __/review/create
router.route("/create").post(loginAuth, upload.none(), createReview);
// __/review/get
router.route("/get/:courseId").get(getReviews);

export default router;
