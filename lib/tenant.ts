import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getTenant() {
  const session = (await getServerSession(authOptions)) as
    | { user?: { orgId?: string } }
    | null

  const orgId = session?.user?.orgId
  if (!orgId) {
    throw new Error("Unauthorized")
  }

  return orgId
}
