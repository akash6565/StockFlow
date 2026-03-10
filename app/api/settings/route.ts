import { z } from "zod"
import { getPrisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

const settingsSchema = z.object({
  defaultLowStock: z.number().int().min(0),
})

export async function GET() {
  const orgId = await getTenant()
  const prisma = await getPrisma()
  const settings = await prisma.setting.findUnique({ where: { orgId } })

  return Response.json(settings ?? { defaultLowStock: 5 })
}

export async function POST(req: Request) {
  const orgId = await getTenant()

  const prisma = await getPrisma()

  try {
    const body = settingsSchema.parse(await req.json())

    const settings = await prisma.setting.upsert({
      where: { orgId },
      update: { defaultLowStock: body.defaultLowStock },
      create: { orgId, defaultLowStock: body.defaultLowStock },
    })

    return Response.json(settings)
  } catch {
    return Response.json({ error: "Invalid setting value" }, { status: 400 })
  }
}
