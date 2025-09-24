import { type NextRequest, NextResponse } from "next/server"
import { generateItinerary } from "@/lib/ai-orchestrator"

// Access the global trip storage
const mockTrips = (globalThis as any).mockTrips || new Map()
const mockItineraries = (globalThis as any).mockItineraries || new Map()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; itineraryType: string }> }
) {
  try {
    const { tripId, itineraryType } = await params
    console.log(`[v0] GET request for trip ID: ${tripId}, type: ${itineraryType}`)

    if (!tripId || !itineraryType) {
      return NextResponse.json({ error: "Trip ID and itinerary type are required" }, { status: 400 })
    }

    // Validate itinerary type
    const validTypes = ['budget', 'balanced', 'premium']
    if (!validTypes.includes(itineraryType.toLowerCase())) {
      return NextResponse.json({ error: "Invalid itinerary type. Must be one of: budget, balanced, premium" }, { status: 400 })
    }

    // Check if itinerary already exists
    const itineraryId = `${tripId}_${itineraryType}`
    const existingItinerary = mockItineraries.get(itineraryId)
    if (existingItinerary) {
      console.log(`[v0] Returning existing itinerary: ${itineraryId}`)
      return NextResponse.json(existingItinerary)
    }

    // Get the original trip data
    const trip = mockTrips.get(tripId)
    if (!trip) {
      console.log(`[v0] Trip not found for ID: ${tripId}`)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    console.log(`[v0] Generating ${itineraryType} itinerary for trip:`, trip.tripRequest)

    // Generate specific itinerary using AI orchestrator
    const generationResult = await generateItinerary(trip.tripRequest, itineraryType)
    
    if (!generationResult.success) {
      console.error(`[v0] Failed to generate ${itineraryType} itinerary:`, generationResult.error)
      return NextResponse.json({ error: "Failed to generate itinerary", details: generationResult.error }, { status: 500 })
    }

    // Create the itinerary data
    const itineraryData = {
      id: itineraryId,
      tripId,
      type: itineraryType,
      ...generationResult.data,
      tripRequest: trip.tripRequest,
      createdAt: new Date().toISOString(),
    }

    // Store the generated itinerary
    mockItineraries.set(itineraryId, itineraryData)
    console.log(`[v0] Generated and stored ${itineraryType} itinerary:`, itineraryId)

    return NextResponse.json(itineraryData)
  } catch (error) {
    console.error(`[v0] Error in generate specific itinerary API:`, error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; itineraryType: string }> }
) {
  // Force regeneration by deleting existing and calling GET
  try {
    const { tripId, itineraryType } = await params
    const itineraryId = `${tripId}_${itineraryType}`
    
    // Remove existing itinerary to force regeneration
    mockItineraries.delete(itineraryId)
    console.log(`[v0] Forced regeneration for: ${itineraryId}`)
    
    // Call GET to generate new one
    return GET(request, { params })
  } catch (error) {
    console.error(`[v0] Error in force regenerate itinerary API:`, error)
    return NextResponse.json({ error: "Failed to regenerate itinerary" }, { status: 500 })
  }
}