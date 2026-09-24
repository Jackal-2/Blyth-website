import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchInternalById } from "../internalFetch";

describe("fetchInternalById", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null and never fetches when the id fails validation", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchInternalById("../../admin", (id) => `/posts/${id}/public`, "post");

    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("builds the path from the encoded id and unwraps the named field on success", async () => {
    const fetchSpy = vi.fn(async (url: string) => {
      expect(url).toContain("/posts/ckv7q3x9e0000gzcp1a2b3c4d/public");
      return {
        ok: true,
        json: async () => ({ post: { id: "ckv7q3x9e0000gzcp1a2b3c4d" } }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchInternalById<{ id: string }>(
      "ckv7q3x9e0000gzcp1a2b3c4d",
      (id) => `/posts/${id}/public`,
      "post",
    );

    expect(result).toEqual({ id: "ckv7q3x9e0000gzcp1a2b3c4d" });
  });

  it("returns null on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false }) as Response),
    );

    const result = await fetchInternalById("ckv7q3x9e0000gzcp1a2b3c4d", (id) => `/posts/${id}/public`, "post");
    expect(result).toBeNull();
  });

  it("returns null instead of throwing when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    const result = await fetchInternalById("ckv7q3x9e0000gzcp1a2b3c4d", (id) => `/posts/${id}/public`, "post");
    expect(result).toBeNull();
  });
});
