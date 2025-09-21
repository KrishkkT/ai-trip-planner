"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, CreditCard, User, Settings, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user from localStorage (in a real app, use proper auth context)
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userStr))
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" })
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const mockBookings = [
    {
      id: "booking_1",
      destination: "Udaipur, India",
      dates: "Oct 5-8, 2025",
      status: "confirmed",
      amount: 28350,
      currency: "INR",
      itinerary: "Balanced Udaipur Heritage Experience",
    },
  ]

  const mockItineraries = [
    {
      id: "itinerary_1",
      title: "Balanced Udaipur Heritage Experience",
      destination: "Udaipur, India",
      dates: "Oct 5-8, 2025",
      status: "booked",
      type: "balanced",
    },
  ]

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.displayName || user.email}</h1>
            <p className="text-muted-foreground">Manage your trips and bookings</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/plan">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Plan New Trip
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="itineraries">My Itineraries</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid gap-6">
              {mockBookings.length > 0 ? (
                mockBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {booking.destination}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {booking.dates}
                            </span>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {booking.currency} {booking.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{booking.itinerary}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Voucher
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">Start planning your first trip with AI assistance</p>
                    <Link href="/plan">
                      <Button>Plan Your First Trip</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-6">
            <div className="grid gap-6">
              {mockItineraries.length > 0 ? (
                mockItineraries.map((itinerary) => (
                  <Card key={itinerary.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{itinerary.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {itinerary.destination}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {itinerary.dates}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={itinerary.status === "booked" ? "default" : "secondary"}>
                          {itinerary.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Link href={`/itinerary/${itinerary.id}`}>
                          <Button variant="outline" size="sm">
                            View Itinerary
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No itineraries yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first AI-powered travel itinerary</p>
                    <Link href="/plan">
                      <Button>Create Itinerary</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-muted-foreground">{user.displayName || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
