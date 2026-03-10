import { ZodError } from "zod"

function isDbError(error: unknown): error is { code?: string; message?: string; detail?: string } {
  return typeof error === "object" && error !== null && ("code" in error || "message" in error)
}

export function errorResponse(error: unknown, fallbackMessage: string, fallbackStatus = 500) {
  if (error instanceof ZodError) {
    return Response.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
  }

  if (isDbError(error)) {
    if (error.code === "23505") {
      return Response.json({ error: "Conflict: record already exists", details: error.detail ?? error.message }, { status: 409 })
    }

    if (error.code === "22P02") {
      return Response.json({ error: "Invalid request data", details: error.message }, { status: 400 })
    }

    if (error.code === "42P01") {
      return Response.json({ error: "Database table is missing", details: error.message }, { status: 500 })
    }

    return Response.json({ error: fallbackMessage, details: error.message ?? "Database error" }, { status: fallbackStatus })
  }

  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    return Response.json({ error: fallbackMessage, details: error.message }, { status: fallbackStatus })
  }

  return Response.json({ error: fallbackMessage }, { status: fallbackStatus })
}
