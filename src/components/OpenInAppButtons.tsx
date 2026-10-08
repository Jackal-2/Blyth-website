"use client";

import { useSyncExternalStore } from "react";

type Platform = "ios" | "android" | "unknown";

type Props = {
  iosApp: string;
  androidApp: string;
  iosStore: string;
  androidStore: string;
};

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

export function OpenInAppButtons({ iosApp, androidApp, iosStore, androidStore }: Props) {
  const platform = useSyncExternalStore(subscribe, detectPlatform, getServerSnapshot);

  if (!iosStore && !androidStore) {
    return <p className="open-in-app-hint">The Blyth app is coming soon.</p>;
  }

  if (platform === "unknown") {
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
