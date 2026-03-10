import { getDatabaseUrl, getNextAuthUrl, validateDatabaseUrl, validateNextAuthUrl } from "@/lib/env"
import { dbHealthcheck } from "@/lib/db"
import { errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const databaseUrl = getDatabaseUrl()
    const nextAuthUrl = getNextAuthUrl()

    if (!databaseUrl) {
      return Response.json(
        { ok: false, message: "Database connection failed", error: "Missing DATABASE_URL/DATABASEURL/databaseurl" },
        { status: 500 },
      )
    }

    validateDatabaseUrl(databaseUrl)

    if (nextAuthUrl) {
      validateNextAuthUrl(nextAuthUrl)
    }

    await dbHealthcheck()

    return Response.json({ ok: true, message: "Database connection successful" })
  } catch (error) {
    return errorResponse(error, "Database connection failed")
  }
}
