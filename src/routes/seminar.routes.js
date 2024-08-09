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
    createSeminar,
    authUpdateSeminar,
    getAllSeminars,
    getSeminar,
} from "../controllers/seminar.controllers.js";

// __/seminar/craete
router
    .route("/create")
    .post(loginAuth, adminAuth, upload.single("image"), createSeminar);

// __/seminar/update
router
    .route("/update/:seminarId")
    .post(loginAuth, adminAuth, upload.single("image"), authUpdateSeminar);

// __/seminar/getAll
router.route("/getAll").get(getAllSeminars);

// __/seminar/get
router.route("/get/:seminarId").get(getSeminar);

export default router;
