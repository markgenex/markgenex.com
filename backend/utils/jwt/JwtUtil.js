import jwt from "jsonwebtoken";

export class JwtUtil {
  static generateAccessToken(payload, expiresIn = "15m") {
    return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn,
    });
  }

  static generateRefreshToken(payload, expiresIn = "7d") {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "your-refresh-secret", {
      expiresIn,
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your-refresh-secret");
    } catch (error) {
      return null;
    }
  }

  static generateEmailVerificationToken(userId) {
    return jwt.sign({ userId, type: "email_verification" }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    });
  }

  static generatePasswordResetToken(userId) {
    return jwt.sign({ userId, type: "password_reset" }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "1h",
    });
  }

  static verifyEmailToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      if (decoded.type !== "email_verification") {
        return null;
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      if (decoded.type !== "password_reset") {
        return null;
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}
