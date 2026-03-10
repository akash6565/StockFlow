import { neon } from "@neondatabase/serverless"
import { and, asc, desc, eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-http"
import { integer, pgTable, real, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"
import { getDatabaseUrl, validateDatabaseUrl } from "@/lib/env"

export const organizations = pgTable("Organization", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow().notNull(),
})

export const users = pgTable("User", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  orgId: uuid("orgId").notNull(),
})

export const products = pgTable(
  "Product",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("orgId").notNull(),
    name: text("name").notNull(),
    sku: text("sku").notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull(),
    costPrice: real("costPrice"),
    sellPrice: real("sellPrice"),
    lowStock: integer("lowStock"),
    createdAt: timestamp("createdAt", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.orgId, table.sku)],
)

export const settings = pgTable("Setting", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("orgId").notNull().unique(),
  defaultLowStock: integer("defaultLowStock").notNull().default(5),
})

let cachedDb: ReturnType<typeof drizzle> | undefined

export function getDb() {
  if (cachedDb) return cachedDb

  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing. Set DATABASE_URL (preferred) or DATABASEURL/databaseurl.")
  }

  validateDatabaseUrl(databaseUrl)
  const client = neon(databaseUrl)
  cachedDb = drizzle(client)
  return cachedDb
}

export async function dbHealthcheck() {
  const db = getDb()
  await db.execute(sql`SELECT 1`)
}

export { and, asc, desc, eq, sql }
