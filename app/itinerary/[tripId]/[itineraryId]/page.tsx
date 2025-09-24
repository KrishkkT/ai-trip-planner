import { ItineraryDetail } from "@/components/itinerary-detail"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ItineraryPageProps {
  params: Promise<{
    tripId: string
    itineraryId: string
  }>
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { tripId, itineraryId } = await params
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <Link href={`/results/${tripId}`}>
            <Button variant="ghost" className="mb-6 hover:bg-accent/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground bg-accent/10 px-3 py-1 rounded-full">
                Detailed Itinerary
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Your Perfect Trip Awaits</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Review your personalized day-by-day itinerary and book your dream vacation.
            </p>
          </div>
        </div>

        <ItineraryDetail tripId={tripId} itineraryId={itineraryId} />
      </div>
    </main>
  )
}