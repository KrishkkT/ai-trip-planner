import { type NextRequest, NextResponse } from "next/server"

// Access the global trip storage
const mockTrips = (globalThis as any).mockTrips || new Map()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params
    console.log(`[v0] GET request for trip ID: ${tripId}`)

    if (!tripId) {
      return NextResponse.json({ error: "Trip ID is required" }, { status: 400 })
    }

    const trip = mockTrips.get(tripId)
    if (!trip) {
      console.log(`[v0] Trip not found for ID: ${tripId}`)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    console.log(`[v0] Returning trip for ID: ${tripId}`)
    return NextResponse.json(trip)
  } catch (error) {
    console.error(`[v0] Error in get trip API:`, error)
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 })
  }
}