import { z } from "zod"
import { eq, getDb, settings } from "@/lib/db"
import { getTenant } from "@/lib/tenant"
import { errorResponse } from "@/lib/api-response"

const settingsSchema = z.object({
  defaultLowStock: z.number().int().min(0),
})

export async function GET() {
  try {
    const orgId = await getTenant()
    const db = getDb()
    const [row] = await db.select().from(settings).where(eq(settings.orgId, orgId)).limit(1)

    return Response.json(row ?? { defaultLowStock: 5 })
  } catch (error) {
    return errorResponse(error, "Failed to load settings")
  }
}

export async function POST(req: Request) {
  try {
    const orgId = await getTenant()
    const db = getDb()
    const body = settingsSchema.parse(await req.json())

    const [existing] = await db.select({ id: settings.id }).from(settings).where(eq(settings.orgId, orgId)).limit(1)
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ defaultLowStock: body.defaultLowStock })
        .where(eq(settings.orgId, orgId))
        .returning()
      return Response.json(updated)
    }

    const [created] = await db.insert(settings).values({ orgId, defaultLowStock: body.defaultLowStock }).returning()
    return Response.json(created)
  } catch (error) {
    return errorResponse(error, "Failed to save settings")
  }
}
