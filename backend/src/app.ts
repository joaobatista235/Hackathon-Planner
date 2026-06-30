import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { env } from "@/env";
import { errorHandler } from "@/middlewares/errorHandler";
import routes from "@/routes";
import { setupSwagger } from "@/swagger";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  }),
);

app.use(express.json());

app.use("/api", routes);

setupSwagger(app);

app.use(errorHandler);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

export default app;
