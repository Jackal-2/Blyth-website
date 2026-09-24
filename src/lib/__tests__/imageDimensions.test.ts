import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getImageDimensions, IMAGE_CONTENT_TYPE } from "../imageDimensions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal, header-only buffers — real signature/marker bytes, no actual
// pixel data. Enough to exercise the header-sniffing logic without an image
// library. Mirrors the technique already used in urlSafety.test.ts.

function makePngBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(24);
  buf.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

// SOI, then a single SOF0 (baseline) marker segment carrying real dimensions.
function makeBaselineJpegBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(18);
  buf.set([0xff, 0xd8], 0); // SOI
  buf.set([0xff, 0xc0], 2); // SOF0
  buf.writeUInt16BE(11, 4); // segment length
  buf.writeUInt8(8, 6); // precision
  buf.writeUInt16BE(height, 7);
  buf.writeUInt16BE(width, 9);
  return buf;
}

// SOI, a real DHT segment (0xC4 — same 0xC0-0xCF range as a frame marker,
// but not one), THEN a SOF2 (progressive DCT, 0xC2) marker carrying the real
// dimensions. This is the shape a real progressive JPEG's header actually
// has (huffman tables before the frame header) — the exact case
// isSofMarker's 0xC4/0xC8/0xCC exclusion exists for: get this wrong and
// either a DHT segment gets misread as a frame header, or a real SOF2 gets
// skipped as "not a real SOFn".
function makeProgressiveJpegBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(18);
  buf.set([0xff, 0xd8], 0); // SOI
  buf.set([0xff, 0xc4], 2); // DHT — must NOT be read as a frame marker
  buf.writeUInt16BE(5, 4); // DHT segment length (2 length bytes + 3 payload bytes)
  buf.set([0xaa, 0xbb, 0xcc], 6); // arbitrary DHT payload
  buf.set([0xff, 0xc2], 9); // SOF2 — the real (progressive) frame marker
  buf.writeUInt16BE(11, 11); // segment length
  buf.writeUInt8(8, 13); // precision
  buf.writeUInt16BE(height, 14);
  buf.writeUInt16BE(width, 16);
  return buf;
}

// Minimal VP8X (extended) WebP: RIFF/WEBP + VP8X chunk with a real canvas size.
function makeWebpVp8xBuffer(width: number, height: number): Buffer {
  const buf = Buffer.alloc(30);
  buf.write("RIFF", 0, "ascii");
  buf.write("WEBP", 8, "ascii");
  buf.write("VP8X", 12, "ascii");
  buf[20] = 0; // flags
  const w = width - 1;
  const h = height - 1;
  buf[24] = w & 0xff;
  buf[25] = (w >> 8) & 0xff;
  buf[26] = (w >> 16) & 0xff;
  buf[27] = h & 0xff;
  buf[28] = (h >> 8) & 0xff;
  buf[29] = (h >> 16) & 0xff;
  return buf;
}

describe("getImageDimensions — format detection", () => {
  it("identifies a PNG and reports format 'png'", () => {
    expect(getImageDimensions(makePngBuffer(200, 150))).toEqual({ width: 200, height: 150, format: "png" });
  });

  it("identifies a baseline JPEG and reports format 'jpeg'", () => {
    expect(getImageDimensions(makeBaselineJpegBuffer(300, 200))).toEqual({
      width: 300,
      height: 200,
      format: "jpeg",
    });
  });

  it("identifies a progressive JPEG (SOF2) past a preceding DHT segment, and reports format 'jpeg'", () => {
    expect(getImageDimensions(makeProgressiveJpegBuffer(640, 480))).toEqual({
      width: 640,
      height: 480,
      format: "jpeg",
    });
  });

  it("identifies an extended (VP8X) WebP and reports format 'webp'", () => {
    expect(getImageDimensions(makeWebpVp8xBuffer(500, 400))).toEqual({ width: 500, height: 400, format: "webp" });
  });

  it("correctly reads dimensions out of a REAL progressive JPEG (not a hand-built header) — fixtures/progressive.jpg, generated with sharp({progressive: true}) and confirmed via sharp().metadata() to be isProgressive:true, 641x481", () => {
    const buf = fs.readFileSync(path.join(__dirname, "fixtures/progressive.jpg"));
    expect(getImageDimensions(buf)).toEqual({ width: 641, height: 481, format: "jpeg" });
  });

  it("returns null for bytes that match no known header", () => {
    expect(getImageDimensions(Buffer.from("not an image at all, just text", "utf8"))).toBeNull();
  });
});

describe("IMAGE_CONTENT_TYPE", () => {
  it("maps every verified format to its real registered media type", () => {
    expect(IMAGE_CONTENT_TYPE.png).toBe("image/png");
    expect(IMAGE_CONTENT_TYPE.jpeg).toBe("image/jpeg");
    expect(IMAGE_CONTENT_TYPE.webp).toBe("image/webp");
  });
});
