"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Product = { id: string; name: string; sku: string; quantity: number; sellPrice: number | null; lowStock: number | null }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")

  const load = () => fetch("/api/products").then(async (res) => res.ok && setProducts(await res.json()))
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())), [products, search])

  async function remove(id: string) {
    if (!window.confirm("Delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Products</CardTitle>
          <Link href="/products/new" className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Add Product
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500"><th className="py-2">Name</th><th>SKU</th><th>Qty</th><th>Alert</th><th>Selling Price</th><th /></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3"><Link className="font-medium underline" href={`/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.sku}</td><td>{p.quantity}</td>
                  <td>{p.lowStock !== null && p.quantity <= p.lowStock ? <Badge className="bg-amber-100 text-amber-700">Low</Badge> : "-"}</td>
                  <td>{p.sellPrice ?? "-"}</td>
                  <td><Button variant="destructive" onClick={() => remove(p.id)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
