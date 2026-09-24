import { describe, expect, it } from "vitest";
import http from "node:http";
import {
  fetchImageAsDataUri,
  fetchSafely,
  fetchViaPinnedConnection,
  isUrlHostSafeAtSaveTime,
} from "../urlSafety";
import { getImageDimensions, IMAGE_CONTENT_TYPE } from "../imageDimensions";

// Spins up a real local server for one test and tears it down. Its address is
// deliberately loopback, which resolveSafeIp/fetchSafely reject by design —
// so these helpers are used to test fetchViaPinnedConnection directly (the
// HTTP mechanics, given an address already cleared) rather than going through
// the full destination-checking fetchSafely. Mirrors
// Blyth-Backend/src/utils/__tests__/urlSafety.test.ts.
async function withServer(
  handler: http.RequestListener,
  run: (baseUrl: URL, resolved: { ip: string; family: 4 }) => Promise<void>,
) {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  try {
    await run(new URL(`http://127.0.0.1:${port}/`), { ip: "127.0.0.1", family: 4 });
  } finally {
    server.close();
  }
}

describe("isUrlHostSafeAtSaveTime", () => {
  it("rejects a literal cloud-metadata address", () => {
    expect(isUrlHostSafeAtSaveTime("http://169.254.169.254/latest/meta-data/")).toBe(false);
  });

  it("rejects the other private/reserved IPv4 ranges", () => {
    expect(isUrlHostSafeAtSaveTime("http://127.0.0.1/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://10.0.0.5/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://192.168.1.1/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://172.20.0.5/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://100.100.0.1/x.png")).toBe(false); // carrier-grade NAT
  });

  it("rejects a decimal-encoded numeric host (169.254.169.254 as an integer)", () => {
    expect(isUrlHostSafeAtSaveTime("http://2852039166/x.png")).toBe(false);
  });

  it("rejects a hex-encoded numeric host", () => {
    expect(isUrlHostSafeAtSaveTime("http://0xA9FEA9FE/x.png")).toBe(false);
  });

  it("rejects IPv4-mapped IPv6 forms", () => {
    expect(isUrlHostSafeAtSaveTime("http://[::ffff:169.254.169.254]/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://[::ffff:a9fe:a9fe]/x.png")).toBe(false);
  });

  it("rejects IPv6 loopback, link-local, and unique-local literals", () => {
    expect(isUrlHostSafeAtSaveTime("http://[::1]/x.png")).toBe(false);
    expect(isUrlHostSafeAtSaveTime("http://[fe90::1]/x.png")).toBe(false); // within fe80::/10, not just the literal "fe80:" prefix
    expect(isUrlHostSafeAtSaveTime("http://[fd12::1]/x.png")).toBe(false);
  });

  it("rejects localhost", () => {
    expect(isUrlHostSafeAtSaveTime("http://localhost/x.png")).toBe(false);
  });

  it("rejects a non-http(s) scheme", () => {
    expect(isUrlHostSafeAtSaveTime("ftp://example.com/x.png")).toBe(false);
  });

  it("rejects unparsable input", () => {
    expect(isUrlHostSafeAtSaveTime("not a url")).toBe(false);
  });

  it("allows an ordinary domain name (DNS is re-checked at fetch time, not here)", () => {
    expect(isUrlHostSafeAtSaveTime("https://cdn.example.com/photo.jpg")).toBe(true);
  });

  it("allows a base64 image data URI (no network involved either way)", () => {
    expect(
      isUrlHostSafeAtSaveTime(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      ),
    ).toBe(true);
  });
});

describe("fetchSafely — destination checking", () => {
  it("rejects a literal cloud-metadata address without ever connecting", async () => {
    expect(await fetchSafely("http://169.254.169.254/latest/meta-data/")).toBeNull();
  });

  it("rejects a decimal-encoded numeric host end to end", async () => {
    expect(await fetchSafely("http://2852039166/x.png")).toBeNull();
  });

  it("rejects an IPv4-mapped IPv6 host end to end", async () => {
    expect(await fetchSafely("http://[::ffff:169.254.169.254]/x.png")).toBeNull();
  });

  it("rejects loopback (also proves nothing on this machine is reachable this way)", async () => {
    expect(await fetchSafely("http://127.0.0.1:1/x.png")).toBeNull();
  });
});

describe("fetchViaPinnedConnection — HTTP mechanics, given an already-cleared address", () => {
  it("never follows a redirect — a 3xx is a failure, and only one request is made", async () => {
    let requestCount = 0;
    await withServer(
      (_req, res) => {
        requestCount += 1;
        res.writeHead(302, { Location: "http://169.254.169.254/should-never-be-requested" });
        res.end();
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved);
        expect(result).toBeNull();
        expect(requestCount).toBe(1); // no follow-up request to the Location target
      },
    );
  });

  it("returns the body and content-type on a real 200 response", async () => {
    const pngBytes = Buffer.from("89504e470d0a1a0a", "hex"); // just the PNG signature — enough for this test
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(pngBytes);
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png"]),
        });
        expect(result).not.toBeNull();
        expect(result?.contentType).toBe("image/png");
        expect(result?.body.equals(pngBytes)).toBe(true);
      },
    );
  });

  it("rejects a content-type outside the allowed set", async () => {
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<html></html>");
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png"]),
        });
        expect(result).toBeNull();
      },
    );
  });

  it("rejects a non-200 status", async () => {
    await withServer(
      (_req, res) => {
        res.writeHead(404);
        res.end();
      },
      async (baseUrl, resolved) => {
        expect(await fetchViaPinnedConnection(baseUrl, resolved)).toBeNull();
      },
    );
  });
});

// SOI, then a single SOF0 (baseline) marker segment carrying real
// dimensions — mirrors imageDimensions.test.ts's helper of the same shape.
function makeJpegBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(18);
  buf.set([0xff, 0xd8], 0); // SOI
  buf.set([0xff, 0xc0], 2); // SOF0
  buf.writeUInt16BE(11, 4); // segment length
  buf.writeUInt8(8, 6); // precision
  buf.writeUInt16BE(height, 7);
  buf.writeUInt16BE(width, 9);
  return buf;
}

describe("fetchImageSafely's format check — the real header bytes win over the upstream's Content-Type claim", () => {
  // fetchSafely (and so fetchImageSafely) rejects loopback destinations by
  // design (see "fetchSafely — destination checking" above), so there's no
  // way to drive fetchImageSafely itself end-to-end against the local test
  // server. This exercises the same two pieces it composes —
  // fetchViaPinnedConnection's Content-Type allowlist, then
  // getImageDimensions' header-byte sniff — directly, proving the format a
  // caller like the photo proxy route ends up with is the one verified from
  // the bytes, not whatever Content-Type header the server sent.
  it("reports the real (JPEG) format from the body even though the server declared Content-Type: image/png", async () => {
    const jpegBytes = makeJpegBuffer(120, 90);
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "image/png" }); // the lie
        res.end(jpegBytes);
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
        });
        expect(result?.contentType).toBe("image/png"); // still the server's claim
        const dims = getImageDimensions(result!.body);
        expect(dims?.format).toBe("jpeg"); // the real, verified format
        expect(IMAGE_CONTENT_TYPE[dims!.format]).toBe("image/jpeg");
      },
    );
  });
});

// Constructs a minimal, header-only PNG buffer with a specific claimed
// width/height — real signature + IHDR bytes, no actual pixel data. Enough
// to exercise getImageDimensions' header-sniffing without needing an image
// library, matching the technique the plain PNG-signature buffer above uses.
function makePngBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(24);
  buf.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

// These three exercise the actual attack the header-byte check exists to
// stop: a malicious or compromised upstream server that LIES about its
// Content-Type. Each simulates the server response fetchViaPinnedConnection
// would receive, then runs the body through getImageDimensions exactly as
// fetchImageSafely does — same two-gate composition as the describe block
// above (content-type allowlist, then real header-byte sniff), since
// fetchImageSafely itself can't be driven end-to-end here (loopback is
// rejected by design — see "fetchSafely — destination checking").
describe("fetchImageSafely's pipeline against hostile bytes — only a real, recognized image survives both gates", () => {
  it("rejects an SVG containing a <script>, even when the server claims it's a PNG", async () => {
    const maliciousSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.domain)</script></svg>',
      "utf8",
    );
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "image/png" }); // the lie — real content-type would be image/svg+xml, itself not in ALLOWED_IMAGE_TYPES either
        res.end(maliciousSvg);
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
        });
        // Passes the content-type gate (the server's claim was allowed) —
        // this is the case that matters: nothing about SVG markup matches
        // any of the three real image signatures, so the header-byte sniff
        // is what actually stops it.
        expect(result).not.toBeNull();
        expect(getImageDimensions(result!.body)).toBeNull();
      },
    );
  });

  it("rejects an HTML document even when served under a .png URL with Content-Type: image/png", async () => {
    const htmlPayload = Buffer.from("<html><body><script>alert(document.domain)</script></body></html>", "utf8");
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "image/png" }); // e.g. a file literally named photo.png that isn't one
        res.end(htmlPayload);
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
        });
        expect(result).not.toBeNull(); // claimed type let it through
        expect(getImageDimensions(result!.body)).toBeNull(); // bytes don't back up the claim
      },
    );
  });

  it("accepts a real JPEG — the one of the three that should actually pass both gates", async () => {
    const realJpeg = makeJpegBuffer(120, 90);
    await withServer(
      (_req, res) => {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(realJpeg);
      },
      async (baseUrl, resolved) => {
        const result = await fetchViaPinnedConnection(baseUrl, resolved, {
          allowedContentTypes: new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
        });
        expect(result).not.toBeNull();
        const dims = getImageDimensions(result!.body);
        expect(dims).toEqual({ width: 120, height: 90, format: "jpeg" });
      },
    );
  });
});

describe("fetchImageAsDataUri — decoded pixel-dimension cap (data: URI branch)", () => {
  it("rejects a data URI whose decoded header claims oversized dimensions", async () => {
    const oversized = makePngBuffer(6000, 6000);
    const dataUri = `data:image/png;base64,${oversized.toString("base64")}`;
    expect(await fetchImageAsDataUri(dataUri)).toBeNull();
  });

  it("accepts a data URI with real dimensions under the cap", async () => {
    const small = makePngBuffer(200, 150);
    const dataUri = `data:image/png;base64,${small.toString("base64")}`;
    expect(await fetchImageAsDataUri(dataUri)).toBe(dataUri);
  });

  it("rejects a data URI whose payload isn't a recognized image at all (a declared type the bytes don't back up)", async () => {
    const notAnImage = Buffer.from("this is not an image", "utf8");
    const dataUri = `data:image/png;base64,${notAnImage.toString("base64")}`;
    expect(await fetchImageAsDataUri(dataUri)).toBeNull();
  });

  it("rejects a dimension just over the (lowered) 2048px cap — previously allowed under the old 4000px cap", async () => {
    const overNewCap = makePngBuffer(2049, 100);
    const dataUri = `data:image/png;base64,${overNewCap.toString("base64")}`;
    expect(await fetchImageAsDataUri(dataUri)).toBeNull();
  });

  it("accepts an image exactly at the 2048px cap on both dimensions", async () => {
    const atCap = makePngBuffer(2048, 2048);
    const dataUri = `data:image/png;base64,${atCap.toString("base64")}`;
    expect(await fetchImageAsDataUri(dataUri)).toBe(dataUri);
  });
});
