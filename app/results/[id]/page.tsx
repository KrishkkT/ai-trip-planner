import { ItineraryResults } from "@/components/itinerary-results"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <Link href="/plan">
            <Button variant="ghost" className="mb-6 hover:bg-accent/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Planning
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground bg-accent/10 px-3 py-1 rounded-full">
                AI Generated
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Your Personalized Itineraries
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose from three AI-generated options tailored to your preferences and budget. Each itinerary offers a
              unique perspective on your dream destination.
            </p>
          </div>
        </div>

        <ItineraryResults itineraryId={params.id} />
      </div>
    </main>
  )
}
