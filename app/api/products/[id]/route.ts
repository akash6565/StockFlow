import { z } from "zod"
import { getPrisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

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
  const orgId = await getTenant()
  const { id } = await params
  const prisma = await getPrisma()

  const product = await prisma.product.findFirst({ where: { id, orgId } })
  if (!product) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(product)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getTenant()
  const { id } = await params
  const prisma = await getPrisma()

  try {
    const body = updateSchema.parse(await req.json())
    const existing = await prisma.product.findFirst({ where: { id, orgId } })
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 })

    const product = await prisma.product.update({ where: { id }, data: body })
    return Response.json(product)
  } catch {
    return Response.json({ error: "Invalid payload or duplicate SKU" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getTenant()
  const { id } = await params
  const prisma = await getPrisma()

  const existing = await prisma.product.findFirst({ where: { id, orgId } })
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 })

  await prisma.product.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
