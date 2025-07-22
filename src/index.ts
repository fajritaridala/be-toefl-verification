import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api";
import db from "./utils/database";

async function init() {
  try {
    const dbConnection = await db();
    console.log(`Database status: ${dbConnection}`);

    const app = express();
    const PORT = process.env.PORT;

    app.use(bodyParser.json());
    app.use("/api", router);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
