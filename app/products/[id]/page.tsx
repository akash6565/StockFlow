import { prisma } from "@/lib/prisma"
import { getTenant } from "@/lib/tenant"
import { notFound } from "next/navigation"

interface PageProps {
 params: {
  id: string
 }
}

export default async function ProductPage({ params }: PageProps) {

 const orgId = await getTenant()

 const product = await prisma.product.findFirst({
  where: {
   id: params.id,
   orgId: orgId
  }
 })

 if (!product) {
  notFound()
 }

 return (
  <div className="p-8 max-w-3xl mx-auto">

   <h1 className="text-3xl font-bold mb-6">
    Product Details
   </h1>

   <div className="bg-white shadow rounded-xl p-6 space-y-4">

    <div>
     <p className="text-sm text-gray-500">Product Name</p>
     <p className="text-lg font-semibold">{product.name}</p>
    </div>

    <div>
     <p className="text-sm text-gray-500">SKU</p>
     <p className="text-lg">{product.sku}</p>
    </div>

    <div>
     <p className="text-sm text-gray-500">Description</p>
     <p>{product.description || "No description provided"}</p>
    </div>

    <div className="grid grid-cols-2 gap-4">

     <div>
      <p className="text-sm text-gray-500">Quantity</p>
      <p className="text-lg font-semibold">
       {product.quantity}
      </p>
     </div>

     <div>
      <p className="text-sm text-gray-500">Low Stock Alert</p>
      <p className="text-lg">
       {product.lowStock || 5}
      </p>
     </div>

    </div>

    <div className="grid grid-cols-2 gap-4">

     <div>
      <p className="text-sm text-gray-500">Cost Price</p>
      <p>₹ {product.costPrice || 0}</p>
     </div>

     <div>
      <p className="text-sm text-gray-500">Selling Price</p>
      <p>₹ {product.sellPrice || 0}</p>
     </div>

    </div>

    <div className="pt-4 text-sm text-gray-400">
     Created: {product.createdAt.toLocaleDateString()}
    </div>

   </div>

  </div>
 )
}