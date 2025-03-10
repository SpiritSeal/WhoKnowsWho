import { KnowledgeGrid } from "@/components/knowledge-grid"
import { LoginButton } from "@/components/login-button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Who Knows Who in CS Group?</h1>
        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <LoginButton />
        </div>
      </div>

      <KnowledgeGrid />

      <footer className="mt-8 text-center text-sm">
        <p>
          Proompted by{" "}
          <a
            href="https://github.com/SpiritSeal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Saketh Reddy
          </a> -- <a
            href="https://github.com/SpiritSeal/WhoKnowsWho"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Source Code
          </a>
        </p>
      </footer>
    </main>
  )
}

