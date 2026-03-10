import { getPrisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

export async function GET() {
  const orgId = await getTenant()

  const prisma = await getPrisma()

  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { orgId }, orderBy: { quantity: "asc" } }),
    prisma.setting.findUnique({ where: { orgId } }),
  ])

  const defaultThreshold = settings?.defaultLowStock ?? 5
  const lowStock = products.filter(
    (product) => product.quantity <= (product.lowStock ?? defaultThreshold),
  )

  return Response.json({
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, product) => sum + product.quantity, 0),
    lowStock,
    defaultThreshold,
  })
}
