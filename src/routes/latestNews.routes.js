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
    createLatestNews,
    deleteLatestNews,
    getAllLatestNewses,
    getLatestNews,
    updateLatestNews,
} from "../controllers/latestNews.controllers.js";

// __/latestNews/create
router
    .route("/create")
    .post(loginAuth, adminAuth, upload.single("image"), createLatestNews);

// __/latestNews/getAll
router.route("/getAll").get(getAllLatestNewses);

// __/latestNews/get
router.route("/get/:latestNewsId").get(getLatestNews);

// __/latestNews/update
router
    .route("/update/:latestNewsId")
    .post(loginAuth, adminAuth, upload.single("image"), updateLatestNews);

// __/latestNews/delete
router
    .route("/delete/:latestNewsId")
    .post(loginAuth, adminAuth, deleteLatestNews);

export default router;
