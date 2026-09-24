"use client";

import { useSyncExternalStore } from "react";

type Platform = "ios" | "android" | "unknown";

type Props = {
  iosApp: string;
  androidApp: string;
  iosStore: string;
  androidStore: string;
};

// navigator.userAgent doesn't change over a page's lifetime, so there's
// nothing to notify on — an empty subscribe is the documented no-op for a
// useSyncExternalStore source that never changes.
function subscribe() {
  return () => {};
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOS) return "ios";
  return "unknown";
}

function getServerSnapshot(): Platform {
  return "unknown";
}

// Picks the right "open in the app" / "get the app" links after hydration —
// never on the server, since the page itself has to stay identical for
// every visitor, link-preview fetchers included. See
// docs/share-links-and-deep-linking.md, Part 2's "never redirect on the
// user agent on the server" rule.
//
// useSyncExternalStore (not useEffect + setState) is what React itself
// recommends for a value that's readable on the client but must render
// differently during SSR: getServerSnapshot always returns "unknown" here,
// so the server (and the very first client render, before hydration
// reconciles) render identically; detectPlatform only ever runs on the
// client, right after.
export function OpenInAppButtons({ iosApp, androidApp, iosStore, androidStore }: Props) {
  const platform = useSyncExternalStore(subscribe, detectPlatform, getServerSnapshot);

  // The app isn't published yet, so both store URLs are still unset — once
  // NEXT_PUBLIC_APP_STORE_URL / NEXT_PUBLIC_PLAY_STORE_URL are set this
  // branch stops firing on its own, no code change needed here.
  if (!iosStore && !androidStore) {
    return <p className="open-in-app-hint">The Blyth app is coming soon.</p>;
  }

  if (platform === "unknown") {
    // Before hydration, on desktop, or an unrecognised phone: offer
    // whichever store links exist rather than guessing.
    return (
      <div className="open-in-app-buttons">
        {iosStore && (
          <a className="btn btn-accent" href={iosStore}>
            Get it on the App Store
          </a>
        )}
        {androidStore && (
          <a className="btn btn-light" href={androidStore}>
            Get it on Google Play
          </a>
        )}
      </div>
    );
  }

  const appUrl = platform === "android" ? androidApp : iosApp;
  const storeUrl = platform === "android" ? androidStore : iosStore;

  return (
    <div className="open-in-app-buttons">
      <a className="btn btn-accent" href={appUrl}>
        Open in the Blyth app
      </a>
      {storeUrl && (
        <a className="btn btn-light" href={storeUrl}>
          Get the app
        </a>
      )}
      <p className="open-in-app-hint">Just installed it? Come back and tap the link you were sent.</p>
    </div>
  );
}
