import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./common/middlewares/error.middleware";
import checkHealth from "./common/utils/healthCheck";
import router from "./common/utils/routes";
import dbConnect from "./config/db";
import { NODE_ENV, PORT } from "./config/env";

const app = express();

dbConnect()
  .then((msg) => console.log("Database status: " + msg))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.json());

// api health check
app.get("/health", async (req: Request, res: Response) => {
  const isDbHealthy = checkHealth.database();
  const [isCloudinaryHealthy, isPinataHealthy] = await Promise.all([
    checkHealth.claudinary(),
    checkHealth.pinata(),
  ]);
  const isAllHealthy = isDbHealthy && isCloudinaryHealthy && isPinataHealthy;

  res.status(isAllHealthy ? 200 : 503).json({
    status: isAllHealthy ? "UP" : "DEGRADED",
    timestamp: new Date().toISOString(),
    checks: {
      database: isDbHealthy ? "Connected" : "Disconnected",
      pinata: isPinataHealthy ? "Connected" : "Disconnected",
      cloudinary: isCloudinaryHealthy ? "Connected" : "Disconnected",
    },
  });
});

app.use("/api", router);
app.use(errorHandler);

if (NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
  });
}

export default app;
