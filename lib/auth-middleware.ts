import type { NextRequest } from "next/server"
import { verifyJWT, extractTokenFromHeader } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string
    email: string | null
  }
}

export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean
  user?: { uid: string; email: string | null }
  error?: string
}> {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return {
        success: false,
        error: "No authentication token provided",
      }
    }

    const payload = await verifyJWT(token)

    if (!payload) {
      return {
        success: false,
        error: "Invalid or expired token",
      }
    }

    return {
      success: true,
      user: payload,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      error: "Authentication failed",
    }
  }
}
