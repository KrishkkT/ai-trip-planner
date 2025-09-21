import { POST } from "@/app/api/v1/itineraries/generate/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock the AI orchestrator
jest.mock("@/lib/ai-orchestrator", () => ({
  generateItinerary: jest.fn().mockResolvedValue({
    success: true,
    data: {
      itineraries: [],
      metadata: {
        generated_at: "2025-01-01T00:00:00Z",
        confidence_score: 0.8,
        request_id: "test_request",
      },
    },
  }),
}))

// Mock Firestore
jest.mock("@/lib/firestore", () => ({
  saveItinerary: jest.fn().mockResolvedValue({
    id: "test_itinerary_id",
  }),
}))

// Mock rate limiting
jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn().mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60000,
  }),
}))

describe("/api/v1/itineraries/generate", () => {
  const validRequestBody = {
    origin: "New York, USA",
    destination: "Paris, France",
    start_date: "2025-10-05",
    end_date: "2025-10-08",
    budget_total: 2000,
    currency: "USD",
    preferred_themes: ["culture", "food"],
    num_travelers: 2,
  }

  it("should generate itinerary successfully", async () => {
    const request = new NextRequest("http://localhost:3001/api/v1/itineraries/generate", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe("success")
    expect(data.id).toBe("test_itinerary_id")
    expect(data.confidence_score).toBe(0.8)
  })

  it("should validate required fields", async () => {
    const invalidRequest = {
      ...validRequestBody,
      origin: "", // Missing required field
      budget_total: -100, // Invalid budget
    }

    const request = new NextRequest("http://localhost:3001/api/v1/itineraries/generate", {
      method: "POST",
      body: JSON.stringify(invalidRequest),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Invalid request data")
    expect(data.details).toBeDefined()
  })

  it("should handle missing request body", async () => {
    const request = new NextRequest("http://localhost:3001/api/v1/itineraries/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Invalid request data")
  })

  it("should enforce rate limiting", async () => {
    // Mock rate limit exceeded
    const { rateLimit } = require("@/lib/rate-limit")
    rateLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const request = new NextRequest("http://localhost:3001/api/v1/itineraries/generate", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe("Too many requests. Please try again later.")
  })
})
