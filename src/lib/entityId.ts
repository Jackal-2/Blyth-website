const ENTITY_ID_PATTERN = /^[a-z0-9]{20,32}$/;

export function isValidEntityId(id: string): boolean {
  return ENTITY_ID_PATTERN.test(id);
}
