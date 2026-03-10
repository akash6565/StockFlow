import { eq, getDb, products, settings } from "@/lib/db"
import { getTenant } from "@/lib/tenant"

type ProductRow = { quantity: number; lowStock: number | null }

export async function GET() {
  const orgId = await getTenant()
  const db = getDb()

  const [productRows, settingsRow] = await Promise.all([
    db.select().from(products).where(eq(products.orgId, orgId)),
    db.select().from(settings).where(eq(settings.orgId, orgId)).limit(1),
  ])

  const defaultThreshold = settingsRow[0]?.defaultLowStock ?? 5
  const lowStock = productRows.filter((product: ProductRow) => product.quantity <= (product.lowStock ?? defaultThreshold))

  return Response.json({
    totalProducts: productRows.length,
    totalQuantity: productRows.reduce((sum: number, product: ProductRow) => sum + product.quantity, 0),
    lowStock,
    defaultThreshold,
  })
}
