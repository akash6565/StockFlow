import { z } from "zod"
import { desc, eq, getDb, products } from "@/lib/db"
import { getTenant } from "@/lib/tenant"
import { errorResponse } from "@/lib/api-response"

const productSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.number().int().min(0),
  costPrice: z.number().nonnegative().optional().nullable(),
  sellPrice: z.number().nonnegative().optional().nullable(),
  lowStock: z.number().int().nonnegative().optional().nullable(),
})

export async function GET() {
  try {
    const orgId = await getTenant()
    const db = getDb()
    const rows = await db.select().from(products).where(eq(products.orgId, orgId)).orderBy(desc(products.createdAt))
    return Response.json(rows)
  } catch (error) {
    return errorResponse(error, "Failed to load products")
  }
}

export async function POST(req: Request) {
  try {
    const orgId = await getTenant()
    const db = getDb()
    const body = productSchema.parse(await req.json())

    const [product] = await db
      .insert(products)
      .values({ ...body, orgId, description: body.description ?? null, costPrice: body.costPrice ?? null, sellPrice: body.sellPrice ?? null, lowStock: body.lowStock ?? null })
      .returning()

    if (!product) return Response.json({ error: "Failed to create product" }, { status: 500 })

    return Response.json(product, { status: 201 })
  } catch (error) {
    return errorResponse(error, "Failed to create product")
  }
}
