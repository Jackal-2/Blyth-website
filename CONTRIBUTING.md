# Contributing

## Checklist: adding a new public page or backend call

The share-card surfaces (listings, helpers, feed posts) have needed the same
fixes three separate times because each one was built before the last one's
fixes became a habit. Go through this before merging a new one:

- **New public page or server-to-server call?** Use `lib/internalFetch.ts`'s
  `fetchInternalById` instead of writing a new `fetch()` call — it validates
  and encodes the id and attaches the shared-secret header for you. Don't
  hand-build the URL.
- **Showing a user-supplied image?** Use `components/ProxiedPhoto.tsx`
  (`<ProxiedPhoto url={...} />`), not a raw `<img src={toProxiedImageUrl(...)}>`
  or — worse — `<img src={someUrl}>` directly. It's the one place that knows
  to always route through `lib/photoProxy.ts`; otherwise the visitor's
  browser fetches the image directly from whatever host the URL points at.
- **New image field, anywhere a URL or data URI is accepted?** Reuse
  `lib/urlSafety.ts`'s `isUrlHostSafeAtSaveTime` / `isValidImageDataUri`
  rather than a fresh regex.
- **New env var meant to gate behavior on/off?** Compare with `=== "true"`,
  never a bare `if (process.env.X)` — the string `"false"` is truthy in JS.
  (See `middleware.ts`'s `TRUST_WEBSITE_PROXY` for the pattern, and the
  security audit's 2.11 for why this matters.)
- **New page or route that takes an id from a deep link** (a share link, a
  query param — not just `/listings/[id]`-style pages)**?** The right frame
  is "does this id, anywhere, reach a `fetch`" — not just "is this a share
  page." That's the shape 2.12 found once and the sweep since has kept
  finding elsewhere; check it explicitly.
- **Add a test.** Every helper above has a `__tests__` sibling — extend it
  rather than trusting a new call site by inspection alone.
