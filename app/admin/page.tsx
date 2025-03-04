import { AdminPanel } from "@/components/admin-panel"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

export default async function AdminPage() {
  const session = await getServerSession()
  console.log('session')
  console.log(session)

  return <AdminPanel />
}

