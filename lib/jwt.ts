import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface JWTPayload {
  uid: string
  email: string | null
}

export async function generateJWT(payload: JWTPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    issuer: "ai-trip-planner",
  })
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}
