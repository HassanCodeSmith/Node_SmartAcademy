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
    authCreateCounter,
    authUpdateCounter,
    publicGetCounter,
} from "../controllers/counter.controllers.js";

// __/counter/craete
router
    .route("/create")
    .post(loginAuth, adminAuth, upload.none(), authCreateCounter);

// __/counter/update
router
    .route("/update")
    .post(loginAuth, adminAuth, upload.none(), authUpdateCounter);

// __/counter/get
router.route("/get").get(publicGetCounter);

export default router;
