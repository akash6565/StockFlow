const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"])

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim()
}

function normalizeVercelUrl(vercelUrl: string) {
  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`
}

function isLocalhostUrl(value: string) {
  try {
    return LOCAL_HOSTS.has(new URL(value).hostname)
  } catch {
    return false
  }
}


function normalizeDatabaseUrl(databaseUrl: string) {
  try {
    const parsed = new URL(databaseUrl)

    if (parsed.hostname.includes("neon.tech") && !parsed.searchParams.get("sslmode")) {
      parsed.searchParams.set("sslmode", "require")
      return parsed.toString()
    }
  } catch {
    return databaseUrl
  }

  return databaseUrl
}

function sanitizeDatabaseUrl(rawValue: string) {
  let sanitized = rawValue.trim()

  // Handle common copy/paste mistakes from dashboards where a whole .env block
  // (including literal "\\n" separators and comments) is saved into one variable.
  if (sanitized.includes("\\n")) {
    sanitized = sanitized.split("\\n")[0]?.trim() ?? sanitized
  }

  if (sanitized.includes("\n")) {
    sanitized = sanitized.split("\n")[0]?.trim() ?? sanitized
  }

  if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
    sanitized = sanitized.slice(1, -1).trim()
  }

  return sanitized
}

export function getDatabaseUrl() {
  const rawDatabaseUrl = firstDefined(process.env.DATABASE_URL, process.env.DATABASEURL, process.env.databaseurl)

  if (!rawDatabaseUrl) return undefined

  const databaseUrl = normalizeDatabaseUrl(sanitizeDatabaseUrl(rawDatabaseUrl))
  process.env.DATABASE_URL = databaseUrl

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
    if (process.env.NODE_ENV === "production" && isLocalhostUrl(explicit) && vercelUrl) {
      const inferred = normalizeVercelUrl(vercelUrl)
      process.env.NEXTAUTH_URL = inferred
      return inferred
    }

    process.env.NEXTAUTH_URL = explicit
    return explicit
  }

  if (vercelUrl) {
    const inferred = normalizeVercelUrl(vercelUrl)
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
    console.warn("NEXTAUTH_URL points to localhost in production; authentication callbacks may fail.")
  }
}
