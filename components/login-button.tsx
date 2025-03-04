"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogIn, LogOut } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export function LoginButton() {
  const { user, login, logout, loading } = useAuth()

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <LogIn className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <UserAvatar user={user} />
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={login}>
      <LogIn className="mr-2 h-4 w-4" />
      Login with Discord
    </Button>
  )
}

