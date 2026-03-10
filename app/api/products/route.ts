import { z } from "zod"
import { getPrisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

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
  const orgId = await getTenant()
  const prisma = await getPrisma()
  const products = await prisma.product.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(products)
}

export async function POST(req: Request) {
  const orgId = await getTenant()

  const prisma = await getPrisma()

  try {
    const body = productSchema.parse(await req.json())
    const product = await prisma.product.create({
      data: {
        ...body,
        orgId,
      },
    })

    return Response.json(product, { status: 201 })
  } catch {
    return Response.json({ error: "Invalid payload or duplicate SKU" }, { status: 400 })
  }
}
