import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as authSchema from "@/db/authSchema";
import { db } from "..";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
      accessType: "offline",
    },
  },
  emailAndPassword: { enabled: false },
  session: {
    expiresIn: 60 * 60 * 24 * 7,        // 7 days
    updateAge: 60 * 60 * 24,            // refresh expiry 1/day
    freshAge: 60 * 5,                   // fresh session window: 5 min
    disableSessionRefresh: false,       // allow auto-refresh
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,                   // cache session in cookie for 5 min
    },
  },
  callbacks: {
    session: async ({ session, user }: { session: any; user: any }) => {
      return {
        ...session,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };
    },
  },
});