import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  telegramLoginTokens,
} from "@/lib/db/schema";

const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Scopes: Google Calendar events (read + write for two-way sync). Google is
// now an OPTIONAL "connect calendar" step in Settings, not used for login —
// Telegram is the primary auth method (see the Credentials provider below).
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // JWT (not "database") sessions: Auth.js requires this whenever a
  // Credentials provider is present (the Telegram login below). Google's
  // Calendar tokens are unaffected — lib/google/calendar.ts reads them
  // straight from the `accounts` table by userId, not from the session.
  session: { strategy: "jwt" },
  providers: [
    Google({
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        loginToken: { label: "Login token", type: "text" },
      },
      async authorize(credentials) {
        const loginToken =
          typeof credentials?.loginToken === "string"
            ? credentials.loginToken
            : null;
        if (!loginToken) return null;

        // One-time use: only a token the bot has approved, not yet
        // consumed, and not expired may be redeemed.
        const [row] = await db
          .select()
          .from(telegramLoginTokens)
          .where(
            and(
              eq(telegramLoginTokens.token, loginToken),
              isNull(telegramLoginTokens.consumedAt),
              gt(telegramLoginTokens.expiresAt, new Date()),
            ),
          )
          .limit(1);

        if (!row || !row.approvedUserId) return null;

        await db
          .update(telegramLoginTokens)
          .set({ consumedAt: new Date() })
          .where(eq(telegramLoginTokens.token, loginToken));

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, row.approvedUserId))
          .limit(1);
        if (!user) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Google sign-in is restricted to the allowlisted emails (Calendar link
    // only — see comment above). Telegram's own allowlist is enforced in
    // the bot (lib/telegram/bot.ts) before a login token is ever approved.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;
      if (allowedEmails.length === 0) return true;
      return allowedEmails.includes(user.email.toLowerCase());
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
