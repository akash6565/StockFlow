import { prisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"

export async function GET(){

 const orgId = await getTenant()

 const settings =
  await prisma.setting.findUnique({
   where:{orgId}
  })

 return Response.json(settings)
}

export async function POST(req:Request){

 const orgId = await getTenant()

 const body = await req.json()

 const settings =
  await prisma.setting.upsert({

   where:{orgId},

   update:{defaultLowStock:body.defaultLowStock},

   create:{
    orgId,
    defaultLowStock:body.defaultLowStock
   }

  })

 return Response.json(settings)
}