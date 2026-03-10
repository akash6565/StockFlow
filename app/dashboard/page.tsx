"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Product = {
  id: string
  name: string
  sku: string
  quantity: number
  lowStock: number | null
}

type DashboardData = {
  totalProducts: number
  totalQuantity: number
  defaultThreshold: number
  lowStock: Product[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch("/api/dashboard").then(async (res) => {
      if (res.ok) setData(await res.json())
    })
  }, [])

  if (!data) return <p>Loading dashboard...</p>

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-white p-4 shadow">Products: {data.totalProducts}</div>
        <div className="rounded bg-white p-4 shadow">Total Quantity: {data.totalQuantity}</div>
      </div>

      <section className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Low stock items</h2>
        {!data.lowStock.length ? (
          <p className="text-sm text-slate-500">No low stock products 🎉</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th>Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map((item) => (
                <tr key={item.id} className="border-b">
                  <td>
                    <Link className="underline" href={`/products/${item.id}`}>
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{item.lowStock ?? data.defaultThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
