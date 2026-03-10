"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type Product = {
  id: string
  name: string
  sku: string
  quantity: number
  sellPrice: number | null
  lowStock: number | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")

  const load = () => {
    fetch("/api/products").then(async (res) => {
      if (res.ok) setProducts(await res.json())
    })
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  )

  async function remove(id: string) {
    if (!window.confirm("Delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link className="rounded bg-black px-3 py-2 text-white" href="/products/new">
          Add Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Search by name or SKU"
      />

      <table className="w-full rounded bg-white text-left text-sm shadow">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Low Stock</th>
            <th>Selling Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b">
              <td><Link className="underline" href={`/products/${p.id}`}>{p.name}</Link></td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>{p.lowStock !== null && p.quantity <= p.lowStock ? "⚠️" : "-"}</td>
              <td>{p.sellPrice ?? "-"}</td>
              <td>
                <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
