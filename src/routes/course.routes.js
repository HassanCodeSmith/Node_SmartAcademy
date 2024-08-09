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
    createCourse,
    deleteCourse,
    getAllCourses,
    getAllCoursesAccordingToCategories,
    getAllCoursesWithCategory,
    getCourseById,
    getRelatedCourses,
    updateCourse,
} from "../controllers/course.controllers.js";

// __/course/craete
router.route("/create").post(
    loginAuth,
    adminAuth,
    upload.fields([
        { name: "icon", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    createCourse
);

// __/course/getAll
router.route("/getAll").get(getAllCourses);

// __/course/coursesByCategory
router
    .route("/coursesByCategory/:courseCategoryId")
    .get(getAllCoursesWithCategory);

// __/course/coursesAccordingToCategory
router
    .route("/coursesAccordingToCategory")
    .get(getAllCoursesAccordingToCategories);

// __/course/get
router.route("/get/:courseId").get(getCourseById);

// __/course/update
router.route("/update/:courseId").post(
    loginAuth,
    adminAuth,
    upload.fields([
        { name: "icon", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    updateCourse
);

// __/course/delete
router.route("/delete/:courseId").post(loginAuth, adminAuth, deleteCourse);

// __/course/relatedCourses
router.route("/relatedCourses/:courseId").get(getRelatedCourses);

export default router;
