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

  static async sendJobApplicationStatusEmail({ email, applicantName, jobTitle, companyName, status }) {
    if (!this.transporter) this.initialize();
    const escape = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
    const messages = {
      New: "We have received your application and our hiring team will review it shortly.",
      Reviewed: "Our hiring team has reviewed your application. We will contact you if there are further updates.",
      Shortlisted: "We are pleased to let you know that your application has been shortlisted for the next stage.",
      Interview: "Your application has progressed to the interview stage. Our hiring team will contact you with the interview details.",
      Selected: "Congratulations! We are delighted to inform you that you have been selected. Our team will contact you regarding the next steps.",
      Rejected: "Thank you for the time and effort you invested in your application. After careful consideration, we will not be progressing your application further at this time. We wish you every success in your career.",
    };
    const safeStatus = escape(status), safeName = escape(applicantName), safeJob = escape(jobTitle), safeCompany = escape(companyName);
    return this.transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@markgenx.com",
      to: email,
      subject: `${safeCompany} application update: ${safeStatus} — ${safeJob}`,
      text: `Dear ${applicantName},\n\n${messages[status]}\n\nApplicant: ${applicantName}\nJob Title: ${jobTitle}\nCompany: ${companyName}\nCurrent Application Status: ${status}\n\nRegards,\n${companyName} Hiring Team`,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033"><h2 style="color:#117568">Application status update</h2><p>Dear ${safeName},</p><p style="line-height:1.6">${messages[status]}</p><div style="margin:24px 0;padding:18px;background:#f4f7f8;border-radius:8px"><p><strong>Applicant:</strong> ${safeName}</p><p><strong>Job Title:</strong> ${safeJob}</p><p><strong>Company:</strong> ${safeCompany}</p><p><strong>Current Application Status:</strong> ${safeStatus}</p></div><p>Regards,<br><strong>${safeCompany} Hiring Team</strong></p></div>`,
    });
  }
}
