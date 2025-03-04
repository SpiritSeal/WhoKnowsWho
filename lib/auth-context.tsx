"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  username: string
  avatar: string
  discriminator: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check for user in localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("discord_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser) as User
          setUser(userData)

          // Ensure user exists in Firestore
          await setDoc(doc(db, "users", userData.id), userData, { merge: true })
        }
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("discord_user")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth message from popup
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === "DISCORD_AUTH_SUCCESS" && event.data?.user) {
        try {
          const userData = event.data.user as User
          localStorage.setItem("discord_user", JSON.stringify(userData))
          setUser(userData)

          // Save user to Firestore
          await setDoc(doc(db, "users", userData.id), userData)

          toast({
            title: "Logged in successfully",
            description: `Welcome, ${userData.username}!`,
          })
        } catch (error) {
          console.error("Auth error:", error)
          toast({
            title: "Login failed",
            description: "There was a problem logging in with Discord.",
            variant: "destructive",
          })
        }
      }
    }

    window.addEventListener("message", handleAuthMessage)
    return () => window.removeEventListener("message", handleAuthMessage)
  }, [toast])

  const login = () => {
    const width = 600
    const height = 800
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open("/api/auth/login", "discord-login", `width=${width},height=${height},left=${left},top=${top}`)
  }

  const logout = () => {
    localStorage.removeItem("discord_user")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

