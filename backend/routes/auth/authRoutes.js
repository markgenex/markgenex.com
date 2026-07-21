import express from "express";
import { AuthController } from "../../controllers/auth/AuthController.js";
import { isAuthenticated, verifyAccessToken, verifyRefreshToken } from "../../middlewares/auth/tokenMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Protected routes
router.get("/me", isAuthenticated, AuthController.getCurrentUser);
router.put("/profile", isAuthenticated, AuthController.updateProfile);
router.post("/change-password", isAuthenticated, AuthController.changePassword);
router.post("/logout", AuthController.logout);

export default router;
