import type { NextRequest } from "next/server";
import { checkVisitorRateLimit } from "@/lib/visitorRateLimit";
import { isComingSoon } from "@/lib/siteStatus";
import { cleanEmail, cleanName, emailError, nameError } from "@/lib/waitlistInput";
import { getVisitorKey } from "@/middleware";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const INTERNAL_KEY = process.env.INTERNAL_SHARE_API_KEY;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_VISITOR = 5;
const MAX_SHARED = 200;
const MAX_BODY_BYTES = 2048;
const ALLOWED_KEYS = new Set(["name", "email", "company"]);

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

// Only the Blyth website itself may post here (not another site, not a form elsewhere).
function isSameSite(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isSameSite(req)) return reply(403, { error: "Not allowed." });
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return reply(415, { error: "Not allowed." });
  }

  const key = getVisitorKey(req);
  const max = key === "shared" ? MAX_SHARED : MAX_PER_VISITOR;
  if (!checkVisitorRateLimit(`waitlist:${key}`, WINDOW_MS, max)) {
    return reply(429, { error: "Too many tries. Please wait a few minutes and try again." });
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return reply(413, { error: "Check your name and email." });

  let parsed: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return reply(413, { error: "Check your name and email." });
    parsed = JSON.parse(text);
  } catch {
    return reply(400, { error: "Check your name and email." });
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return reply(400, { error: "Check your name and email." });
  }
  const body = parsed as Record<string, unknown>;
  if (Object.keys(body).some((k) => !ALLOWED_KEYS.has(k))) {
    return reply(400, { error: "Check your name and email." });
  }

  // Hidden field only bots fill in. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim()) return reply(200, { ok: true });

  const name = cleanName(body.name);
  const email = cleanEmail(body.email);
  const problem = nameError(name) ?? emailError(email);
  if (problem) return reply(400, { error: problem });

  if (!(await isComingSoon())) {
    return reply(410, { error: "Blyth is live! Download the app to become a Helper." });
  }
  if (!INTERNAL_KEY) return reply(503, { error: "Something went wrong. Please try again." });

  try {
    const res = await fetch(`${API_BASE}/public/helper-waitlist`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", "x-internal-share-key": INTERNAL_KEY },
      body: JSON.stringify({ name, email }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return reply(200, { ok: true });
    if (res.status === 400) {
      const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
      // Only pass on short plain messages from our own backend.
      const msg = typeof data?.error === "string" && data.error.length <= 120 ? data.error : "Check your name and email.";
      return reply(400, { error: msg });
    }
    if (res.status === 429) return reply(429, { error: "Too many tries. Please wait a few minutes and try again." });
    return reply(502, { error: "Something went wrong. Please try again." });
  } catch {
    return reply(502, { error: "Something went wrong. Please try again." });
  }
}
