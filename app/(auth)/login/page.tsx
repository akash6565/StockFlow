"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const form = new FormData(event.currentTarget)
    const result = await signIn("credentials", {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      redirect: false,
      callbackUrl: "/dashboard",
    })

    if (result?.error) return setError("Invalid email or password")
    window.location.href = "/dashboard"
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Button className="w-full">Login</Button>
            <p className="text-sm text-slate-600">
              New here? <Link className="underline" href="/signup">Create an account</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
