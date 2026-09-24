// Reads decoded PIXEL dimensions straight out of an image's header, without
// decoding any pixel data — used to reject a "decompression bomb" before it
// ever reaches Satori/resvg (see the byte-size cap in urlSafety.ts, which
// only bounds the file's size on the wire: a small, highly-compressed image
// can still be enormous once decoded — e.g. a 30000x30000 solid-color PNG is
// tiny on disk but huge in memory once rendered).
//
// Only the three formats fetchSafely ever accepts (see ALLOWED_IMAGE_TYPES)
// need parsers here. Each one reads only the fixed handful of header bytes
// the format spec guarantees are there — never anything past the header,
// and never any actual pixel data.

export interface ImageDimensions {
  width: number;
  height: number;
  // The format actually verified from the header bytes — not whatever a
  // Content-Type header claims. Callers that set their own response
  // Content-Type (the photo proxy) should key off this, not an upstream
  // server's word for it.
  format: "png" | "jpeg" | "webp";
}

// One place mapping a verified format to the header value a response should
// actually send — keeps IMAGE_CONTENT_TYPE.png/.jpeg/.webp as the only
// spelling of "image/png" etc. that a verified-bytes response uses.
export const IMAGE_CONTENT_TYPE: Record<ImageDimensions["format"], string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

function getPngDimensions(buf: Buffer): ImageDimensions | null {
  // 8-byte signature, then the first chunk is always IHDR: 4-byte length,
  // 4-byte type "IHDR", then 4-byte width + 4-byte height (both big-endian).
  if (buf.length < 24) return null;
  const isPng =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a;
  if (!isPng) return null;
  if (buf.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: "png" };
}

function getJpegDimensions(buf: Buffer): ImageDimensions | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1; // resync past fill/padding bytes
      continue;
    }
    const marker = buf[offset + 1];
    // Markers with no payload/length field
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }
    if (offset + 4 > buf.length) return null;
    const segmentLength = buf.readUInt16BE(offset + 2);
    // SOFn (Start Of Frame) markers carry the real pixel dimensions.
    // 0xC4 (DHT), 0xC8 (JPG ext, unused), 0xCC (DAC) are excluded — same
    // 0xC0-0xCF range but not actually frame markers.
    const isSofMarker = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSofMarker) {
      if (offset + 9 > buf.length) return null;
      // Payload: 1 byte precision, 2 bytes height, 2 bytes width (all after the length field)
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7), format: "jpeg" };
    }
    if (marker === 0xda) return null; // start of scan — no SOF seen before the compressed data, bail
    offset += 2 + segmentLength;
  }
  return null;
}

function getWebpDimensions(buf: Buffer): ImageDimensions | null {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunkType = buf.toString("ascii", 12, 16);

  if (chunkType === "VP8X") {
    // Extended format: 1 byte flags, 3 bytes reserved, then 3-byte
    // little-endian (canvas width - 1) and (canvas height - 1).
    const width = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
    const height = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1;
    return { width, height, format: "webp" };
  }
  if (chunkType === "VP8 ") {
    // Lossy: 3-byte frame tag, 3-byte start code (0x9d 0x01 0x2a), then two
    // little-endian 16-bit fields — low 14 bits are the dimension, top 2
    // bits are a scale factor we don't need.
    if (buf.length < 30 || buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null;
    const width = buf.readUInt16LE(26) & 0x3fff;
    const height = buf.readUInt16LE(28) & 0x3fff;
    return { width, height, format: "webp" };
  }
  if (chunkType === "VP8L") {
    // Lossless: 1 byte signature (0x2f), then a 4-byte little-endian bitfield —
    // low 14 bits (width - 1), next 14 bits (height - 1).
    if (buf[20] !== 0x2f) return null;
    const bits = buf.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height, format: "webp" };
  }
  return null;
}

export function getImageDimensions(buf: Buffer): ImageDimensions | null {
  return getPngDimensions(buf) ?? getJpegDimensions(buf) ?? getWebpDimensions(buf);
}
