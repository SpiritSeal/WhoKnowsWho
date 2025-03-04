"use client"

import { useEffect, useState } from "react"
import { collection, doc, getDoc, onSnapshot, query, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { UserAvatar } from "@/components/user-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

type User = {
  id: string
  username: string
  avatar: string
  discriminator: string
}

export function UserSelectionGrid() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    const usersQuery = query(collection(db, "users"))

    // Load existing connections
    const loadConnections = async () => {
      try {
        const connectionDoc = await getDoc(doc(db, "connections", user.id))
        if (connectionDoc.exists()) {
          setSelectedUsers(connectionDoc.data().knownUserIds || [])
        }
      } catch (error) {
        console.error("Error loading connections:", error)
      }
    }

    loadConnections()

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData: User[] = []
      snapshot.forEach((doc) => {
        // Don't include the current user in the selection list
        if (doc.id !== user.id) {
          usersData.push({ id: doc.id, ...doc.data() } as User)
        }
      })
      setUsers(usersData)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [user, router])

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const saveSelections = async () => {
    if (!user) return

    setSaving(true)
    try {
      await setDoc(doc(db, "connections", user.id), {
        knownUserIds: selectedUsers,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Saved successfully",
        description: "Your connections have been updated.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error saving connections:", error)
      toast({
        title: "Error saving",
        description: "There was a problem saving your connections.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

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
          <p>No other users have logged in yet.</p>
        </CardContent>
      </Card>
    )
  }

  // Sort users alphabetically by username
  const sortedUsers = [...users].sort((a, b) => a.username.localeCompare(b.username))

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">Select the people you know from the Discord server</p>
        <Button onClick={saveSelections} disabled={saving}>
          {saving ? "Saving..." : "Save Selections"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleUser(user.id)} />
                <div className="flex items-center gap-2 flex-1">
                  <UserAvatar user={user} />
                  <span className="font-medium">{user.username}</span>
                </div>
              </label>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

