import "./globals.css"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/settings", label: "Settings" },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">
          <header className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">StockFlow</h1>
                <Badge className="bg-blue-100 text-blue-700">MVP</Badge>
              </div>
              <nav className="flex items-center gap-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
                  Login
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}
