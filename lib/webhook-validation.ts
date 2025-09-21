import crypto from "crypto"

export async function validateWebhookSignature(payload: any, signature: string | null): Promise<boolean> {
  if (!signature) {
    return false
  }

  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    console.warn("WEBHOOK_SECRET not configured, skipping validation")
    return true // Allow in development
  }

  try {
    const expectedSignature = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex")

    const providedSignature = signature.replace("sha256=", "")

    return crypto.timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(providedSignature, "hex"))
  } catch (error) {
    console.error("Error validating webhook signature:", error)
    return false
  }
}
