import { JwtUtil } from "../../utils/jwt/JwtUtil.js";
import { User } from "../../models/index.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = JwtUtil.verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ error: "User account is not active" });
    }

    req.user = { id: user._id, email: user.email, role: user.role };
    req.token = token;

    next();
  } catch (error) {
    res.status(500).json({ error: "Token verification failed", details: error.message });
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const decoded = JwtUtil.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user._id, email: user.email };

    next();
  } catch (error) {
    res.status(500).json({ error: "Refresh token verification failed", details: error.message });
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = JwtUtil.verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user._id, email: user.email, role: user.role };

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
