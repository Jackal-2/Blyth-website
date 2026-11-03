import type { Metadata } from "next";
import PageReveal from "@/components/PageReveal";
import { OpenInAppButtons } from "@/components/OpenInAppButtons";
import { ANDROID_PACKAGE, STORE_URLS } from "@/lib/appLinks";

// One link for emails: opens the Blyth app on whichever phone it's tapped on
// (or that phone's store page if the app isn't installed).
export const metadata: Metadata = {
  title: "Open Blyth",
  description: "Open the Blyth app.",
  robots: { index: false, follow: false },
};

const SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? "blyth";
const PLAY_STORE = STORE_URLS.android || `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

export default function OpenAppPage() {
  const iosApp = `${SCHEME}://`;
  const androidApp = `intent://#Intent;scheme=${SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE)};end`;

  return (
    <main className="helper-page">
      <div className="container">
        <PageReveal>
          <div className="listing-card">
            <div className="listing-card-body">
              <h1 className="helper-name">Open Blyth</h1>
              <p className="helper-meta">
                <span>Pick up where you left off in the app.</span>
              </p>
              <OpenInAppButtons iosApp={iosApp} androidApp={androidApp} iosStore={STORE_URLS.ios} androidStore={PLAY_STORE} />
            </div>
          </div>
        </PageReveal>
      </div>
    </main>
  );
}
