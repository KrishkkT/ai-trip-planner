"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, DollarSign, Star, Eye, ExternalLink, MapPin, Users } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

interface ItineraryResultsProps {
  itineraryId: string
}

interface Itinerary {
  id: string
  title: string
  description: string
  totalCost: number
  days: any[]
}

interface ItineraryResponse {
  itineraries: Itinerary[]
  tripRequest: any
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const typeConfig = {
  0: {
    title: "Budget Explorer",
    description: "Maximum value with smart savings and local experiences",
    color: "bg-emerald-500",
    icon: "💰",
    gradient: "from-emerald-500/10 to-emerald-600/5",
  },
  1: {
    title: "Balanced Traveler",
    description: "Perfect mix of must-see attractions and authentic experiences",
    color: "bg-blue-500",
    icon: "⚖️",
    gradient: "from-blue-500/10 to-blue-600/5",
  },
  2: {
    title: "Premium Experience",
    description: "Luxury accommodations and exclusive access to unique experiences",
    color: "bg-purple-500",
    icon: "✨",
    gradient: "from-purple-500/10 to-purple-600/5",
  },
}

export function ItineraryResults({ itineraryId }: ItineraryResultsProps) {
  const { data, error, isLoading } = useSWR<ItineraryResponse>(
    `/api/v1/itineraries/generate?id=${itineraryId}`,
    fetcher,
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-4xl">😔</div>
          <h3 className="text-lg font-semibold">Oops! Something went wrong</h3>
          <p className="text-muted-foreground">Failed to load your itineraries. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-12">
      {/* Trip Summary */}
      <Card className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-accent/20">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {data.tripRequest.origin} → {data.tripRequest.destination}
                </h3>
                <p className="text-muted-foreground">
                  {new Date(data.tripRequest.startDate).toLocaleDateString()} -{" "}
                  {new Date(data.tripRequest.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{data.tripRequest.numTravelers} travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {data.tripRequest.budget} {data.tripRequest.currency}
                </span>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                <Star className="h-3 w-3 mr-1" />
                95% Match
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data.itineraries.map((itinerary, index) => {
          const config = typeConfig[index as keyof typeof typeConfig]

          return (
            <Card
              key={itinerary.id}
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur-sm"
            >
              <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-primary/20">
                      <span className="text-xl">{config.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {config.title}
                      </CardTitle>
                      <CardDescription className="text-sm">{config.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${config.color} text-white shadow-lg`}>
                    {index === 0 ? "Budget" : index === 1 ? "Balanced" : "Premium"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-balance mb-2">{itinerary.title}</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{itinerary.description}</p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                      <DollarSign className="h-4 w-4" />
                      {itinerary.totalCost?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                      <Clock className="h-4 w-4" />
                      {itinerary.days?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Link href={`/itinerary/${itinerary.id || index}`} className="block">
                    <Button className="w-full group-hover:shadow-lg transition-all duration-300" size="lg">
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Itinerary
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-2 hover:bg-accent/5 bg-transparent"
                    size="lg"
                    onClick={() => {
                      const searchQuery = `${data.tripRequest.origin} to ${data.tripRequest.destination}`
                      window.open(
                        `https://www.easemytrip.com/flights.html?from=${encodeURIComponent(data.tripRequest.origin)}&to=${encodeURIComponent(data.tripRequest.destination)}`,
                        "_blank",
                      )
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Book on EaseMyTrip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardContent className="py-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to Book Your Adventure?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These itineraries are just the beginning. Visit EaseMyTrip to book flights, hotels, and activities to bring
            your perfect trip to life.
          </p>
          <Button size="lg" className="mt-4" onClick={() => window.open("https://www.easemytrip.com/", "_blank")}>
            <ExternalLink className="mr-2 h-5 w-5" />
            Visit EaseMyTrip
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
