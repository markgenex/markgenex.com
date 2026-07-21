import nodemailer from "nodemailer";

export class EmailUtil {
  static transporter = null;

  static initialize() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true" || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  static async sendVerificationEmail(email, verificationLink) {
    if (!this.transporter) this.initialize();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@markgenx.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h2>Email Verification</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(email, resetLink) {
    if (!this.transporter) this.initialize();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@markgenx.com",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below:</p>
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  static async sendInvitationEmail(email, invitationLink, organizationName) {
    if (!this.transporter) this.initialize();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@markgenx.com",
      to: email,
      subject: `You're Invited to Join ${organizationName}`,
      html: `
        <h2>You're Invited!</h2>
        <p>You've been invited to join <strong>${organizationName}</strong> on MarkGenX.</p>
        <a href="${invitationLink}" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Accept Invitation
        </a>
        <p>This invitation expires in 7 days.</p>
        <p>If you didn't expect this invitation, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  static async sendWelcomeEmail(email, userName) {
    if (!this.transporter) this.initialize();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@markgenx.com",
      to: email,
      subject: "Welcome to MarkGenX",
      html: `
        <h2>Welcome, ${userName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now log in and start using MarkGenX.</p>
        <a href="${process.env.APP_URL || "https://markgenx.com"}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Go to Login
        </a>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
