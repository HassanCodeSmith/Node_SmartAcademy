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
    createTestimonial,
    deleteTestimonial,
    getAllTestimonials,
    getTestimonial,
    updateTestimonial,
} from "../controllers/testimonial.controllers.js";

// __/testimonial/create
router
    .route("/create")
    .post(loginAuth, adminAuth, upload.single("image"), createTestimonial);

// __/testimonial/getAll
router.route("/getAll").get(getAllTestimonials);

// __/testimonial/get
router.route("/get/:testimonialId").get(getTestimonial);

// __/testimonial/update
router
    .route("/update/:testimonialId")
    .post(loginAuth, adminAuth, upload.single("image"), updateTestimonial);

// __/testimonial/delete
router
    .route("/delete/:testimonialId")
    .post(loginAuth, adminAuth, deleteTestimonial);

export default router;
