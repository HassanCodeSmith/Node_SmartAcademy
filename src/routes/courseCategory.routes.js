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
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory,
    getAllCourseCategories,
    getCourseCategory,
} from "../controllers/courseCategory.controllers.js";

// __/courseCategory/create
router
    .route("/create")
    .post(loginAuth, adminAuth, upload.single("image"), createCourseCategory);

// __/courseCategory/update
router
    .route("/update/:courseCategoryId")
    .post(loginAuth, adminAuth, upload.single("image"), updateCourseCategory);

// __/courseCategory/delete
router
    .route("/delete/:courseCategoryId")
    .post(loginAuth, adminAuth, deleteCourseCategory);

// __/courseCategory/getAll
router.route("/getAll").get(getAllCourseCategories);

// __/courseCategory/get
router.route("/get/:courseCategoryId").get(getCourseCategory);

export default router;
