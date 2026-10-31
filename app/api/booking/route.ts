// POST /api/booking — receives the website's booking form (and itinerary quote requests).
//
// 1. Rate-limits by IP and drops bot submissions (honeypot field "website").
// 2. Validates and normalises the request, and creates a booking reference.
// 3. Emails the team a notification (Reply-To = guest) and the guest a confirmation in EN / IT.
// 4. Optionally forwards the request as JSON to BOOKING_WEBHOOK_URL (CRM, Zapier, Make, n8n…).
//
// Email needs the SMTP_* variables (see .env.example). Without them, requests are logged to the
// server console so the form still works during development.

import { createReference, toWebhookPayload, validateEnquiry } from "../_lib/booking";
import { adminNotification, customerConfirmation } from "../_lib/email-templates";
import { isEmailConfigured, notifyTo, sendMail } from "../_lib/mailer";
import { clientIp, rateLimit } from "../_lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(`booking:${clientIp(request)}`);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "too-many-requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "website" field. Pretend success for bots.
  if (body.website) return Response.json({ ok: true, reference: createReference() });

  const result = validateEnquiry(body);
  if (!result.ok) return Response.json({ ok: false, errors: result.errors }, { status: 422 });
  const enquiry = result.enquiry;

  let delivered = false;

  // Team notification (the important one) — then the guest confirmation.
  if (isEmailConfigured()) {
    try {
      const admin = adminNotification(enquiry);
      await sendMail({ to: notifyTo(), replyTo: `${enquiry.name} <${enquiry.email}>`, ...admin });
      delivered = true;
    } catch (err) {
      console.error(`[booking] ${enquiry.reference}: team notification failed`, err);
    }
    try {
      const guest = customerConfirmation(enquiry, notifyTo());
      await sendMail({ to: `${enquiry.name} <${enquiry.email}>`, ...guest });
    } catch (err) {
      console.error(`[booking] ${enquiry.reference}: guest confirmation failed`, err);
    }
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toWebhookPayload(enquiry)),
      });
      if (res.ok) delivered = true;
      else console.error(`[booking] ${enquiry.reference}: webhook responded ${res.status}`);
    } catch (err) {
      console.error(`[booking] ${enquiry.reference}: webhook failed`, err);
    }
  }

  if (!isEmailConfigured() && !webhook) {
    // Development fallback: nothing configured, so just log the request.
    console.info("[booking] received (configure SMTP_* or BOOKING_WEBHOOK_URL to deliver it):", toWebhookPayload(enquiry));
    delivered = true;
  }

  if (!delivered) {
    // Delivery is configured but every channel failed — tell the visitor so they can use WhatsApp instead.
    return Response.json({ ok: false, error: "delivery-failed", reference: enquiry.reference }, { status: 502 });
  }

  return Response.json({ ok: true, reference: enquiry.reference });
}
