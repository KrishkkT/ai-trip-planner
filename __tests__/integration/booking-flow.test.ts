import { createBooking } from "@/lib/emt-adapter"
import { saveBooking } from "@/lib/firestore"

// Mock Firestore
jest.mock("@/lib/firestore", () => ({
  saveBooking: jest.fn().mockResolvedValue({
    id: "test_booking_id",
    status: "pending",
  }),
}))

describe("Booking Flow Integration", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development"
    delete process.env.EMT_API_KEY
  })

  it("should complete end-to-end booking flow", async () => {
    const bookingRequest = {
      itinerary_id: "test_itinerary",
      user_id: "test_user",
      items: [
        {
          type: "hotel" as const,
          item_id: "hotel_1",
          quantity: 1,
          price: 200,
        },
        {
          type: "activity" as const,
          item_id: "activity_1",
          quantity: 2,
          price: 50,
        },
      ],
    }

    // Step 1: Create booking through EMT adapter
    const emtResult = await createBooking(bookingRequest)
    expect(emtResult.success).toBe(true)
    expect(emtResult.data?.booking_id).toBeDefined()
    expect(emtResult.data?.checkout_url).toBeDefined()

    // Step 2: Save booking to database
    const bookingData = {
      ...emtResult.data,
      user_id: bookingRequest.user_id,
      itinerary_id: bookingRequest.itinerary_id,
    }

    const savedBooking = await saveBooking(bookingData)
    expect(savedBooking.id).toBe("test_booking_id")
    expect(savedBooking.status).toBe("pending")

    // Verify the complete flow
    expect(emtResult.data?.total_amount).toBe(300) // 200 + (50 * 2)
    expect(emtResult.data?.checkout_url).toContain(emtResult.data?.booking_id)
  })

  it("should handle booking failures gracefully", async () => {
    // Mock EMT adapter failure
    const mockError = new Error("EMT service unavailable")
    jest.spyOn(require("@/lib/emt-adapter"), "createBooking").mockRejectedValueOnce(mockError)

    const bookingRequest = {
      itinerary_id: "test_itinerary",
      user_id: "test_user",
      items: [
        {
          type: "hotel" as const,
          item_id: "hotel_1",
          quantity: 1,
          price: 200,
        },
      ],
    }

    try {
      await createBooking(bookingRequest)
    } catch (error) {
      expect(error).toBe(mockError)
    }

    // Verify that database save was not called
    expect(saveBooking).not.toHaveBeenCalled()
  })
})
