import { PrismaClient } from "@prisma/client"
import { getDatabaseUrl, validateDatabaseUrl } from "@/lib/env"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Set DATABASE_URL (preferred) or DATABASEURL/databaseurl in your hosting environment.",
    )
  }

  validateDatabaseUrl(databaseUrl)

  return new PrismaClient()
}

export async function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }

  return globalForPrisma.prisma
}
