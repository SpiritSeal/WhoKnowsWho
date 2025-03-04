"use server"

import { getServerSession } from "next-auth/next"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export async function addUserById(userId: string) {
//   const session = await getServerSession()
//   if (!session?.user?.email) {
//     throw new Error("Not authenticated")
//   }

  // Check if the user is an admin (you'd implement this check based on your auth system)
//   const isAdmin = session.user.email === "yssaketh@gmail.com" // Replace with actual email
    const isAdmin = true

  if (!isAdmin) {
    throw new Error("Not authorized")
  }

  try {
    // Fetch user data from Discord API
    const response = await fetch(`https://discord.com/api/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user from Discord")
    }

    const userData = await response.json()

    // Add user to Firestore
    await setDoc(doc(db, "users", userId), {
      id: userId,
      username: userData.username,
      avatar: `${userId}/${userData.avatar}`,
      discriminator: userData.discriminator,
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding user:", error)
    throw error
  }
}

