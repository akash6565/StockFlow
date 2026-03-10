import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getTenant(){

 const session: any = await getServerSession(authOptions)

 if (!session) {
  throw new Error("Unauthorized")
 }

 return session.user.orgId
}