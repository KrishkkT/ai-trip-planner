import { type NextRequest, NextResponse } from "next/server"
import { validateTripRequest } from "@/lib/validation"

const mockItineraries = new Map()

function generateMockItineraries(tripRequest: any) {
  const { origin, destination, start_date, end_date, budget_total, currency, num_travelers, preferred_themes } =
    tripRequest

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const budgetPerDay = Math.floor(budget_total / days)
  const themes = preferred_themes || ["heritage"]

  const generateDays = (budgetMultiplier: number, style: string) => {
    const dailyBudget = Math.floor(budgetPerDay * budgetMultiplier)
    return Array.from({ length: days }, (_, i) => {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      return {
        day: i + 1,
        date: currentDate.toISOString().split("T")[0],
        activities: [
          {
            time: "09:00",
            activity: `Morning ${themes[0]} exploration`,
            location: `${destination} City Center`,
            cost: Math.floor(dailyBudget * 0.3),
            description: `Start your day exploring the ${style} attractions of ${destination}`,
          },
          {
            time: "13:00",
            activity: "Local cuisine lunch",
            location: `Traditional restaurant in ${destination}`,
            cost: Math.floor(dailyBudget * 0.2),
            description: `Enjoy authentic local dishes and specialties`,
          },
          {
            time: "15:00",
            activity: `Afternoon ${themes[1] || themes[0]} activity`,
            location: `Popular ${destination} landmark`,
            cost: Math.floor(dailyBudget * 0.3),
            description: `Continue exploring based on your interests`,
          },
          {
            time: "19:00",
            activity: "Evening leisure",
            location: `${destination} entertainment district`,
            cost: Math.floor(dailyBudget * 0.2),
            description: `Relax and enjoy the evening atmosphere`,
          },
        ],
      }
    })
  }

  return {
    itineraries: [
      {
        id: "budget",
        title: "Budget Explorer",
        description: `Discover ${destination} without breaking the bank. This itinerary focuses on free attractions, local experiences, and budget-friendly accommodations.`,
        totalCost: Math.floor(budget_total * 0.7),
        days: generateDays(0.7, "budget-friendly"),
        accommodation: {
          name: `Budget Hotel ${destination}`,
          type: "Budget Hotel",
          pricePerNight: Math.floor(budgetPerDay * 0.3),
          rating: 3.5,
          amenities: ["Free WiFi", "Breakfast", "24/7 Reception"],
        },
        transportation: {
          type: "Public Transport",
          cost: Math.floor(budget_total * 0.1),
          details: "Local buses and trains",
        },
      },
      {
        id: "balanced",
        title: "Balanced Journey",
        description: `The perfect mix of comfort and adventure. Experience ${destination} with a good balance of must-see attractions and local experiences.`,
        totalCost: Math.floor(budget_total * 0.9),
        days: generateDays(0.9, "balanced"),
        accommodation: {
          name: `Mid-Range Hotel ${destination}`,
          type: "3-Star Hotel",
          pricePerNight: Math.floor(budgetPerDay * 0.4),
          rating: 4.0,
          amenities: ["Free WiFi", "Breakfast", "Gym", "Pool"],
        },
        transportation: {
          type: "Mixed Transport",
          cost: Math.floor(budget_total * 0.15),
          details: "Combination of public transport and taxis",
        },
      },
      {
        id: "luxury",
        title: "Luxury Experience",
        description: `Indulge in the finest ${destination} has to offer. Premium accommodations, exclusive experiences, and personalized service.`,
        totalCost: Math.floor(budget_total * 1.2),
        days: generateDays(1.2, "luxury"),
        accommodation: {
          name: `Luxury Resort ${destination}`,
          type: "5-Star Resort",
          pricePerNight: Math.floor(budgetPerDay * 0.6),
          rating: 4.8,
          amenities: ["Spa", "Fine Dining", "Concierge", "Premium WiFi", "Pool", "Gym"],
        },
        transportation: {
          type: "Private Transport",
          cost: Math.floor(budget_total * 0.2),
          details: "Private car with driver",
        },
      },
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting itinerary generation")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    // Validate input
    const validationResult = validateTripRequest(body)
    if (!validationResult.success) {
      console.log("[v0] Validation failed:", validationResult.errors)
      return NextResponse.json({ error: "Invalid request data", details: validationResult.errors }, { status: 400 })
    }

    const tripRequest = validationResult.data
    console.log("[v0] Validated trip request:", tripRequest)

    const itineraryData = generateMockItineraries(tripRequest)
    console.log("[v0] Generated mock itineraries")

    const itineraryId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    mockItineraries.set(itineraryId, {
      id: itineraryId,
      ...itineraryData,
      tripRequest,
      createdAt: new Date().toISOString(),
    })

    console.log("[v0] Stored itinerary with ID:", itineraryId)

    return NextResponse.json({
      id: itineraryId,
      status: "success",
      message: "Itinerary generated successfully",
      confidence_score: 0.95,
    })
  } catch (error) {
    console.error("[v0] Error in generate itinerary API:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Itinerary ID is required" }, { status: 400 })
  }

  const itinerary = mockItineraries.get(id)
  if (!itinerary) {
    return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
  }

  return NextResponse.json(itinerary)
}
