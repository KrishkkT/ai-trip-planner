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

interface Day {
  day: number
  date?: string
  activities?: Activity[]
}

interface Activity {
  activity?: string
  name?: string
  location: string
  time: string
  description: string
  cost?: number
  type?: string
}

interface Itinerary {
  id: string
  title: string
  description: string
  totalCost?: number
  total_cost?: {
    amount: number
    currency: string
  }
  days?: Day[]
  highlights?: string[]
  best_for?: string[]
}

interface TripRequest {
  origin: string
  destination: string
  start_date: string
  end_date: string
  budget_total: number
  currency: string
  preferred_themes: string[]
  num_travelers: number
  numTravelers?: number
  additional_info?: string
}

interface TripResponse {
  id: string
  tripRequest: TripRequest
  createdAt: string
  status: string
}

interface FetchError extends Error {
  status?: number
  info?: unknown
}

const fetcher = async (url: string): Promise<TripResponse> => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error: FetchError = new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    error.status = response.status
    try {
      error.info = await response.json()
    } catch {
      error.info = await response.text()
    }
    throw error
  }
  
  const data = await response.json()
  return data
}

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
  const { data, error, isLoading } = useSWR<TripResponse>(
    itineraryId ? `/api/v1/trips/${itineraryId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: (error: FetchError) => {
        // Don't retry on 4xx errors
        return !error.status || error.status >= 500
      },
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
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
    const isNotFound = (error as FetchError)?.status === 404
    const errorStatus = (error as FetchError)?.status
    const isServerError = errorStatus && errorStatus >= 500
    
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-4xl">{isNotFound ? "🔍" : "😔"}</div>
          <h3 className="text-lg font-semibold">
            {isNotFound 
              ? "Itinerary Not Found" 
              : isServerError 
              ? "Server Error" 
              : "Something went wrong"}
          </h3>
          <p className="text-muted-foreground">
            {isNotFound 
              ? "The itinerary you're looking for doesn't exist or has expired." 
              : "Failed to load your itineraries. Please try again."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            {isNotFound && (
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            )}
          </div>
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
                  {data?.tripRequest?.origin || 'Unknown'} → {data?.tripRequest?.destination || 'Unknown'}
                </h3>
                <p className="text-muted-foreground">
                  {data?.tripRequest?.start_date ? new Date(data.tripRequest.start_date).toLocaleDateString() : 'N/A'} -{" "}
                  {data?.tripRequest?.end_date ? new Date(data.tripRequest.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{data?.tripRequest?.num_travelers || 1} travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {data?.tripRequest?.budget_total || 'N/A'} {data?.tripRequest?.currency || 'USD'}
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

      {/* Itinerary Option Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(typeConfig).map(([index, config]) => {
          const indexNum = parseInt(index)
          const itineraryType = indexNum === 0 ? 'budget' : indexNum === 1 ? 'balanced' : 'premium'
          
          // Calculate estimated costs based on budget
          const budgetMultiplier = indexNum === 0 ? 0.7 : indexNum === 1 ? 0.9 : 1.2
          const estimatedCost = Math.floor((data?.tripRequest?.budget_total || 0) * budgetMultiplier)
          
          // Calculate duration
          const startDate = data?.tripRequest?.start_date ? new Date(data.tripRequest.start_date) : new Date()
          const endDate = data?.tripRequest?.end_date ? new Date(data.tripRequest.end_date) : new Date()
          const duration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

          return (
            <Card
              key={`option-${itineraryType}`}
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
                    {indexNum === 0 ? "Budget" : indexNum === 1 ? "Balanced" : "Premium"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-balance mb-2">
                    {`${config.title} ${data?.tripRequest?.destination || 'Experience'}`}
                  </h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {indexNum === 0 && "Maximum value with smart savings and authentic local experiences. Perfect for budget-conscious travelers who want to explore without compromise."}
                    {indexNum === 1 && "The perfect balance of must-see attractions and hidden gems. Ideal for first-time visitors who want comprehensive coverage."}
                    {indexNum === 2 && "Luxury accommodations, exclusive access, and premium experiences. For those who want the finest travel has to offer."}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                      <DollarSign className="h-4 w-4" />
                      {estimatedCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Estimated Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                      <Clock className="h-4 w-4" />
                      {duration}
                    </div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {indexNum === 0 && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Budget-friendly accommodations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Public transport & walking tours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Local street food experiences</span>
                      </div>
                    </div>
                  )}
                  {indexNum === 1 && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Mid-range hotels & experiences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Mix of iconic sights & hidden gems</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Combination of transport options</span>
                      </div>
                    </div>
                  )}
                  {indexNum === 2 && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Luxury hotels & premium experiences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Private tours & exclusive access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Fine dining & premium transport</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Link href={`/itinerary/${encodeURIComponent(itineraryId)}/${itineraryType}`} className="block">
                    <Button className="w-full group-hover:shadow-lg transition-all duration-300" size="lg">
                      <Eye className="mr-2 h-4 w-4" />
                      Generate & View Itinerary
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-2 hover:bg-accent/5 bg-transparent"
                    size="lg"
                    onClick={() => {
                      if (!data?.tripRequest?.origin || !data?.tripRequest?.destination) {
                        console.error('Missing origin or destination data')
                        return
                      }
                      
                      try {
                        const url = `https://www.easemytrip.com/flights.html?from=${encodeURIComponent(data.tripRequest.origin)}&to=${encodeURIComponent(data.tripRequest.destination)}`
                        window.open(url, "_blank", "noopener,noreferrer")
                      } catch (error) {
                        console.error('Failed to open booking link:', error)
                      }
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
          <Button 
            size="lg" 
            className="mt-4" 
            onClick={() => {
              try {
                window.open("https://www.easemytrip.com/", "_blank", "noopener,noreferrer")
              } catch (error) {
                console.error('Failed to open EaseMyTrip link:', error)
              }
            }}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Visit EaseMyTrip
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
