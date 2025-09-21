import { generateItinerary } from "@/lib/ai-orchestrator"
import { validateItinerarySchema } from "@/lib/schema-validator"
import jest from "jest"

// Mock the Google Generative AI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              itineraries: [
                {
                  id: "test_balanced",
                  type: "balanced",
                  title: "Test Balanced Trip",
                  description: "A test itinerary",
                  total_cost: { amount: 1000, currency: "USD" },
                  days: [
                    {
                      day: 1,
                      date: "2025-10-05",
                      activities: [],
                      accommodation: {
                        name: "Test Hotel",
                        type: "hotel",
                        cost: { amount: 100, currency: "USD" },
                        location: { name: "Test Location", coordinates: { lat: 0, lng: 0 } },
                      },
                      meals: [],
                      transportation: { type: "taxi", cost: { amount: 20, currency: "USD" } },
                      daily_cost: { amount: 120, currency: "USD" },
                    },
                  ],
                  highlights: ["Test highlight"],
                  best_for: ["Test travelers"],
                },
              ],
              metadata: {
                generated_at: "2025-01-01T00:00:00Z",
                confidence_score: 0.8,
                request_id: "test_request",
              },
            }),
        },
      }),
    }),
  })),
}))

describe("AI Orchestrator", () => {
  const mockTripRequest = {
    origin: "New York, USA",
    destination: "Paris, France",
    start_date: "2025-10-05",
    end_date: "2025-10-08",
    budget_total: 2000,
    currency: "USD",
    preferred_themes: ["culture", "food"],
    num_travelers: 2,
  }

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test_api_key"
  })

  it("should generate a valid itinerary", async () => {
    const result = await generateItinerary(mockTripRequest)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data.itineraries).toHaveLength(1)
    expect(result.data.metadata).toBeDefined()
  })

  it("should validate generated itinerary against schema", async () => {
    const result = await generateItinerary(mockTripRequest)

    if (result.success && result.data) {
      const validation = validateItinerarySchema(result.data)
      expect(validation.success).toBe(true)
    }
  })

  it("should handle missing API key gracefully", async () => {
    delete process.env.GEMINI_API_KEY

    const result = await generateItinerary(mockTripRequest)

    // Should fall back to mock data
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it("should include required metadata fields", async () => {
    const result = await generateItinerary(mockTripRequest)

    expect(result.success).toBe(true)
    expect(result.data.metadata).toMatchObject({
      generated_at: expect.any(String),
      confidence_score: expect.any(Number),
      request_id: expect.any(String),
      model_version: expect.any(String),
    })
  })

  it("should respect budget constraints in mock data", async () => {
    delete process.env.GEMINI_API_KEY

    const result = await generateItinerary(mockTripRequest)

    if (result.success && result.data) {
      result.data.itineraries.forEach((itinerary: any) => {
        expect(itinerary.total_cost.amount).toBeLessThanOrEqual(mockTripRequest.budget_total)
      })
    }
  })
})
