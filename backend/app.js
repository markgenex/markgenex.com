
import express from "express"
import cookieParser from "cookie-parser"

const app = express();


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
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
