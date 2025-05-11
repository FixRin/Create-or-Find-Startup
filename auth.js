// src/auth.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";

const nextAuthHandler = NextAuth({
  // ⚠️ call the provider factory with your env vars
  providers: [
    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user: { name, email, image }, profile: { id, login, bio } }) {
      const existing = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if (!existing) {
        await writeClient.create({
          _type:   "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });
        if (user) token.id = user._id;
      }
      return token;
    },

    async session({ session, token }) {
      session.id = token.id ;
      return session;
    },
  },
});

// destructure exactly what NextAuth gives you:
export const { handlers, auth, signIn, signOut } = nextAuthHandler;
