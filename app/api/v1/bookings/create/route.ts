import { type NextRequest, NextResponse } from "next/server"
import { createBooking } from "@/lib/emt-adapter"
import { saveBooking } from "@/lib/firestore"
import { validateBookingRequest } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate booking request
    const validationResult = validateBookingRequest(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid booking data", details: validationResult.errors }, { status: 400 })
    }

    const bookingRequest = validationResult.data

    // Create booking through EMT adapter
    const bookingResult = await createBooking(bookingRequest)

    if (!bookingResult.success) {
      return NextResponse.json({ error: "Failed to create booking", details: bookingResult.error }, { status: 500 })
    }

    // Save booking to database
    const savedBooking = await saveBooking({
      ...bookingResult.data,
      user_id: bookingRequest.user_id,
      itinerary_id: bookingRequest.itinerary_id,
    })

    return NextResponse.json({
      booking_id: savedBooking.id,
      checkout_url: bookingResult.data.checkout_url,
      status: "created",
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
