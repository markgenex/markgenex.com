
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// -------------------------
// Routes import (only existing routers)
// -------------------------
import authRouter from "./routes/auth/authRoutes.js";
import organizationRouter from "./routes/organization/organizationRoutes.js";
import apiRouter from "./routes/api.js";

// -------------------------
// Routes declaration
// -------------------------
// Health check and versioning can be provided by apiRouter
app.use("/api", apiRouter);

// Mount auth & organization under /api
app.use("/api/auth", authRouter);
app.use("/api/organizations", organizationRouter);

// Export the configured app
export { app }
