"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"

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
      setLoading(false)
      return
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
      setLoading(false)
      return
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      callbackUrl: "/dashboard",
    })
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded bg-white p-5 shadow">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input name="organizationName" className="w-full rounded border p-2" placeholder="Organization name" required />
      <input name="email" type="email" className="w-full rounded border p-2" placeholder="Email" required />
      <input name="password" type="password" className="w-full rounded border p-2" placeholder="Password (8+ chars)" minLength={8} required />
      <input name="confirmPassword" type="password" className="w-full rounded border p-2" placeholder="Confirm password" minLength={8} required />
      <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">
        {loading ? "Creating..." : "Sign up"}
      </button>
    </form>
  )
}
