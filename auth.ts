import NextAuth from "next-auth";//
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma/client";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize() {
        return null;
      },
    }),
  ],
});
