import { describe, expect, it } from "vitest";

import {
  generateSessionToken,
  hashPassword,
  SESSION_DURATION_MS,
  verifyPassword,
} from "@/lib/auth";

describe("auth helpers", () => {
  it("hashes and verifies passwords", async () => {
    const password = "s3cret!";
    const hash = await hashPassword(password);

    expect(hash).not.toEqual(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });

  it("generates random session tokens", () => {
    const tokens = new Set<string>();

    for (let i = 0; i < 10; i++) {
      const token = generateSessionToken();
      expect(token).toHaveLength(64);
      tokens.add(token);
    }

    expect(tokens.size).toBe(10);
  });

  it("sets session duration to one hour", () => {
    expect(SESSION_DURATION_MS).toBe(1000 * 60 * 60);
  });

  it("fails verification when hash is malformed", async () => {
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });

  it("does not accept empty passwords", async () => {
    const hash = await hashPassword("nonempty");
    await expect(verifyPassword("", hash)).resolves.toBe(false);
  });
});

