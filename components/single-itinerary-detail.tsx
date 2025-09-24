"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, DollarSign, Calendar, Star, ExternalLink, Plane, Camera, Users, Utensils } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

interface SingleItineraryDetailProps {
  tripId: string
  itineraryId: string
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

interface Activity {
  activity?: string
  name?: string
  location: string
  time: string
  description: string
  cost?: number
  type?: string
}

interface Day {
  day: number
  date?: string
  activities?: Activity[]
}

interface Itinerary {
  id: string
  type: string
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

interface ItineraryResponse {
  itineraries: Itinerary[]
  tripRequest: TripRequest
  createdAt: string
  metadata?: {
    generated_at?: string
    request_id?: string
    model_version?: string
    confidence_score?: number
  }
}

interface FetchError extends Error {
  status?: number
  info?: unknown
}

const fetcher = async (url: string): Promise<ItineraryResponse> => {
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

const activityIcons = {
  sightseeing: Camera,
  heritage: Star,
  cultural: Star,
  food: Utensils,
  relaxation: Clock,
  adventure: MapPin,
  shopping: DollarSign,
  transport: Plane,
}

export function SingleItineraryDetail({ tripId, itineraryId }: SingleItineraryDetailProps) {
  const { data, error, isLoading } = useSWR<ItineraryResponse>(
    tripId ? `/api/v1/itineraries/generate?id=${tripId}` : null,
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
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
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
              ? "Trip Not Found" 
              : isServerError 
              ? "Server Error" 
              : "Something went wrong"}
          </h3>
          <p className="text-muted-foreground">
            {isNotFound 
              ? "The trip you're looking for doesn't exist or has expired." 
              : "Failed to load trip details. Please try again."}
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

  // Find the specific itinerary to display
  const targetItinerary = data.itineraries?.find(it => it.id === itineraryId) || 
                          data.itineraries?.find((it, idx) => idx.toString() === itineraryId) ||
                          data.itineraries?.[0]
  
  if (!targetItinerary) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-semibold">Itinerary Not Found</h3>
          <p className="text-muted-foreground">The specific itinerary variant you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </CardContent>
      </Card>
    )
  }

  const itineraryIndex = data.itineraries?.findIndex(it => it.id === targetItinerary.id) ?? 0

  const handleBookItinerary = () => {
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
  }

  return (
    <div className="space-y-8">
      {/* Navigation tabs for other variants */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-secondary/30 rounded-lg">
          {data.itineraries?.map((itinerary: Itinerary, index: number) => {
            const isActive = itinerary.id === targetItinerary.id || index === itineraryIndex
            return (
              <Link 
                key={itinerary.id || index} 
                href={`/itinerary/${tripId}/${itinerary.id || index}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-secondary/50'
                }`}
              >
                <span className="text-xl">{index === 0 ? "💰" : index === 1 ? "⚖️" : "✨"}</span>
                <span className="text-sm font-medium">
                  {index === 0 ? "Budget" : index === 1 ? "Balanced" : "Premium"}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Itinerary Header */}
      <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 flex-1">
              <CardTitle className="text-3xl text-balance leading-tight">{targetItinerary.title || 'Untitled Itinerary'}</CardTitle>
              <CardDescription className="text-base text-pretty leading-relaxed">
                {targetItinerary.description || 'No description available'}
              </CardDescription>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <Badge variant="outline" className="text-xl px-6 py-3 font-bold bg-primary/10 border-primary/20">
                ${(targetItinerary.totalCost || targetItinerary.total_cost?.amount || 0).toLocaleString()}
              </Badge>
              <div className="text-sm text-muted-foreground">Total estimated cost</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">{targetItinerary.days?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">
                  ${Math.round((targetItinerary.totalCost || targetItinerary.total_cost?.amount || 0) / (targetItinerary.days?.length || 1))}
                </div>
                <div className="text-sm text-muted-foreground">Per day</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">{data.tripRequest?.numTravelers || data.tripRequest?.num_travelers || 1}</div>
                <div className="text-sm text-muted-foreground">Travelers</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">AI</div>
                <div className="text-sm text-muted-foreground">Curated</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleBookItinerary}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Book on EaseMyTrip
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 text-lg font-semibold border-2 bg-transparent"
              onClick={() => window.print()}
            >
              <Camera className="mr-2 h-5 w-5" />
              Save Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Day-by-Day Breakdown */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Day-by-Day Itinerary</h2>
          <p className="text-muted-foreground">Your personalized travel schedule</p>
        </div>

        {targetItinerary.days?.map((day: Day, dayIndex: number) => (
          <Card key={`day-${day.day || dayIndex}`} className="overflow-hidden border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                  <span className="font-bold text-primary">{day.day || dayIndex + 1}</span>
                </div>
                <div>
                  <div className="text-xl">Day {day.day || dayIndex + 1}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {day.date
                      ? new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })
                      : `Day ${dayIndex + 1} Activities`}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Activities */}
              {day.activities && day.activities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5 text-primary" />
                    Activities & Experiences
                  </h4>
                  <div className="space-y-4">
                    {day.activities.map((activity: Activity, actIndex: number) => {
                      const IconComponent = activityIcons[activity.type as keyof typeof activityIcons] || MapPin
                      return (
                        <div
                          key={`activity-${actIndex}-${activity.activity || activity.name}`}
                          className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border border-border/50"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h5 className="font-semibold text-lg">{activity.activity || activity.name || 'Activity'}</h5>
                                <p className="text-muted-foreground">
                                  {activity.location || 'Location TBD'} • {activity.time || 'Time TBD'}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {activity.description || 'No description available'}
                                </p>
                              </div>
                              {activity.cost && (
                                <Badge variant="outline" className="shrink-0">
                                  ${activity.cost}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )) || (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-lg font-semibold mb-2">Detailed Schedule Coming Soon</h3>
              <p className="text-muted-foreground">
                This itinerary includes amazing activities and experiences. Visit EaseMyTrip to explore and book
                specific activities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardContent className="py-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to Make This Trip Reality?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This AI-generated itinerary is your starting point. Visit EaseMyTrip to book flights, hotels, and
            activities to bring your perfect trip to life.
          </p>
          <Button
            size="lg"
            className="mt-4 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleBookItinerary}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Start Booking on EaseMyTrip
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}