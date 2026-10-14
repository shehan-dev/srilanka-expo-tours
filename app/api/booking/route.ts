// Receives booking requests, itinerary quote requests and newsletter sign-ups.
// Every valid submission gets a reference number and, if BOOKING_WEBHOOK_URL is set,
// is forwarded as JSON to that URL (Zapier / Make / n8n / Airtable / HubSpot workflow)
// where you can send confirmation emails/SMS and create the CRM record.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPES = ["booking", "itinerary", "newsletter"] as const;
type EnquiryType = (typeof TYPES)[number];

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : typeof value === "number" ? value : undefined;

function reference() {
  const d = new Date();
  const ymd = `${d.getFullYear() % 100}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `SLE-${ymd}-${rand}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (body.website) return Response.json({ ok: true, reference: reference() });

  const type: EnquiryType = TYPES.includes(body.type as EnquiryType) ? (body.type as EnquiryType) : "booking";
  const email = clean(body.email, 200);
  const name = clean(body.name, 120);

  const errors: Record<string, string> = {};
  if (typeof email !== "string" || !EMAIL.test(email)) errors.email = "invalid";
  if (type !== "newsletter" && !name) errors.name = "required";
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  const enquiry = {
    reference: reference(),
    type,
    receivedAt: new Date().toISOString(),
    name,
    email,
    phone: clean(body.phone, 40),
    language: clean(body.language, 10),
    adults: clean(body.adults, 3),
    kids: clean(body.kids, 3),
    startDate: clean(body.startDate, 20),
    endDate: clean(body.endDate, 20),
    tour: clean(body.tour, 120),
    option: body.option === "premium" || body.option === "standard" ? body.option : undefined,
    message: clean(body.message, 4000),
    smsOptIn: Boolean(body.smsOptIn),
    // Itinerary builder payload (already a plain object from the client)
    itinerary: type === "itinerary" && typeof body.itinerary === "object" ? body.itinerary : undefined,
  };

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
    } catch (err) {
      console.error("[booking] webhook failed", err);
    }
  } else {
    console.info("[booking] received (set BOOKING_WEBHOOK_URL to forward):", enquiry);
  }

  return Response.json({ ok: true, reference: enquiry.reference });
}
