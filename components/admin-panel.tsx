"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { addUserById } from "@/lib/actions"

export function AdminPanel() {
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addUserById(userId)
      toast({
        title: "User added successfully",
        description: `User with ID ${userId} has been added.`,
      })
      setUserId("")
    } catch (error) {
      toast({
        title: "Error adding user",
        description: "There was a problem adding the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="userId">Discord User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Discord User ID"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </Button>
      </form>
    </div>
  )
}

