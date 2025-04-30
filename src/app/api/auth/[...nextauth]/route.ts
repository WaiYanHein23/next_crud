import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required"); // This triggers the error URL
        }

        try {
          const user = await prisma.author.findFirst({
            where: { username: credentials.username },
          });
          console.log("Found user:", user); // Debug

          if (!user) throw new Error("User not found"); // Will trigger error URL

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) throw new Error("Invalid password"); // Will trigger error URL

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
          }; // Success
        } catch (error) {
          console.error("Auth error:", error);
          throw error; // Forward the error to NextAuth
        }
      },
    }),
  ],
  pages: {
    error: "/auth/login", // Redirect errors to login page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Validate URLs before redirect
      try {
        new URL(url);
        return url.startsWith(baseUrl) ? url : process.env.NEXTAUTH_URL;
      } catch {
        return "/";
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Required for CredentialsProvider
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in dev
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
