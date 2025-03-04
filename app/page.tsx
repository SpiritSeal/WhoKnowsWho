import { KnowledgeGrid } from "@/components/knowledge-grid"
import { LoginButton } from "@/components/login-button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Who Knows Who?</h1>
        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <LoginButton />
        </div>
      </div>

      <KnowledgeGrid />
    </main>
  )
}

