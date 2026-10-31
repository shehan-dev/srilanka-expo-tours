import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

// SMTP email sending. Works with any provider that offers SMTP — Gmail / Google Workspace
// (use an App Password), Zoho, Brevo, Mailgun, Amazon SES, your web host, etc.
// Configure via the SMTP_* variables in .env.local (see .env.example).

let transporter: Transporter | null = null;

export const isEmailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

/** "From" address — must be a mailbox your SMTP account is allowed to send as. */
export const mailFrom = () => process.env.MAIL_FROM || `${site.name} <${process.env.SMTP_USER}>`;

/** Inbox that receives new booking notifications. */
export const notifyTo = () => process.env.BOOKING_NOTIFY_TO || site.email;

export async function sendMail(message: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  return getTransporter().sendMail({ from: mailFrom(), ...message });
}
