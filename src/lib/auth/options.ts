import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { z } from "zod";
import type { JWT } from "next-auth/jwt";
import { createHash } from "crypto";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * NextAuth configuration.
 * Strategy: JWT (stateless sessions — no DB session table required).
 * Only one provider (Credentials) is configured; magic links or OAuth
 * can be added here as additional providers in the future.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input shape before hitting the DB
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user) return null;
        if (!user.isActive) return null;      // Soft-disabled accounts are rejected
        if (!user.passwordHash) return null;  // Invite-only accounts with no password set

        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          roles: user.roles,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userEmail = (user as { email?: string | null }).email ?? token.email ?? null;
        const userName = (user as { name?: string | null }).name ?? token.name ?? null;

        token.sub = (user as { id?: string | null }).id ?? token.sub ?? "";
        (token as JWT).roles = (user as { roles?: string[] }).roles ?? ((token as JWT).roles ?? []);
        token.email = userEmail ?? token.email;
        token.name = userName ?? token.name;

        let finalAvatarUrl = (user as any).avatarUrl ?? null;

        if (!finalAvatarUrl && userEmail) {
          const emailHash = createHash("md5").update(userEmail.toLowerCase().trim()).digest("hex");
          finalAvatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=404&s=200`;
        }

        (token as JWT).avatarUrl = finalAvatarUrl ?? ((token as JWT).avatarUrl ?? null);
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub ?? "",
        name: token.name ?? session.user?.name ?? "User",
        email: token.email ?? session.user?.email ?? null,
        roles: ((token as JWT).roles ?? []) as string[],
        avatarUrl: (token as JWT).avatarUrl ?? session.user?.avatarUrl ?? null,
      };
      return session;
    },
  },
};
