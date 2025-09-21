"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Check, AlertCircle, Plane, Hotel, Camera } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingModalProps {
  itinerary: any
  isOpen: boolean
  onClose: () => void
}

interface BookingItem {
  id: string
  type: "flight" | "hotel" | "activity"
  name: string
  cost: number
  currency: string
  selected: boolean
  day?: number
}

export function BookingModal({ itinerary, isOpen, onClose }: BookingModalProps) {
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize booking items from itinerary
  useState(() => {
    const items: BookingItem[] = []

    itinerary.days.forEach((day: any, dayIndex: number) => {
      // Add accommodation
      items.push({
        id: `hotel_${dayIndex}`,
        type: "hotel",
        name: day.accommodation.name,
        cost: day.accommodation.cost.amount,
        currency: day.accommodation.cost.currency,
        selected: true,
        day: day.day,
      })

      // Add activities
      day.activities.forEach((activity: any, actIndex: number) => {
        if (activity.booking_info?.bookable) {
          items.push({
            id: `activity_${dayIndex}_${actIndex}`,
            type: "activity",
            name: activity.name,
            cost: activity.cost.amount,
            currency: activity.cost.currency,
            selected: true,
            day: day.day,
          })
        }
      })
    })

    setSelectedItems(items)
  })

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)))
  }

  const selectedTotal = selectedItems.filter((item) => item.selected).reduce((sum, item) => sum + item.cost, 0)

  const handleBooking = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get user from localStorage (in a real app, use proper auth context)
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null

      if (!user) {
        router.push("/auth/login")
        return
      }

      const bookingData = {
        itinerary_id: itinerary.id,
        user_id: user.uid,
        items: selectedItems
          .filter((item) => item.selected)
          .map((item) => ({
            type: item.type,
            item_id: item.id,
            quantity: 1,
            price: item.cost,
          })),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Booking failed")
      }

      // Redirect to checkout
      window.location.href = result.checkout_url
    } catch (error) {
      setError(error instanceof Error ? error.message : "Booking failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return Hotel
      case "activity":
        return Camera
      case "flight":
        return Plane
      default:
        return Check
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Book Your Trip
          </DialogTitle>
          <DialogDescription>Select the items you'd like to book for your {itinerary.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Booking Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Items to Book</CardTitle>
              <CardDescription>Choose which components of your itinerary you'd like to book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItems.map((item) => {
                const IconComponent = getItemIcon(item.type)
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox id={item.id} checked={item.selected} onCheckedChange={() => handleItemToggle(item.id)} />
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Day {item.day} • {item.type}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {item.currency} {item.cost.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Selected Items</span>
                  <span>{selectedItems.filter((item) => item.selected).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {itinerary.total_cost.currency} {selectedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>
                    {itinerary.total_cost.currency} {Math.round(selectedTotal * 0.05).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {itinerary.total_cost.currency} {Math.round(selectedTotal * 1.05).toLocaleString()}
                  </span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You'll be redirected to our secure payment partner to complete your booking. All bookings are
                  protected by our travel guarantee.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={isLoading || selectedItems.filter((item) => item.selected).length === 0}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
