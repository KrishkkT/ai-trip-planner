interface BookingRequest {
  itinerary_id: string
  user_id: string
  items: BookingItem[]
}

interface BookingItem {
  type: "flight" | "hotel" | "activity"
  item_id: string
  quantity: number
  price: number
}

interface BookingResult {
  success: boolean
  data?: {
    booking_id: string
    checkout_url: string
    total_amount: number
    currency: string
  }
  error?: string
}

const EMT_API_URL = process.env.EMT_API_URL || "https://api.easemytrip.com/v1"
const EMT_API_KEY = process.env.EMT_API_KEY

export async function createBooking(bookingRequest: BookingRequest): Promise<BookingResult> {
  try {
    // In development, use mock mode
    if (process.env.NODE_ENV === "development" || !EMT_API_KEY) {
      return createMockBooking(bookingRequest)
    }

    // Real EMT API integration
    const response = await fetch(`${EMT_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMT_API_KEY}`,
        "X-API-Version": "1.0",
      },
      body: JSON.stringify({
        user_id: bookingRequest.user_id,
        items: bookingRequest.items,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/callback`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      }),
    })

    if (!response.ok) {
      throw new Error(`EMT API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        booking_id: data.booking_id,
        checkout_url: data.checkout_url,
        total_amount: data.total_amount,
        currency: data.currency,
      },
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function createMockBooking(bookingRequest: BookingRequest): BookingResult {
  const totalAmount = bookingRequest.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const mockBookingId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    success: true,
    data: {
      booking_id: mockBookingId,
      checkout_url: `${process.env.NEXT_PUBLIC_APP_URL}/emu/checkout/${mockBookingId}`,
      total_amount: totalAmount,
      currency: "USD", // Default for mock
    },
  }
}

export async function searchFlights(searchParams: any) {
  if (process.env.NODE_ENV === "development" || !EMT_API_KEY) {
    return mockFlightSearch(searchParams)
  }

  // Real EMT flight search implementation
  try {
    const response = await fetch(`${EMT_API_URL}/flights/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMT_API_KEY}`,
      },
      body: JSON.stringify(searchParams),
    })

    if (!response.ok) {
      throw new Error(`Flight search error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching flights:", error)
    return mockFlightSearch(searchParams)
  }
}

function mockFlightSearch(searchParams: any) {
  return {
    flights: [
      {
        id: "mock_flight_1",
        airline: "Mock Airlines",
        departure: searchParams.departure_date,
        arrival: searchParams.arrival_date,
        price: Math.floor(Math.random() * 500) + 200,
        currency: "USD",
      },
    ],
  }
}
