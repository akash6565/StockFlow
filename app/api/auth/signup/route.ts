import { hash } from "bcrypt"
import { z } from "zod"
import { eq, getDb, organizations, settings, users } from "@/lib/db"

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
    const db = getDb()
    const email = payload.email.toLowerCase()
    const passwordHash = await hash(payload.password, 10)

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 })
    }

    const [organization] = await db.insert(organizations).values({ name: payload.organizationName }).returning()
    await db.insert(settings).values({ orgId: organization.id, defaultLowStock: 5 })

    const [user] = await db
      .insert(users)
      .values({ email, password: passwordHash, orgId: organization.id })
      .returning({ id: users.id, email: users.email })

    return Response.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid signup input", details: error.flatten() }, { status: 400 })
    }

    console.error("Signup failed", error)
    return Response.json({ error: "Failed to create account" }, { status: 500 })
  }
}
