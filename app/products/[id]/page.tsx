"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Product = {
  name: string
  sku: string
  description: string | null
  quantity: number
  costPrice: number | null
  sellPrice: number | null
  lowStock: number | null
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then(async (res) => {
      if (res.ok) setProduct(await res.json())
    })
  }, [params.id])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        sku: form.get("sku"),
        description: form.get("description") || null,
        quantity: Number(form.get("quantity") || 0),
        costPrice: form.get("costPrice") ? Number(form.get("costPrice")) : null,
        sellPrice: form.get("sellPrice") ? Number(form.get("sellPrice")) : null,
        lowStock: form.get("lowStock") ? Number(form.get("lowStock")) : null,
      }),
    })

    window.location.href = "/products"
  }

  if (!product) return <p>Loading product...</p>

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-3 rounded bg-white p-5 shadow">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <input defaultValue={product.name} name="name" required className="w-full rounded border p-2" />
      <input defaultValue={product.sku} name="sku" required className="w-full rounded border p-2" />
      <textarea defaultValue={product.description ?? ""} name="description" className="w-full rounded border p-2" />
      <input defaultValue={product.quantity} name="quantity" required min={0} type="number" className="w-full rounded border p-2" />
      <input defaultValue={product.costPrice ?? ""} name="costPrice" min={0} step="0.01" type="number" className="w-full rounded border p-2" />
      <input defaultValue={product.sellPrice ?? ""} name="sellPrice" min={0} step="0.01" type="number" className="w-full rounded border p-2" />
      <input defaultValue={product.lowStock ?? ""} name="lowStock" min={0} type="number" className="w-full rounded border p-2" />
      <button className="rounded bg-black px-4 py-2 text-white">Update</button>
    </form>
  )
}
