"use client"

import { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewProductPage() {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    await fetch("/api/products", {
      method: "POST",
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

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Name</Label><Input name="name" required /></div>
          <div><Label>SKU</Label><Input name="sku" required /></div>
          <div><Label>Quantity</Label><Input name="quantity" required min={0} type="number" /></div>
          <div><Label>Cost Price</Label><Input name="costPrice" min={0} step="0.01" type="number" /></div>
          <div><Label>Selling Price</Label><Input name="sellPrice" min={0} step="0.01" type="number" /></div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea name="description" /></div>
          <div><Label>Low Stock Threshold</Label><Input name="lowStock" min={0} type="number" /></div>
          <div className="sm:col-span-2"><Button>Save Product</Button></div>
        </form>
      </CardContent>
    </Card>
  )
}
