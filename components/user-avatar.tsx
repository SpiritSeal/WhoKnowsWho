import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  username: string
  avatar: string
  discriminator?: string
}

interface UserAvatarProps {
  user: User
  size?: "default" | "sm" | "lg"
}

export function UserAvatar({ user, size = "default" }: UserAvatarProps) {
  const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.avatar}` : undefined

  const sizeClass = {
    default: "h-8 w-8",
    sm: "h-6 w-6",
    lg: "h-10 w-10",
  }[size]

  const fallbackSize = {
    default: "text-sm",
    sm: "text-xs",
    lg: "text-base",
  }[size]

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={avatarUrl} alt={user.username} />
      <AvatarFallback className={fallbackSize}>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

