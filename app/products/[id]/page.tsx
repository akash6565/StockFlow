"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Product = { name: string; sku: string; description: string | null; quantity: number; costPrice: number | null; sellPrice: number | null; lowStock: number | null }

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then(async (res) => res.ok && setProduct(await res.json()))
  }, [params.id])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"), sku: form.get("sku"), description: form.get("description") || null,
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
    <Card className="mx-auto max-w-2xl">
      <CardHeader><CardTitle>Edit Product</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Name</Label><Input defaultValue={product.name} name="name" required /></div>
          <div><Label>SKU</Label><Input defaultValue={product.sku} name="sku" required /></div>
          <div><Label>Quantity</Label><Input defaultValue={product.quantity} name="quantity" required min={0} type="number" /></div>
          <div><Label>Cost Price</Label><Input defaultValue={product.costPrice ?? ""} name="costPrice" min={0} step="0.01" type="number" /></div>
          <div><Label>Selling Price</Label><Input defaultValue={product.sellPrice ?? ""} name="sellPrice" min={0} step="0.01" type="number" /></div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea defaultValue={product.description ?? ""} name="description" /></div>
          <div><Label>Low Stock Threshold</Label><Input defaultValue={product.lowStock ?? ""} name="lowStock" min={0} type="number" /></div>
          <div className="sm:col-span-2"><Button>Update Product</Button></div>
        </form>
      </CardContent>
    </Card>
  )
}
