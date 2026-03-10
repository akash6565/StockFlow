import { prisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

export async function GET() {

 const orgId = await getTenant()

 const products =
  await prisma.product.findMany({
   where: { orgId }
  })

 const totalProducts = products.length

 const totalQuantity =
  products.reduce(
   (sum: any, p: { quantity: any }) => sum + p.quantity,
   0
  )

 const lowStock =
  products.filter((p: { quantity: number }) => p.quantity <= 5)

 return Response.json({
  totalProducts,
  totalQuantity,
  lowStock
 })
}