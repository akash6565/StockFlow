"use client"

import { FormEvent } from "react"

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
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-3 rounded bg-white p-5 shadow">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <input name="name" required className="w-full rounded border p-2" placeholder="Name" />
      <input name="sku" required className="w-full rounded border p-2" placeholder="SKU" />
      <textarea name="description" className="w-full rounded border p-2" placeholder="Description (optional)" />
      <input name="quantity" required min={0} type="number" className="w-full rounded border p-2" placeholder="Quantity" />
      <input name="costPrice" min={0} step="0.01" type="number" className="w-full rounded border p-2" placeholder="Cost Price" />
      <input name="sellPrice" min={0} step="0.01" type="number" className="w-full rounded border p-2" placeholder="Selling Price" />
      <input name="lowStock" min={0} type="number" className="w-full rounded border p-2" placeholder="Low Stock Threshold" />
      <button className="rounded bg-black px-4 py-2 text-white">Save</button>
    </form>
  )
}
