import { ASSOCIATED_PATH_PATTERNS, IOS_BUNDLE_ID } from "@/lib/appLinks";

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
