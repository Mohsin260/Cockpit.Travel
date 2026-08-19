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

    expect(sessionResult.user).toBeDefined();
    const sessionUser = sessionResult.user as NonNullable<typeof sessionResult.user> & {
      id: string;
      roles: string[];
      avatarUrl?: string | null;
    };

    expect(sessionUser.id).toBe("abc123");
    expect(sessionUser.name).toBe("Primary Administrator");
    expect(sessionUser.email).toBe("admin@cockpit.travel");
    expect(sessionUser.roles).toEqual(["admin"]);
    expect(sessionUser.avatarUrl).toBe("https://example.com/avatar.jpg");
  });
});
