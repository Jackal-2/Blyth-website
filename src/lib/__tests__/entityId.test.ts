import { describe, expect, it } from "vitest";
import { isValidEntityId } from "../entityId";

describe("isValidEntityId", () => {
  it("accepts a real cuid-shaped id", () => {
    expect(isValidEntityId("ckv7q3x9e0000gzcp1a2b3c4d")).toBe(true);
  });

  it("accepts ids at the pattern's length bounds", () => {
    expect(isValidEntityId("a".repeat(20))).toBe(true);
    expect(isValidEntityId("a".repeat(32))).toBe(true);
  });

  it("rejects ids outside the length bounds", () => {
    expect(isValidEntityId("a".repeat(19))).toBe(false);
    expect(isValidEntityId("a".repeat(33))).toBe(false);
    expect(isValidEntityId("")).toBe(false);
  });

  it("rejects a path-traversal payload", () => {
    expect(isValidEntityId("../../admin/users")).toBe(false);
  });

  it("rejects uppercase and non-alphanumeric characters", () => {
    expect(isValidEntityId("CKV7Q3X9E0000GZCP1A2B3C4D")).toBe(false);
    expect(isValidEntityId("ckv7q3x9e0000-gzcp1a2b")).toBe(false);
    expect(isValidEntityId("ckv7q3x9e0000 gzcp1a2b")).toBe(false);
  });

  it("rejects an id embedded in a larger string", () => {
    expect(isValidEntityId(`ckv7q3x9e0000gzcp1a2b3c4d/../../etc`)).toBe(false);
  });
});
