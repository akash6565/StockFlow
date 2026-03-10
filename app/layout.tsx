import Link from "next/link"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <main className="mx-auto max-w-5xl px-4 py-6">
          <nav className="mb-6 flex gap-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/products">Products</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/login" className="ml-auto">
              Login
            </Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  )
}
