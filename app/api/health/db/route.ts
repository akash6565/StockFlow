import { getPrisma } from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = await getPrisma()
    await prisma.$queryRaw`SELECT 1`

    return Response.json({ ok: true, message: "Database connection successful" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error"

    return Response.json(
      {
        ok: false,
        message: "Database connection failed",
        error: message,
      },
      { status: 500 },
    )
  }
}
