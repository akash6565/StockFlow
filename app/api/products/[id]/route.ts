import { z } from "zod"
import { and, eq, getDb, products } from "@/lib/db"
import { getTenant } from "@/lib/tenant"
import { errorResponse } from "@/lib/api-response"

const updateSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.number().int().min(0),
  costPrice: z.number().nonnegative().optional().nullable(),
  sellPrice: z.number().nonnegative().optional().nullable(),
  lowStock: z.number().int().nonnegative().optional().nullable(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orgId = await getTenant()
    const { id } = await params
    const db = getDb()

    const [product] = await db.select().from(products).where(and(eq(products.id, id), eq(products.orgId, orgId))).limit(1)
    if (!product) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(product)
  } catch (error) {
    return errorResponse(error, "Failed to load product")
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orgId = await getTenant()
    const { id } = await params
    const db = getDb()
    const body = updateSchema.parse(await req.json())

    const existing = await db.select({ id: products.id }).from(products).where(and(eq(products.id, id), eq(products.orgId, orgId))).limit(1)
    if (!existing.length) return Response.json({ error: "Not found" }, { status: 404 })

    const [product] = await db
      .update(products)
      .set({ ...body, description: body.description ?? null, costPrice: body.costPrice ?? null, sellPrice: body.sellPrice ?? null, lowStock: body.lowStock ?? null })
      .where(eq(products.id, id))
      .returning()

    return Response.json(product)
  } catch (error) {
    return errorResponse(error, "Failed to update product")
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orgId = await getTenant()
    const { id } = await params
    const db = getDb()

    const existing = await db.select({ id: products.id }).from(products).where(and(eq(products.id, id), eq(products.orgId, orgId))).limit(1)
    if (!existing.length) return Response.json({ error: "Not found" }, { status: 404 })

    await db.delete(products).where(eq(products.id, id))
    return Response.json({ message: "Product deleted" }, { status: 200 })
  } catch (error) {
    return errorResponse(error, "Failed to delete product")
  }
}
