"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") || "")
    const confirmPassword = String(form.get("confirmPassword") || "")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return setLoading(false)
    }

    const payload = {
      email: String(form.get("email") || ""),
      password,
      organizationName: String(form.get("organizationName") || ""),
    }

    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!signupRes.ok) {
      setError("Unable to sign up. Try another email.")
      return setLoading(false)
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      callbackUrl: "/dashboard",
    })
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Input name="organizationName" placeholder="Organization name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password (8+ chars)" minLength={8} required />
            <Input name="confirmPassword" type="password" placeholder="Confirm password" minLength={8} required />
            <Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Sign up"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
