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
    createSubscription,
    getAllSubscriptions,
} from "../controllers/subscription.controllers.js";

/** __/subscription/create */
router.route("/create").post(upload.none(), createSubscription);

/** __/subscription/getAll */
router.route("/getAll").get(loginAuth, adminAuth, getAllSubscriptions);

export default router;
