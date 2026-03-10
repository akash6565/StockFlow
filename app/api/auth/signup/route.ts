import { hash } from "bcrypt"
import { z } from "zod"
import { getPrisma } from "@/lib/prisma"

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    organizationName: z.string().min(2),
  })
  .strict()

export async function POST(req: Request) {
  try {
    const payload = signupSchema.parse(await req.json())
    const email = payload.email.toLowerCase().trim()
    const prisma = await getPrisma()

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return Response.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hash(payload.password, 10)
    const org = await prisma.organization.create({ data: { name: payload.organizationName.trim() } })
    await prisma.setting.create({ data: { orgId: org.id, defaultLowStock: 5 } })
    const user = await prisma.user.create({ data: { email, password: passwordHash, orgId: org.id } })

    return Response.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.flatten() }, { status: 400 })
    }
    return Response.json({ error: "Failed to create account" }, { status: 500 })
  }
}
