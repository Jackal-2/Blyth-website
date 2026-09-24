// Guards every id this site hands to the backend before it's ever put into a
// URL. Without this, an id like "../../admin/users" collapses the request's
// own path when the URL is parsed (new URL() normalizes ".." segments) and
// sends the request to a completely different backend route than intended —
// confirmed with a real Node URL() test, not theoretical. encodeURIComponent
// alone isn't enough on its own to catch every way a bad request could be
// crafted, so this rejects anything that doesn't look like a real id before
// either check happens.
//
// Backend ids are Prisma's default cuid() (see prisma/schema.prisma — 25
// chars, starts with "c", lowercase alphanumeric). Matched a little looser
// than the exact cuid shape so a minor future change to the id scheme
// doesn't silently break every share link.
const ENTITY_ID_PATTERN = /^[a-z0-9]{20,32}$/;

export function isValidEntityId(id: string): boolean {
  return ENTITY_ID_PATTERN.test(id);
}
