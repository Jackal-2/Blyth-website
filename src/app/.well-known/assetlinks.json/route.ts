import { ANDROID_PACKAGE } from "@/lib/appLinks";

// Android App Links domain-verification file — see
// docs/share-links-and-deep-linking.md, Part 4, and
// https://docs.expo.dev/linking/android-app-links/. Android fetches this
// from https://<domain>/.well-known/assetlinks.json at install time to
// confirm this domain authorizes the named app (by package name + signing
// certificate) to handle its links. See apple-app-site-association's own
// route handler (sibling file) for why this is a route handler rather than
// a static file under public/ — confirmed by an actual local build+serve
// that this exact shape works.
//
// ANDROID_SHA256_FINGERPRINTS is not yet known. Get it via
// `eas credentials -p android` (select the relevant build profile) once EAS
// is set up for Android, or `keytool -list -v -keystore <path>` for a
// locally-managed keystore — it's the certificate's SHA-256 fingerprint,
// colon-separated hex. Comma-separate multiple values (e.g. a
// development-build fingerprint alongside the eventual Play App Signing
// one for production). Left unset, this serves an empty fingerprint list —
// Android just won't verify the domain, which fails safely rather than
// silently pretending to work.
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
