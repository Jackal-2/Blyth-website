import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/urlSafety", () => ({
  fetchImageSafely: vi.fn(),
}));

import { fetchImageSafely } from "@/lib/urlSafety";
import { GET } from "../route";

// route.ts only ever reads req.nextUrl.searchParams — a real NextRequest
// needs more of the Next.js runtime than a plain vitest/node environment
// provides, so a minimal stand-in is enough. Mirrors the fakeRequest()
// approach in src/__tests__/middleware.test.ts.
function fakeRequest(url: string): NextRequest {
  return { nextUrl: new URL(url) } as unknown as NextRequest;
}

describe("GET /api/photo", () => {
  beforeEach(() => {
    vi.mocked(fetchImageSafely).mockReset();
  });

  it("returns 400 when no url is given", async () => {
    const res = await GET(fakeRequest("http://localhost/api/photo"));
    expect(res.status).toBe(400);
  });

  it("returns 404 when fetchImageSafely rejects the url", async () => {
    vi.mocked(fetchImageSafely).mockResolvedValue(null);
    const res = await GET(fakeRequest("http://localhost/api/photo?u=https%3A%2F%2Fexample.com%2Fx"));
    expect(res.status).toBe(404);
  });

  it("sets Content-Type from the verified format — not the upstream's claimed contentType — plus nosniff and a locked-down CSP", async () => {
    vi.mocked(fetchImageSafely).mockResolvedValue({
      body: Buffer.from([1, 2, 3]),
      contentType: "image/png", // what the upstream server claimed — must be ignored
      format: "jpeg", // what getImageDimensions actually verified from the bytes
    });

    const res = await GET(fakeRequest("http://localhost/api/photo?u=https%3A%2F%2Fexample.com%2Fx"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/jpeg");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Content-Security-Policy")).toBe("default-src 'none'");
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });
});
