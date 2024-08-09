import cron from "node-cron";
import Seminar from "../models/seminar.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const runCronJob = async () => {
    const today = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

    const seminars = await Seminar.find({
        permanentDeleted: false,
        status: { $ne: "Completed" },
    });

    for (let seminar of seminars) {
        let allInactive = true;

        seminar.description.forEach((obj, index) => {
            if (
                new Date(obj.date).toISOString().split("T")[0] +
                    "T00:00:00.000Z" ===
                today
            ) {
                seminar.status = "OnGoing";
            }

            if (
                today >
                new Date(obj.date).toISOString().split("T")[0] +
                    "T00:00:00.000Z"
            ) {
                seminar.description[index].active = false;
            }

            if (seminar.description[index].active) {
                allInactive = false;
            }
        });

        if (allInactive) {
            seminar.status = "Completed";
        }

        await seminar.save();
    }
};

export const cronJobToExpireSeminar = () => {
    // Run the job immediately when the server starts
    runCronJob();

    // Schedule the job to run every 24 hours
    cron.schedule("0 0 0 */1 * *", asyncHandler(runCronJob));
};
