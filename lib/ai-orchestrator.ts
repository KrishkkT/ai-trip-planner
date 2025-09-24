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

export async function generateItinerary(tripRequest: TripRequest, itineraryType?: string): Promise<GenerateItineraryResult> {
  const requestStartTime = Date.now()
  console.log('🚀 [GEMINI API] Starting itinerary generation request:', {
    destination: tripRequest.destination,
    origin: tripRequest.origin,
    duration: `${tripRequest.start_date} to ${tripRequest.end_date}`,
    budget: `${tripRequest.budget_total} ${tripRequest.currency}`,
    travelers: tripRequest.num_travelers,
    themes: tripRequest.preferred_themes,
    timestamp: new Date().toISOString()
  })
  
  try {
    // Check if API key is available
    const hasApiKey = !!process.env.GEMINI_API_KEY
    const isValidKey = process.env.GEMINI_API_KEY?.startsWith('AIza')
    const apiKeyPreview = process.env.GEMINI_API_KEY ? 
      `${process.env.GEMINI_API_KEY.substring(0, 8)}...${process.env.GEMINI_API_KEY.slice(-4)}` : 
      'NOT_SET'
    
    console.log('🔑 [GEMINI API] API Key status:', {
      hasKey: hasApiKey,
      isValidFormat: isValidKey,
      keyPreview: apiKeyPreview,
      keyLength: process.env.GEMINI_API_KEY?.length || 0
    })
    
    if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.startsWith('AIza')) {
      const reason = !process.env.GEMINI_API_KEY ? 'API key not found' : 'Invalid API key format (must start with AIza)'
      console.warn(`⚠️ [GEMINI API] ${reason}, using mock response`)
      const mockResult = generateMockItinerary(tripRequest, itineraryType)
      console.log(`📝 [GEMINI API] Returning mock response due to: ${reason}`)
      return mockResult
    }

    console.log('🤖 [GEMINI API] Initializing Gemini model...')
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    })
    console.log('✅ [GEMINI API] Gemini model initialized successfully')

    // Build the canonical prompt
    console.log('📝 [GEMINI API] Building prompt for trip request...')
    const prompt = buildCanonicalPrompt(tripRequest, itineraryType)
    console.log('📋 [GEMINI API] Prompt built:', {
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 200) + '...',
      estimatedTokens: Math.ceil(prompt.length / 4), // rough estimate
      itineraryType: itineraryType || 'all_types'
    })

    // First attempt with standard temperature
    console.log('🎯 [GEMINI API] Making first generation attempt (temperature: 0.7)...')
    let result = await attemptGeneration(model, prompt, 0.7)
    console.log('📊 [GEMINI API] First attempt result:', {
      success: result.success,
      error: result.error,
      hasData: !!result.data
    })

    if (!result.success && result.error === "schema_validation_failed") {
      console.log("🔄 [GEMINI API] First attempt failed validation, retrying with lower temperature...")
      console.log('❌ [GEMINI API] Validation errors from first attempt:', (result as any).details)

      // Retry with lower temperature and fix-up instruction
      const fixupPrompt = `${prompt}\n\nIMPORTANT: The previous response had schema validation errors. Please ensure your JSON response strictly follows the provided schema format. Double-check all required fields and data types. Return ONLY valid JSON without any markdown formatting.`
      
      console.log('🎯 [GEMINI API] Making second generation attempt (temperature: 0.3)...')
      result = await attemptGeneration(model, fixupPrompt, 0.3)
      console.log('📊 [GEMINI API] Second attempt result:', {
        success: result.success,
        error: result.error,
        hasData: !!result.data
      })
    }

    if (!result.success) {
      console.warn("⚠️ [GEMINI API] AI generation failed, falling back to mock response")
      console.log('💭 [GEMINI API] Final failure details:', {
        error: result.error,
        attempts: result.error === "schema_validation_failed" ? 2 : 1,
        fallbackReason: 'Using mock data due to API failure'
      })
      const mockResult = generateMockItinerary(tripRequest, itineraryType)
      console.log('📝 [GEMINI API] Returning mock response due to API failure')
      return mockResult
    }

    // Add metadata
    const processingTime = Date.now() - requestStartTime
    console.log('✅ [GEMINI API] Generation successful! Adding metadata...')
    
    const itineraryWithMetadata = {
      ...result.data,
      metadata: {
        ...result.data.metadata,
        generated_at: new Date().toISOString(),
        request_id: uuidv4(),
        model_version: "gemini-1.5-pro",
        confidence_score: result.data.metadata?.confidence_score || 0.85,
        processing_time_ms: processingTime,
        api_source: 'gemini-api'
      },
    }
    
    console.log('🎉 [GEMINI API] Itinerary generation completed successfully:', {
      processingTime: `${processingTime}ms`,
      itinerariesCount: itineraryWithMetadata.itineraries?.length || 0,
      confidence: itineraryWithMetadata.metadata.confidence_score,
      requestId: itineraryWithMetadata.metadata.request_id
    })

    return {
      success: true,
      data: itineraryWithMetadata,
    }
  } catch (error) {
    const processingTime = Date.now() - requestStartTime
    console.error("💥 [GEMINI API] Critical error in AI orchestrator:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      processingTime: `${processingTime}ms`,
      destination: tripRequest.destination,
      timestamp: new Date().toISOString()
    })
    console.warn("⚠️ [GEMINI API] Falling back to mock response due to critical error")
    const mockResult = generateMockItinerary(tripRequest, itineraryType)
    console.log('📝 [GEMINI API] Returning mock response due to critical error')
    return mockResult
  }
}

async function attemptGeneration(model: any, prompt: string, temperature: number) {
  const attemptStartTime = Date.now()
  console.log(`🔄 [GEMINI API] Starting generation attempt with temperature: ${temperature}`)
  
  try {
    const generationConfig = {
      temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
    
    console.log('⚙️ [GEMINI API] Generation config:', generationConfig)
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    })
    
    console.log('📡 [GEMINI API] Raw API call completed, processing response...')

    const response = await result.response
    const text = response.text()
    const responseTime = Date.now() - attemptStartTime
    
    console.log('📄 [GEMINI API] Response received:', {
      responseTime: `${responseTime}ms`,
      textLength: text.length,
      textPreview: text.substring(0, 200) + '...',
      temperature: temperature
    })

    let parsedResponse
    try {
      // Try to parse directly as JSON first
      console.log('🔍 [GEMINI API] Attempting direct JSON parsing...')
      parsedResponse = JSON.parse(text)
      console.log('✅ [GEMINI API] Direct JSON parsing successful')
    } catch (parseError) {
      console.log('⚠️ [GEMINI API] Direct JSON parsing failed, trying markdown extraction...', {
        parseError: parseError instanceof Error ? parseError.message : String(parseError)
      })
      
      // If that fails, try to extract JSON from markdown
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        console.error('❌ [GEMINI API] No valid JSON found in response:', {
          textSample: text.substring(0, 500),
          textLength: text.length
        })
        return {
          success: false,
          error: "No valid JSON found in AI response",
        }
      }

      try {
        parsedResponse = JSON.parse(jsonMatch[1] || jsonMatch[0])
        console.log('✅ [GEMINI API] Markdown JSON extraction successful')
      } catch (secondParseError) {
        console.error('❌ [GEMINI API] Failed to parse extracted JSON:', {
          extractedJson: (jsonMatch[1] || jsonMatch[0]).substring(0, 200) + '...',
          parseError: secondParseError instanceof Error ? secondParseError.message : String(secondParseError)
        })
        return {
          success: false,
          error: "Failed to parse JSON response",
        }
      }
    }

    // Validate against schema
    console.log('🔍 [GEMINI API] Validating response against schema...')
    const validation = validateItinerarySchema(parsedResponse)

    if (!validation.success) {
      console.error('❌ [GEMINI API] Schema validation failed:', {
        errors: validation.errors,
        responseStructure: Object.keys(parsedResponse || {}),
        temperature: temperature
      })
      return {
        success: false,
        error: "schema_validation_failed",
        details: validation.errors,
      }
    }
    
    console.log('✅ [GEMINI API] Schema validation passed successfully')

    const totalAttemptTime = Date.now() - attemptStartTime
    console.log(`🎉 [GEMINI API] Generation attempt successful in ${totalAttemptTime}ms`)
    
    return {
      success: true,
      data: parsedResponse,
    }
  } catch (error) {
    const totalAttemptTime = Date.now() - attemptStartTime
    console.error('💥 [GEMINI API] Error in generation attempt:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      temperature: temperature,
      attemptTime: `${totalAttemptTime}ms`
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Generation failed",
    }
  }
}

function generateMockItinerary(tripRequest: TripRequest, itineraryType?: string): GenerateItineraryResult {
  console.log('🎭 [GEMINI API] Generating mock itinerary as fallback:', {
    destination: tripRequest.destination,
    duration: `${tripRequest.start_date} to ${tripRequest.end_date}`,
    budget: `${tripRequest.budget_total} ${tripRequest.currency}`,
    type: itineraryType || 'all_types'
  })
  
  const duration = calculateDuration(tripRequest.start_date, tripRequest.end_date)
  const dailyBudget = Math.floor(tripRequest.budget_total / duration)

  // Define all possible itineraries
  const allItineraries = [
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
      id: `premium_${uuidv4()}`,
      type: "premium",
      title: `Premium ${tripRequest.destination} Experience`,
      description: `Luxury experiences and exclusive access in ${tripRequest.destination}`,
      total_cost: {
        amount: Math.floor(tripRequest.budget_total * 1.2),
        currency: tripRequest.currency,
      },
      days: generateMockDays(tripRequest, duration, dailyBudget * 1.2, "premium"),
      highlights: [
        "Luxury accommodations with premium amenities",
        "Private guided tours and exclusive access",
        "Fine dining at renowned restaurants",
        "Premium transportation and comfort",
      ],
      best_for: ["Luxury travelers", "Special occasions", "Comfort seekers"],
    },
  ]

  // Filter based on requested type
  let selectedItineraries
  if (itineraryType) {
    selectedItineraries = allItineraries.filter(itinerary => itinerary.type === itineraryType)
    if (selectedItineraries.length === 0) {
      // Fallback to balanced if type not found
      selectedItineraries = allItineraries.filter(itinerary => itinerary.type === 'balanced')
    }
  } else {
    // Return all types if no specific type requested
    selectedItineraries = allItineraries
  }

  const mockItinerary = {
    itineraries: selectedItineraries,
    metadata: {
      generated_at: new Date().toISOString(),
      confidence_score: 0.75, // Lower for mock data
      request_id: uuidv4(),
      model_version: "mock-generator-v1",
      itinerary_type: itineraryType || 'all_types',
    },
  }

  console.log('✅ [GEMINI API] Mock itinerary generated successfully:', {
    itinerariesCount: mockItinerary.itineraries.length,
    confidence: mockItinerary.metadata.confidence_score,
    source: 'mock-generator'
  })

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
