import { describe, expect, it } from "vitest";
import { authOptions } from "./options";

describe("authOptions session callback", () => {
  it("keeps the real database user data in the JWT/session", async () => {
    const jwtCallback = authOptions.callbacks?.jwt;
    const sessionCallback = authOptions.callbacks?.session;

    expect(jwtCallback).toBeDefined();
    expect(sessionCallback).toBeDefined();

    const jwtResult = await jwtCallback!({
      token: { sub: "abc123", name: "Test User", email: "admin@cockpit.travel" },
      user: {
        id: "abc123",
        name: "Primary Administrator",
        email: "admin@cockpit.travel",
        roles: ["admin"],
        avatarUrl: null,
      },
      account: null,
      profile: undefined,
      trigger: "signIn",
    } as any);

    expect(jwtResult.sub).toBe("abc123");
    expect(jwtResult.name).toBe("Primary Administrator");
    expect(jwtResult.email).toBe("admin@cockpit.travel");
    expect(jwtResult.roles).toEqual(["admin"]);

    const sessionResult = await sessionCallback!({
      session: { user: {} },
      token: {
        sub: "abc123",
        name: "Primary Administrator",
        email: "admin@cockpit.travel",
        roles: ["admin"],
        avatarUrl: "https://example.com/avatar.jpg",
      },
      user: undefined,
    } as any);

    expect(sessionResult.user.id).toBe("abc123");
    expect(sessionResult.user.name).toBe("Primary Administrator");
    expect(sessionResult.user.email).toBe("admin@cockpit.travel");
    expect(sessionResult.user.roles).toEqual(["admin"]);
    expect(sessionResult.user.avatarUrl).toBe("https://example.com/avatar.jpg");
  });
});
