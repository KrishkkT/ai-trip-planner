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

export function buildCanonicalPrompt(tripRequest: TripRequest, itineraryType?: string): string {
  const {
    origin,
    destination,
    start_date,
    end_date,
    budget_total,
    currency,
    preferred_themes,
    num_travelers,
    additional_info,
  } = tripRequest

  const duration = calculateDuration(start_date, end_date)
  const themesText = preferred_themes.join(", ")
  const additionalContext = additional_info ? `\n\nAdditional Requirements: ${additional_info}` : ""
  const specificTypeInstruction = itineraryType ? `\n\nSPECIFIC TYPE REQUESTED: Generate ONLY a "${itineraryType}" type itinerary.` : ""

  return `You are an expert travel planner AI. Create exactly 3 distinct travel itineraries for the following trip request:

**Trip Details:**
- Origin: ${origin}
- Destination: ${destination}
- Start Date: ${start_date}
- End Date: ${end_date}
- Duration: ${duration} days
- Total Budget: ${currency} ${budget_total.toLocaleString()}
- Number of Travelers: ${num_travelers}
- Preferred Themes: ${themesText}${additionalContext}${specificTypeInstruction}

**Requirements:**
1. ${itineraryType ? `Generate exactly 1 itinerary of type "${itineraryType}":` : 'Generate exactly 3 itineraries with these types:'}
   ${itineraryType ? getTypeDescription(itineraryType) : `- "balanced": Perfect mix of must-see attractions and local experiences
   - "budget": Maximum value with smart savings and local gems
   - "premium": Premium experiences and exclusive access`}

2. Each itinerary must include:
   - Day-by-day detailed plans
   - Specific activities with locations and coordinates
   - Accommodation recommendations
   - Meal suggestions
   - Transportation options
   - Realistic cost breakdowns
   - Booking information where applicable

3. Ensure costs are realistic and within budget constraints
4. Include local cultural insights and hidden gems
5. Consider travel themes and preferences
6. Provide specific location coordinates for mapping
7. Include confidence score based on data availability

**Output Format:**
Return your response as a JSON object that strictly follows this schema:

\`\`\`json
{
  "itineraries": [
    {
      "id": "unique_string_id",
      "type": "${itineraryType || 'balanced|budget|premium'}",
      "title": "Catchy itinerary title",
      "description": "Brief description",
      "total_cost": {
        "amount": number,
        "currency": "string"
      },
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "activities": [
            {
              "name": "Activity name",
              "type": "sightseeing|adventure|cultural|food|shopping|relaxation|transport",
              "duration": "2 hours",
              "cost": {
                "amount": number,
                "currency": "string"
              },
              "location": {
                "name": "Location name",
                "coordinates": {
                  "lat": number,
                  "lng": number
                }
              },
              "booking_info": {
                "bookable": boolean,
                "provider": "string",
                "booking_url": "string"
              }
            }
          ],
          "accommodation": {
            "name": "Hotel name",
            "type": "hotel|hostel|resort|guesthouse|apartment",
            "cost": {
              "amount": number,
              "currency": "string"
            },
            "location": {
              "name": "Location name",
              "coordinates": {
                "lat": number,
                "lng": number
              }
            },
            "booking_info": {
              "bookable": true,
              "provider": "EaseMyTrip",
              "booking_url": "string"
            }
          },
          "meals": [
            {
              "type": "breakfast|lunch|dinner|snack",
              "name": "Restaurant/meal name",
              "cost": {
                "amount": number,
                "currency": "string"
              }
            }
          ],
          "transportation": {
            "type": "flight|train|bus|taxi|rental_car|walking",
            "cost": {
              "amount": number,
              "currency": "string"
            }
          },
          "daily_cost": {
            "amount": number,
            "currency": "string"
          }
        }
      ],
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "best_for": ["tag1", "tag2"]
    }
  ],
  "metadata": {
    "generated_at": "ISO_datetime",
    "confidence_score": 0.85,
    "request_id": "unique_id"
  }
}
\`\`\`

**Important Notes:**
- All costs must be in the specified currency (${currency})
- Coordinates must be accurate for the specified locations
- Total costs should respect the budget of ${currency} ${budget_total.toLocaleString()}
- Include realistic booking URLs (use placeholder URLs if needed)
- Confidence score should reflect data availability and accuracy (0.0 to 1.0)
- Ensure all required fields are present and properly typed

Generate the complete JSON response now:`
}

function getTypeDescription(type: string): string {
  const descriptions = {
    'budget': '- "budget": Maximum value with smart savings and local gems',
    'balanced': '- "balanced": Perfect mix of must-see attractions and local experiences',
    'premium': '- "premium": Premium experiences and exclusive access'
  }
  return descriptions[type as keyof typeof descriptions] || descriptions['balanced']
}

function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
