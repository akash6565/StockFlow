const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"])

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim()
}

export function getDatabaseUrl() {
  const databaseUrl = firstDefined(process.env.DATABASE_URL, process.env.DATABASEURL, process.env.databaseurl)

  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl
  }

  return databaseUrl
}

export function validateDatabaseUrl(databaseUrl: string) {
  let parsed: URL

  try {
    parsed = new URL(databaseUrl)
  } catch {
    throw new Error("DATABASE_URL is not a valid URL.")
  }

  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("DATABASE_URL must start with postgres:// or postgresql://")
  }

  const authority = databaseUrl.split("?")[0]
  const atCount = authority.split("@").length - 1
  if (atCount > 1) {
    throw new Error(
      "DATABASE_URL appears malformed (multiple '@' characters in credentials). If your password contains special characters, URL-encode it.",
    )
  }
}

export function getNextAuthUrl() {
  const explicit = firstDefined(process.env.NEXTAUTH_URL)
  const vercelUrl = firstDefined(process.env.VERCEL_URL)

  if (explicit) {
    process.env.NEXTAUTH_URL = explicit
    return explicit
  }

  if (vercelUrl) {
    const inferred = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`
    process.env.NEXTAUTH_URL = inferred
    return inferred
  }

  return undefined
}

export function validateNextAuthUrl(nextAuthUrl: string) {
  let parsed: URL

  try {
    parsed = new URL(nextAuthUrl)
  } catch {
    throw new Error("NEXTAUTH_URL is not a valid URL.")
  }

  if (process.env.NODE_ENV === "production" && LOCAL_HOSTS.has(parsed.hostname)) {
    throw new Error("NEXTAUTH_URL cannot point to localhost in production. Use your deployed HTTPS domain.")
  }
}
