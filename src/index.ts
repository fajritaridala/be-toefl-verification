import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./common/middlewares/error.middleware";
import dbConnect from "./config/db";
import { PORT } from "./config/env";
import router from "./config/routes";

async function init() {
  try {
    const db = await dbConnect();
    console.log(`Database status: ${db}`);

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.use("/api", router);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
