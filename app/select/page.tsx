import { UserSelectionGrid } from "@/components/user-selection-grid"
import { LoginButton } from "@/components/login-button"
import { ModeToggle } from "@/components/mode-toggle"
import { BackButton } from "@/components/back-button"

export default function SelectPage() {
  return (
    <main className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-3xl font-bold">Select People You Know</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <LoginButton />
        </div>
      </div>

      <UserSelectionGrid />
    </main>
  )
}

