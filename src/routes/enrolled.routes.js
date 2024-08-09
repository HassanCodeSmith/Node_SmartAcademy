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
    saveEnrolledStudent,
    getAllEnrolledStudents,
    getEnrolledStudentById,
    updateEnrolledStudentStatus,
} from "../controllers/enrolled.controllers.js";

// __/enroll/create
router.route("/create").post(upload.none(), saveEnrolledStudent);

// __/enroll/getAll
router
    .route("/getAll")
    .get(loginAuth, adminAndAccountantAuth, getAllEnrolledStudents);

// __/enroll/get
router
    .route("/get/:underScoreId")
    .get(loginAuth, adminAndAccountantAuth, getEnrolledStudentById);

// __/enroll/updateStatus
router
    .route("/updateStatus/:underScoreId")
    .post(
        loginAuth,
        adminAndAccountantAuth,
        upload.none(),
        updateEnrolledStudentStatus
    );

export default router;
