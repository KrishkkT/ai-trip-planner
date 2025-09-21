import { saveEvent } from "./firestore"
import { v4 as uuidv4 } from "uuid"

interface RealtimeEvent {
  type: "weather" | "delay" | "closure" | "emergency"
  severity: "low" | "medium" | "high"
  date: string
  location?: {
    name: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  description: string
  affected_areas?: string[]
}

interface ProcessEventResult {
  success: boolean
  data?: {
    affected_itineraries: string[]
    adjustments_made: any[]
  }
  error?: string
}

export async function processRealtimeEvent(event: RealtimeEvent): Promise<ProcessEventResult> {
  try {
    // Save the event
    await saveEvent({
      ...event,
      id: uuidv4(),
      processed_at: new Date().toISOString(),
    })

    // Find affected itineraries (simplified logic)
    const affectedItineraries = await findAffectedItineraries(event)
    const adjustmentsMade = []

    // Process adjustments for each affected itinerary
    for (const itineraryId of affectedItineraries) {
      const adjustments = await applyAdjustmentRules(itineraryId, event)
      adjustmentsMade.push({
        itinerary_id: itineraryId,
        adjustments,
      })
    }

    return {
      success: true,
      data: {
        affected_itineraries: affectedItineraries,
        adjustments_made: adjustmentsMade,
      },
    }
  } catch (error) {
    console.error("Error processing realtime event:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function findAffectedItineraries(event: RealtimeEvent): Promise<string[]> {
  // In a real implementation, this would query the database
  // For now, return mock affected itineraries
  return ["mock_itinerary_1", "mock_itinerary_2"]
}

async function applyAdjustmentRules(itineraryId: string, event: RealtimeEvent) {
  const adjustments = []

  switch (event.type) {
    case "weather":
      if (event.severity === "high") {
        adjustments.push({
          type: "activity_replacement",
          reason: "Severe weather conditions",
          original_activity: "Outdoor sightseeing",
          replacement_activity: "Indoor museum visit",
          cost_adjustment: 0,
        })
      }
      break

    case "delay":
      adjustments.push({
        type: "schedule_adjustment",
        reason: "Transportation delay",
        time_shift: "+2 hours",
        affected_activities: ["Morning tour", "Lunch reservation"],
      })
      break

    case "closure":
      adjustments.push({
        type: "venue_replacement",
        reason: "Venue temporarily closed",
        original_venue: event.location?.name,
        replacement_venue: "Alternative attraction nearby",
        cost_adjustment: -50,
      })
      break

    default:
      adjustments.push({
        type: "notification",
        message: `${event.type} alert: ${event.description}`,
      })
  }

  return adjustments
}
