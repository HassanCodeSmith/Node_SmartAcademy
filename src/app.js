import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { routeNotFound } from "./middlewares/routeNotFound.middleware.js";

import { cronJobToExpireSeminar } from "./cron/updateSeminarStatus.cron.js";
cronJobToExpireSeminar();

/** Express component */
const app = express();

/** Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/uploads", express.static("public/uploads"));
app.use(cookieParser());
app.use(morgan("dev"));

/** Testing Route */
app.get("/", (req, res) => res.send("<h1>Smart Academy Server Running</h1>"));

/** Route imports */
import heroSectionRouter from "./routes/heroSection.routes.js";
import userRouter from "./routes/user.routes.js";
import aboutUsRouter from "./routes/aboutUs.routes.js";
import courseCategoryRouter from "./routes/courseCategory.routes.js";
import courseRouter from "./routes/course.routes.js";
import seminarRouter from "./routes/seminar.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import counterRouter from "./routes/counter.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import quoteRouter from "./routes/quote.routes.js";
import latestNewsRouter from "./routes/latestNews.routes.js";
import navBarRouter from "./routes/navBar.routes.js";
import reviewRouter from "./routes/review.routes.js";
import studentEnrollmentRouter from "./routes/enrolled.routes.js";

/** Routes declarations */
app.use("/api/v1/heroSection", heroSectionRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/aboutUs", aboutUsRouter);
app.use("/api/v1/courseCategory", courseCategoryRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/seminar", seminarRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/counter", counterRouter);
app.use("/api/v1/testimonial", testimonialRouter);
app.use("/api/v1/quote", quoteRouter);
app.use("/api/v1/latestNews", latestNewsRouter);
app.use("/api/v1/navBar", navBarRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/enroll", studentEnrollmentRouter);

/** Error Handler */
app.use(errorHandler);

/** Route Not Found */
app.use(routeNotFound);

export { app };
