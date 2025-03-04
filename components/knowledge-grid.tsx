"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"

type User = {
  id: string
  username: string
  avatar: string
  discriminator: string
}

type Connection = {
  userId: string
  knownUserIds: string[]
}

export function KnowledgeGrid() {
  const [users, setUsers] = useState<User[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const usersQuery = query(collection(db, "users"))
    const connectionsQuery = query(collection(db, "connections"))

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData: User[] = []
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User)
      })
      setUsers(usersData)
      setLoading(false)
    })

    const unsubscribeConnections = onSnapshot(connectionsQuery, (snapshot) => {
      const connectionsData: Connection[] = []
      snapshot.forEach((doc) => {
        connectionsData.push({
          userId: doc.id,
          knownUserIds: doc.data().knownUserIds || [],
        })
      })
      setConnections(connectionsData)
    })

    return () => {
      unsubscribeUsers()
      unsubscribeConnections()
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4">No users have logged in yet.</p>
          {!user && (
            <p>
              <Link href="/api/auth/login">
                <Button>Login with Discord</Button>
              </Link>{" "}
              to be the first!
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Sort users alphabetically by username
  const sortedUsers = [...users].sort((a, b) => a.username.localeCompare(b.username))

  return (
    <div className="pb-10">
      {user && (
        <div className="flex justify-end mb-4">
          <Link href="/select">
            <Button>Update Who I Know</Button>
          </Link>
        </div>
      )}

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-left font-medium sticky left-0 bg-muted/50 min-w-40 z-20">
                    User
                  </th>
                  {sortedUsers.map((columnUser) => (
                    <th key={columnUser.id} className="p-3 text-center font-medium min-w-16 whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        <UserAvatar user={columnUser} size="sm" />
                        <span className="text-xs truncate max-w-16">{columnUser.username}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((rowUser) => {
                  const userConnection = connections.find((c) => c.userId === rowUser.id)
                  const knownUserIds = userConnection?.knownUserIds || []

                  return (
                    <tr key={rowUser.id} className="border-t hover:bg-muted/30">
                      <td className="p-3 font-medium sticky left-0 bg-background border-r z-20">
                        <div className="flex items-center gap-2">
                          <UserAvatar user={rowUser} />
                          <span className="whitespace-nowrap">{rowUser.username}</span>
                        </div>
                      </td>
                      {sortedUsers.map((columnUser) => {
                        const isKnown = knownUserIds.includes(columnUser.id)
                        const isSelf = rowUser.id === columnUser.id

                        return (
                          <td key={columnUser.id} className={`p-3 text-center ${isSelf ? "bg-muted/20" : ""}`}>
                            {isSelf ? (
                              <div className="w-6 h-6 mx-auto bg-muted rounded-full"></div>
                            ) : isKnown ? (
                              <div className="w-6 h-6 mx-auto bg-green-500 rounded-full"></div>
                            ) : (
                              <div className="w-6 h-6 mx-auto bg-muted/30 rounded-full"></div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}