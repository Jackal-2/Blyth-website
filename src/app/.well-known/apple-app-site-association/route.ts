import { ASSOCIATED_PATH_PATTERNS, IOS_BUNDLE_ID } from "@/lib/appLinks";

// iOS Universal Links domain-verification file — see
// docs/share-links-and-deep-linking.md, Part 4, and
// https://docs.expo.dev/linking/ios-universal-links/. iOS fetches this from
// https://<domain>/.well-known/apple-app-site-association (at install time,
// and periodically after) to confirm this domain actually authorizes the
// named app to handle its links — the app can't declare that unilaterally
// from its own side (Blyth-frontend/app.json's associatedDomains) without
// this file agreeing on the same app identifier and paths.
//
// A route handler rather than a static file under public/: confirmed by an
// actual local Next.js build+serve that this exact route shape (a
// no-extension file under a dot-prefixed app/ folder) is discovered and
// served correctly, with a route handler guaranteeing the required
// application/json Content-Type and no redirect regardless of hosting — a
// static file's content-type for an extensionless name isn't guaranteed
// the same way across every deployment target.
//
// APPLE_TEAM_ID is not yet known. Find it under Apple Developer ->
// Membership (a 10-character alphanumeric id), or via `eas credentials`
// once EAS is set up for iOS, then set it as this env var. Left unset, this
// serves a clearly-invalid placeholder team id — Apple just won't verify
// the domain, which fails safely rather than silently pretending to work.
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID ?? "REPLACE_WITH_APPLE_TEAM_ID";

export async function GET() {
  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`,
          paths: ASSOCIATED_PATH_PATTERNS,
        },
      ],
    },
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
