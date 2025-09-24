import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET(request: NextRequest) {
  try {
    console.log("[GEMINI TEST] Starting API connectivity test...")

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY
    console.log("[GEMINI TEST] API Key exists:", !!apiKey)
    console.log("[GEMINI TEST] API Key length:", apiKey?.length || 0)
    
    if (!apiKey) {
      console.error("[GEMINI TEST] ERROR: GEMINI_API_KEY not found in environment variables")
      return NextResponse.json(
        { 
          success: false, 
          error: "GEMINI_API_KEY not configured",
          details: "Environment variable GEMINI_API_KEY is missing"
        }, 
        { status: 500 }
      )
    }

    // Initialize the Gemini client
    console.log("[GEMINI TEST] Initializing Google Generative AI client...")
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Get the model
    console.log("[GEMINI TEST] Getting gemini-1.5-flash model...")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Test prompt
    const testPrompt = "Hello! This is a connectivity test. Please respond with 'Gemini API is working correctly' and today's date."
    console.log("[GEMINI TEST] Sending test prompt:", testPrompt)

    // Generate response
    console.log("[GEMINI TEST] Generating response...")
    const startTime = Date.now()
    
    const result = await model.generateContent(testPrompt)
    const response = await result.response
    const text = response.text()
    
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log("[GEMINI TEST] SUCCESS: Response received in", duration, "ms")
    console.log("[GEMINI TEST] Response text:", text)
    console.log("[GEMINI TEST] Response length:", text.length)

    return NextResponse.json({
      success: true,
      message: "Gemini API is functioning correctly",
      data: {
        responseTime: `${duration}ms`,
        promptTokens: testPrompt.length,
        responseTokens: text.length,
        modelUsed: "gemini-1.5-flash",
        response: text,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error("[GEMINI TEST] ERROR occurred:", error)
    console.error("[GEMINI TEST] Error name:", error?.name)
    console.error("[GEMINI TEST] Error message:", error?.message)
    console.error("[GEMINI TEST] Error stack:", error?.stack)
    
    // Check for specific error types
    let errorDetails = "Unknown error occurred"
    let statusCode = 500
    
    if (error?.message?.includes("API key not valid")) {
      errorDetails = "Invalid API key - please check your GEMINI_API_KEY"
      statusCode = 401
    } else if (error?.message?.includes("quota")) {
      errorDetails = "API quota exceeded - please check your Google AI quota"
      statusCode = 429
    } else if (error?.message?.includes("network")) {
      errorDetails = "Network error - please check your internet connection"
      statusCode = 503
    } else if (error?.code === "ENOTFOUND") {
      errorDetails = "DNS resolution failed - cannot reach Google AI servers"
      statusCode = 503
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Gemini API test failed",
        details: errorDetails,
        originalError: {
          name: error?.name,
          message: error?.message,
          code: error?.code
        }
      }, 
      { status: statusCode }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[GEMINI TEST] Starting POST test with custom prompt...")
    
    const body = await request.json()
    const { prompt, model: modelName = "gemini-1.5-flash" } = body
    
    if (!prompt) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing prompt",
          details: "Please provide a 'prompt' field in the request body"
        }, 
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "GEMINI_API_KEY not configured" 
        }, 
        { status: 500 }
      )
    }

    console.log("[GEMINI TEST] Using model:", modelName)
    console.log("[GEMINI TEST] Custom prompt:", prompt.substring(0, 100) + "...")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: modelName })

    const startTime = Date.now()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log("[GEMINI TEST] Custom prompt response received in", duration, "ms")
    console.log("[GEMINI TEST] Response length:", text.length)

    return NextResponse.json({
      success: true,
      message: "Custom prompt processed successfully",
      data: {
        responseTime: `${duration}ms`,
        promptTokens: prompt.length,
        responseTokens: text.length,
        modelUsed: modelName,
        response: text,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error("[GEMINI TEST] POST ERROR:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Custom prompt test failed",
        details: error?.message || "Unknown error occurred",
        originalError: {
          name: error?.name,
          message: error?.message
        }
      }, 
      { status: 500 }
    )
  }
}