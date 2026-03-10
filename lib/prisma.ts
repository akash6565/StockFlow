import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function resolveDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.DATABASEURL ?? process.env.databaseurl

  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl
  }

  return databaseUrl
}

function createPrismaClient() {
  if (!resolveDatabaseUrl()) {
    throw new Error(
      "DATABASE_URL is missing. Configure DATABASE_URL (or DATABASEURL/databaseurl) with your Neon/Postgres connection string.",
    )
  }

  return new PrismaClient()
}

export async function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }

  return globalForPrisma.prisma
}
