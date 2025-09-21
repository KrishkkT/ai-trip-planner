import { TripPlanForm } from "@/components/trip-plan-form"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 hover:bg-accent/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground bg-accent/10 px-3 py-1 rounded-full">
                AI-Powered Planning
              </span>
            </div>
          </div>
        </div>

        <TripPlanForm />
      </div>
    </main>
  )
}
