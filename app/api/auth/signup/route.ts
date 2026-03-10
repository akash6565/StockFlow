import { hash } from "bcrypt"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { getPrisma } from "@/lib/prisma"

const signupSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(8),
    organizationName: z.string().trim().min(2),
  })
  .strict()

export async function POST(req: Request) {
  try {
    const payload = signupSchema.parse(await req.json())
    const prisma = await getPrisma()
    const email = payload.email.toLowerCase()
    const passwordHash = await hash(payload.password, 10)

    const organization = await prisma.organization.create({
      data: {
        name: payload.organizationName,
        settings: { create: { defaultLowStock: 5 } },
        users: { create: { email, password: passwordHash } },
      },
      include: {
        users: { select: { id: true, email: true } },
      },
    })

    const user = organization.users[0]
    return Response.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid signup input", details: error.flatten() }, { status: 400 })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Email already registered" }, { status: 409 })
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return Response.json(
        { error: "Database connection failed. Check DATABASE_URL / Neon connection string." },
        { status: 500 },
      )
    }

    console.error("Signup failed", error)
    return Response.json({ error: "Failed to create account" }, { status: 500 })
  }
}
