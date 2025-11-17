import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";
import db from "./utils/database";
import { PORT } from "./utils/env";

async function init() {
  try {
    const dbConnection = await db();
    console.log(`Database status: ${dbConnection}`);

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api", router);

    // Error handler middleware (must be last)
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
