import { prisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

export async function GET() {

 const orgId = await getTenant()

 const products =
  await prisma.product.findMany({
   where: { orgId }
  })

 return Response.json(products)
}

export async function POST(req: Request) {

 const orgId = await getTenant()

 const body = await req.json()

 const product =
  await prisma.product.create({
   data: {
    ...body,
    orgId
   }
  })

 return Response.json(product)
}