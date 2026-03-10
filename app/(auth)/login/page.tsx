"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"

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

    if (result?.error) {
      setError("Invalid email or password")
      return
    }

    window.location.href = "/dashboard"
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded bg-white p-5 shadow">
      <h1 className="text-2xl font-semibold">Login</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input name="email" type="email" className="w-full rounded border p-2" placeholder="Email" required />
      <input name="password" type="password" className="w-full rounded border p-2" placeholder="Password" required />
      <button className="rounded bg-black px-4 py-2 text-white">Login</button>
      <p className="text-sm">
        New here? <Link className="underline" href="/signup">Create an account</Link>
      </p>
    </form>
  )
}
