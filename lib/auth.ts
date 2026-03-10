import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
 providers: [
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
   },

   async authorize(credentials) {

    if (!credentials?.email || !credentials?.password) {
     throw new Error("Missing credentials")
    }

    const user = await prisma.user.findUnique({
     where: { email: credentials.email }
    })

    if (!user) {
     throw new Error("User not found")
    }

    const isValid = await compare(credentials.password, user.password)

    if (!isValid) {
     throw new Error("Invalid password")
    }

    return {
     id: user.id,
     email: user.email,
     orgId: user.orgId
    } as any
   }
  })
 ],

 session: {
  strategy: "jwt"
 },

 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    token.orgId = (user as any).orgId
   }
   return token
  },

  async session({ session, token }) {
   if (session.user) {
    (session.user as any).orgId = token.orgId
   }
   return session
  }
 },

 secret: process.env.NEXTAUTH_SECRET
}