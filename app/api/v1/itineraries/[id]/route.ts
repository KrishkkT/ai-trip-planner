import { type NextRequest, NextResponse } from "next/server"
import { getItinerary } from "@/lib/firestore"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Itinerary ID is required" }, { status: 400 })
    }

    const itinerary = await getItinerary(id)

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
    }

    return NextResponse.json(itinerary)
  } catch (error) {
    console.error("Error fetching itinerary:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
