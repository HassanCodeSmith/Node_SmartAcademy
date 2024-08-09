/** __________ Modules __________ */
import { Router } from "express";

/** __________ Middlewares __________ */
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

/** __________ Router Instance __________ */
const router = Router();

/** __________ Controllers __________ */
import { createQuote, getAllQuotes } from "../controllers/quote.controllers.js";

// __/quote/create
router.route("/create").post(upload.none(), createQuote);

// __/quote/getAll
router.route("/getAll").get(loginAuth, adminAuth, getAllQuotes);

export default router;
