import { type NextRequest, NextResponse } from "next/server"
import { processRealtimeEvent } from "@/lib/realtime-processor"
import { validateWebhookSignature } from "@/lib/webhook-validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get("x-webhook-signature")

    // Validate webhook signature (in production)
    if (process.env.NODE_ENV === "production") {
      const isValid = await validateWebhookSignature(body, signature)
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
      }
    }

    // Process the realtime event
    const result = await processRealtimeEvent(body)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to process event", details: result.error }, { status: 500 })
    }

    return NextResponse.json({
      status: "processed",
      message: "Event processed successfully",
      affected_itineraries: result.data.affected_itineraries,
    })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
