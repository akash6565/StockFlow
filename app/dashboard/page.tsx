"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Product = { id: string; name: string; sku: string; quantity: number; lowStock: number | null }
type DashboardData = { totalProducts: number; totalQuantity: number; defaultThreshold: number; lowStock: Product[] }

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch("/api/dashboard").then(async (res) => res.ok && setData(await res.json()))
  }, [])

  if (!data) return <p>Loading dashboard...</p>

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of your inventory health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card><CardHeader><CardTitle>Total Products</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{data.totalProducts}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Quantity</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{data.totalQuantity}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Low stock items</CardTitle></CardHeader>
        <CardContent>
          {!data.lowStock.length ? (
            <p className="text-sm text-slate-500">No low stock products 🎉</p>
          ) : (
            <div className="space-y-2">
              {data.lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                  <div>
                    <Link className="font-medium underline" href={`/products/${item.id}`}>{item.name}</Link>
                    <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                  </div>
                  <Badge>Qty {item.quantity} / Th {item.lowStock ?? data.defaultThreshold}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
