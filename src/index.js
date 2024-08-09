import dotenv from "dotenv";
import connectDB from "./configs/db.config.js";
import { app } from "./app.js";

import { cronJobToExpireSeminar } from "./cron/updateSeminarStatus.cron.js";
cronJobToExpireSeminar();

const port = process.env.PORT || 8000;

dotenv.config({
    path: "./.env",
});

(async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.error("Error express app ", error);
        });

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server ", error);
        process.exit(1);
    }
})();
