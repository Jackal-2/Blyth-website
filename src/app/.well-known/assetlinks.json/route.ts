import { ANDROID_PACKAGE } from "@/lib/appLinks";

const ANDROID_SHA256_FINGERPRINTS = (process.env.ANDROID_SHA256_FINGERPRINTS ?? "")
  .split(",")
  .map((fingerprint) => fingerprint.trim())
  .filter(Boolean);

export async function GET() {
  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE,
        sha256_cert_fingerprints: ANDROID_SHA256_FINGERPRINTS,
      },
    },
  ];

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
