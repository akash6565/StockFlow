import { compare } from "bcrypt"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getNextAuthUrl, validateNextAuthUrl } from "@/lib/env"
import { eq, getDb, users } from "@/lib/db"

const nextAuthUrl = getNextAuthUrl()

if (nextAuthUrl) {
  validateNextAuthUrl(nextAuthUrl)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const db = getDb()
        const email = credentials.email.toLowerCase().trim()
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

        if (!user) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          orgId: user.orgId,
        } as never
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.orgId = (user as unknown as { orgId: string }).orgId
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { orgId?: string }).orgId = token.orgId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
