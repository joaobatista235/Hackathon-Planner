import "dotenv/config";
import path from "path";
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
    origin: (origin, callback) => {
      // Allow any localhost/127.0.0.1 origin (all Vite ports) + no-origin (curl/Postman)
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin not allowed — ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Serve uploaded files (PDFs, videos)
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", routes);

setupSwagger(app);

app.use(errorHandler);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

export default app;
