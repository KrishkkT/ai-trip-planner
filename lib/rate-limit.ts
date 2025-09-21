import type { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  limit?: number
  remaining?: number
  reset?: number
}

// Simple in-memory rate limiting (use Redis in production)
const requests = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  request: NextRequest,
  limit = 10,
  windowMs = 60000, // 1 minute
): Promise<RateLimitResult> {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const windowStart = now - windowMs

  // Clean up old entries
  for (const [key, value] of requests.entries()) {
    if (value.resetTime < now) {
      requests.delete(key)
    }
  }

  const current = requests.get(ip)

  if (!current) {
    requests.set(ip, { count: 1, resetTime: now + windowMs })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  if (current.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: current.resetTime,
    }
  }

  current.count++

  return {
    success: true,
    limit,
    remaining: limit - current.count,
    reset: current.resetTime,
  }
}
