/** __________ Modules __________ */
import { Router } from "express";

/** __________ Middlewares __________ */
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

/** __________ Router Instance __________ */
const router = Router();

/** __________ Controllers __________ */
import { createNavbar, getAllKeys } from "../controllers/navBar.controllers.js";

// __/navBar/create
router.route("/create").post(loginAuth, adminAuth, upload.none(), createNavbar);

// __/navBar/getAll
router.route("/getAll").get(getAllKeys);

export default router;
