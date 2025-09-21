"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, CreditCard, ArrowLeft, Download, Share } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CheckoutPageProps {
  params: {
    bookingId: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const mockBookingDetails = {
    bookingId: params.bookingId,
    totalAmount: 27000,
    currency: "INR",
    items: [
      { name: "Heritage Hotel Udaipur", type: "hotel", amount: 8000 },
      { name: "City Palace Complex Tour", type: "activity", amount: 1200 },
      { name: "Lake Pichola Boat Ride", type: "activity", amount: 800 },
    ],
    serviceFee: 1350,
    finalAmount: 28350,
  }

  if (isProcessing) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Your Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your booking...</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {bookingConfirmed ? (
          <div className="space-y-6">
            {/* Success Header */}
            <Card className="text-center bg-accent/10 border-accent/20">
              <CardContent className="py-8">
                <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
                <p className="text-muted-foreground">
                  Your trip has been successfully booked. Check your email for confirmation details.
                </p>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Booking Details
                </CardTitle>
                <CardDescription>Booking ID: {mockBookingDetails.bookingId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {mockBookingDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                      </div>
                      <Badge variant="outline">
                        {mockBookingDetails.currency} {item.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {mockBookingDetails.currency} {mockBookingDetails.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>
                      {mockBookingDetails.currency} {mockBookingDetails.serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>
                      {mockBookingDetails.currency} {mockBookingDetails.finalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium">Confirmation Email Sent</p>
                      <p className="text-sm text-muted-foreground">
                        Check your inbox for detailed booking information and vouchers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium">Travel Documents</p>
                      <p className="text-sm text-muted-foreground">
                        Download your itinerary and booking vouchers from your dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium">24/7 Support</p>
                      <p className="text-sm text-muted-foreground">
                        Our travel support team is available anytime during your trip.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share className="mr-2 h-4 w-4" />
                    Share Trip
                  </Button>
                </div>

                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  View My Bookings
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Something went wrong with your booking. Please try again.</p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
