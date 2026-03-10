"use client"

import { FormEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(5)

  useEffect(() => {
    fetch("/api/settings").then(async (res) => {
      if (res.ok) setThreshold((await res.json()).defaultLowStock ?? 5)
    })
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLowStock: threshold }),
    })
    alert("Settings saved")
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Global defaults used across low-stock calculations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <Label>Default Low Stock Threshold</Label>
          <Input value={threshold} onChange={(e) => setThreshold(Number(e.target.value || 0))} type="number" min={0} />
          <Button>Save</Button>
        </form>
      </CardContent>
    </Card>
  )
}
