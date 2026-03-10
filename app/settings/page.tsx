"use client"

import { FormEvent, useEffect, useState } from "react"

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(5)

  useEffect(() => {
    fetch("/api/settings").then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        setThreshold(data.defaultLowStock ?? 5)
      }
    })
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLowStock: threshold }),
    })

    alert("Saved")
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded bg-white p-5 shadow">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <label className="text-sm">Default Low Stock Threshold</label>
      <input
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value || 0))}
        type="number"
        min={0}
        className="w-full rounded border p-2"
      />
      <button className="rounded bg-black px-4 py-2 text-white">Save</button>
    </form>
  )
}
