"use server";

// Server-only, same reasoning as legalDocuments.ts/providers.ts's API_BASE —
// no NEXT_PUBLIC_ prefix since this never runs in the browser. The contact
// form (components/ContactForm.tsx) posts here via a Server Action rather
// than a client-side fetch straight to the backend, so there's no separate
// CORS story and no API URL exposed to the browser bundle — set
// API_BASE_URL in your deploy environment; this falls back to a local
// backend for development.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

// Backend's POST /contact (Blyth-Backend's contact.controller.ts) is the
// one deliberately unauthenticated write endpoint in the API — public,
// rate-limited (contactLimiter) — built for exactly this. This Server
// Action is what actually calls it; before this the website had no form at
// all, so nothing ever reached that endpoint outside prisma/seed.ts's mock
// rows.
export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in your name, email, and message." };
  }

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
      cache: "no-store",
    });

    if (!res.ok) {
      // The backend's contactLimiter returns 429 on abuse; anything else
      // (400 from its own zod schema, a 5xx) gets the same generic message
      // — no need to leak which validation rule tripped.
      return {
        status: "error",
        message:
          res.status === 429
            ? "Too many messages sent recently — please try again in a bit."
            : "Something went wrong sending your message. Please try emailing us directly instead.",
      };
    }

    return { status: "success", message: "Thanks — we got your message and will get back to you soon." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try emailing us directly instead.",
    };
  }
}
