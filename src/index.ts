import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/api";
import db from "./utils/database";

dotenv.config();

async function init() {
  try {
    const dbConnection = await db();
    console.log(`Database status: ${dbConnection}`);

    const app = express();
    const PORT = process.env.PORT;

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api", router);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
