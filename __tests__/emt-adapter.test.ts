import { createBooking, searchFlights } from "@/lib/emt-adapter"

describe("EMT Adapter", () => {
  const mockBookingRequest = {
    itinerary_id: "test_itinerary",
    user_id: "test_user",
    items: [
      {
        type: "hotel" as const,
        item_id: "hotel_1",
        quantity: 1,
        price: 100,
      },
      {
        type: "activity" as const,
        item_id: "activity_1",
        quantity: 2,
        price: 50,
      },
    ],
  }

  beforeEach(() => {
    // Ensure we're in development mode for mock responses
    process.env.NODE_ENV = "development"
    delete process.env.EMT_API_KEY
  })

  it("should create a mock booking successfully", async () => {
    const result = await createBooking(mockBookingRequest)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data?.booking_id).toMatch(/^mock_/)
    expect(result.data?.checkout_url).toContain("/emu/checkout/")
    expect(result.data?.total_amount).toBe(200) // 100 + (50 * 2)
  })

  it("should handle booking request validation", async () => {
    const invalidRequest = {
      ...mockBookingRequest,
      items: [], // Empty items should be handled
    }

    const result = await createBooking(invalidRequest)

    expect(result.success).toBe(true) // Mock adapter is lenient
    expect(result.data?.total_amount).toBe(0)
  })

  it("should search flights in mock mode", async () => {
    const searchParams = {
      origin: "NYC",
      destination: "PAR",
      departure_date: "2025-10-05",
      return_date: "2025-10-08",
      passengers: 2,
    }

    const result = await searchFlights(searchParams)

    expect(result).toBeDefined()
    expect(result.flights).toBeDefined()
    expect(Array.isArray(result.flights)).toBe(true)
  })

  it("should generate realistic mock booking IDs", async () => {
    const result1 = await createBooking(mockBookingRequest)
    const result2 = await createBooking(mockBookingRequest)

    expect(result1.data?.booking_id).not.toBe(result2.data?.booking_id)
    expect(result1.data?.booking_id).toMatch(/^mock_\d+_[a-z0-9]+$/)
  })

  it("should calculate total amount correctly", async () => {
    const complexRequest = {
      ...mockBookingRequest,
      items: [
        { type: "hotel" as const, item_id: "hotel_1", quantity: 3, price: 150 },
        { type: "activity" as const, item_id: "activity_1", quantity: 2, price: 75 },
        { type: "flight" as const, item_id: "flight_1", quantity: 1, price: 500 },
      ],
    }

    const result = await createBooking(complexRequest)

    expect(result.data?.total_amount).toBe(1100) // (150*3) + (75*2) + (500*1)
  })
})
