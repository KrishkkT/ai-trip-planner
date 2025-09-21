import { GoogleGenerativeAI } from "@google/generative-ai"
import { validateItinerarySchema } from "./schema-validator"
import { buildCanonicalPrompt } from "./prompt-builder"
import { v4 as uuidv4 } from "uuid"

interface TripRequest {
  origin: string
  destination: string
  start_date: string
  end_date: string
  budget_total: number
  currency: string
  preferred_themes: string[]
  num_travelers: number
  additional_info?: string
}

interface GenerateItineraryResult {
  success: boolean
  data?: any
  error?: string
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateItinerary(tripRequest: TripRequest): Promise<GenerateItineraryResult> {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, using mock response")
      return generateMockItinerary(tripRequest)
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    })

    // Build the canonical prompt
    const prompt = buildCanonicalPrompt(tripRequest)

    // First attempt with standard temperature
    let result = await attemptGeneration(model, prompt, 0.7)

    if (!result.success && result.error === "schema_validation_failed") {
      console.log("First attempt failed validation, retrying with lower temperature...")

      // Retry with lower temperature and fix-up instruction
      const fixupPrompt = `${prompt}\n\nIMPORTANT: The previous response had schema validation errors. Please ensure your JSON response strictly follows the provided schema format. Double-check all required fields and data types. Return ONLY valid JSON without any markdown formatting.`

      result = await attemptGeneration(model, fixupPrompt, 0.3)
    }

    if (!result.success) {
      console.warn("AI generation failed, falling back to mock response")
      return generateMockItinerary(tripRequest)
    }

    // Add metadata
    const itineraryWithMetadata = {
      ...result.data,
      metadata: {
        ...result.data.metadata,
        generated_at: new Date().toISOString(),
        request_id: uuidv4(),
        model_version: "gemini-1.5-pro",
        confidence_score: result.data.metadata?.confidence_score || 0.85,
      },
    }

    return {
      success: true,
      data: itineraryWithMetadata,
    }
  } catch (error) {
    console.error("Error in AI orchestrator:", error)
    console.warn("Falling back to mock response due to error")
    return generateMockItinerary(tripRequest)
  }
}

async function attemptGeneration(model: any, prompt: string, temperature: number) {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    })

    const response = await result.response
    const text = response.text()

    let parsedResponse
    try {
      // Try to parse directly as JSON first
      parsedResponse = JSON.parse(text)
    } catch (parseError) {
      // If that fails, try to extract JSON from markdown
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        return {
          success: false,
          error: "No valid JSON found in AI response",
        }
      }

      try {
        parsedResponse = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } catch (secondParseError) {
        return {
          success: false,
          error: "Failed to parse JSON response",
        }
      }
    }

    // Validate against schema
    const validation = validateItinerarySchema(parsedResponse)

    if (!validation.success) {
      console.error("Schema validation errors:", validation.errors)
      return {
        success: false,
        error: "schema_validation_failed",
        details: validation.errors,
      }
    }

    return {
      success: true,
      data: parsedResponse,
    }
  } catch (error) {
    console.error("Error in attempt generation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Generation failed",
    }
  }
}

function generateMockItinerary(tripRequest: TripRequest): GenerateItineraryResult {
  const duration = calculateDuration(tripRequest.start_date, tripRequest.end_date)
  const dailyBudget = Math.floor(tripRequest.budget_total / duration)

  const mockItinerary = {
    itineraries: [
      {
        id: `balanced_${uuidv4()}`,
        type: "balanced",
        title: `Balanced ${tripRequest.destination} Adventure`,
        description: `A perfect mix of must-see attractions and local experiences in ${tripRequest.destination}`,
        total_cost: {
          amount: Math.floor(tripRequest.budget_total * 0.9),
          currency: tripRequest.currency,
        },
        days: generateMockDays(tripRequest, duration, dailyBudget * 0.9, "balanced"),
        highlights: [
          `Explore the iconic landmarks of ${tripRequest.destination}`,
          "Experience authentic local cuisine",
          "Visit hidden gems recommended by locals",
          "Perfect balance of culture and relaxation",
        ],
        best_for: ["First-time visitors", "Culture enthusiasts", "Balanced travelers"],
      },
      {
        id: `budget_${uuidv4()}`,
        type: "budget",
        title: `Budget-Friendly ${tripRequest.destination} Explorer`,
        description: `Maximum value with smart savings and local gems in ${tripRequest.destination}`,
        total_cost: {
          amount: Math.floor(tripRequest.budget_total * 0.7),
          currency: tripRequest.currency,
        },
        days: generateMockDays(tripRequest, duration, dailyBudget * 0.7, "budget"),
        highlights: [
          "Affordable local transportation options",
          "Budget-friendly accommodations with great reviews",
          "Free walking tours and public attractions",
          "Local street food and markets",
        ],
        best_for: ["Budget travelers", "Backpackers", "Students"],
      },
      {
        id: `experience_${uuidv4()}`,
        type: "experience",
        title: `Premium ${tripRequest.destination} Experience`,
        description: `Luxury experiences and exclusive access in ${tripRequest.destination}`,
        total_cost: {
          amount: tripRequest.budget_total,
          currency: tripRequest.currency,
        },
        days: generateMockDays(tripRequest, duration, dailyBudget, "experience"),
        highlights: [
          "Luxury accommodations with premium amenities",
          "Private guided tours and exclusive access",
          "Fine dining at renowned restaurants",
          "Premium transportation and comfort",
        ],
        best_for: ["Luxury travelers", "Special occasions", "Comfort seekers"],
      },
    ],
    metadata: {
      generated_at: new Date().toISOString(),
      confidence_score: 0.75, // Lower for mock data
      request_id: uuidv4(),
      model_version: "mock-generator-v1",
    },
  }

  return {
    success: true,
    data: mockItinerary,
  }
}

function generateMockDays(tripRequest: TripRequest, duration: number, dailyBudget: number, type: string) {
  const days = []
  const startDate = new Date(tripRequest.start_date)

  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const accommodationCost =
      type === "experience" ? dailyBudget * 0.4 : type === "budget" ? dailyBudget * 0.3 : dailyBudget * 0.35
    const activityCost = dailyBudget - accommodationCost - dailyBudget * 0.2 // 20% for meals/transport

    days.push({
      day: i + 1,
      date: currentDate.toISOString().split("T")[0],
      activities: [
        {
          name: `Explore ${tripRequest.destination} City Center`,
          type: "sightseeing",
          duration: "3 hours",
          cost: {
            amount: Math.floor(activityCost * 0.6),
            currency: tripRequest.currency,
          },
          location: {
            name: `${tripRequest.destination} City Center`,
            coordinates: {
              lat: 40.7128 + (Math.random() - 0.5) * 0.1,
              lng: -74.006 + (Math.random() - 0.5) * 0.1,
            },
          },
          booking_info: {
            bookable: true,
            provider: "EaseMyTrip",
            booking_url: `https://easemytrip.com/activities/${tripRequest.destination.toLowerCase()}`,
          },
        },
        {
          name: `Local ${tripRequest.preferred_themes[0] || "cultural"} Experience`,
          type: (tripRequest.preferred_themes[0] as any) || "cultural",
          duration: "2 hours",
          cost: {
            amount: Math.floor(activityCost * 0.4),
            currency: tripRequest.currency,
          },
          location: {
            name: `${tripRequest.destination} Cultural District`,
            coordinates: {
              lat: 40.7128 + (Math.random() - 0.5) * 0.1,
              lng: -74.006 + (Math.random() - 0.5) * 0.1,
            },
          },
          booking_info: {
            bookable: true,
            provider: "EaseMyTrip",
            booking_url: `https://easemytrip.com/experiences/${tripRequest.destination.toLowerCase()}`,
          },
        },
      ],
      accommodation: {
        name:
          type === "experience"
            ? `Luxury Hotel ${tripRequest.destination}`
            : type === "budget"
              ? `Budget Inn ${tripRequest.destination}`
              : `Comfort Hotel ${tripRequest.destination}`,
        type: type === "experience" ? "resort" : type === "budget" ? "hostel" : "hotel",
        cost: {
          amount: Math.floor(accommodationCost),
          currency: tripRequest.currency,
        },
        location: {
          name: `${tripRequest.destination} Downtown`,
          coordinates: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.05,
            lng: -74.006 + (Math.random() - 0.5) * 0.05,
          },
        },
        booking_info: {
          bookable: true,
          provider: "EaseMyTrip",
          booking_url: `https://easemytrip.com/hotels/${tripRequest.destination.toLowerCase()}`,
        },
      },
      meals: [
        {
          type: "breakfast",
          name: "Local Breakfast Spot",
          cost: {
            amount: Math.floor(dailyBudget * 0.05),
            currency: tripRequest.currency,
          },
        },
        {
          type: "lunch",
          name: "Traditional Restaurant",
          cost: {
            amount: Math.floor(dailyBudget * 0.08),
            currency: tripRequest.currency,
          },
        },
        {
          type: "dinner",
          name: type === "experience" ? "Fine Dining Restaurant" : "Local Eatery",
          cost: {
            amount: Math.floor(dailyBudget * (type === "experience" ? 0.15 : 0.07)),
            currency: tripRequest.currency,
          },
        },
      ],
      transportation: {
        type: type === "experience" ? "taxi" : type === "budget" ? "bus" : "train",
        cost: {
          amount: Math.floor(dailyBudget * 0.05),
          currency: tripRequest.currency,
        },
      },
      daily_cost: {
        amount: Math.floor(dailyBudget),
        currency: tripRequest.currency,
      },
    })
  }

  return days
}

function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays) // Ensure at least 1 day
}
