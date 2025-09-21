import * as z from "zod"

interface ValidationResult {
  success: boolean
  errors?: any[]
  data?: any
}

const tripRequestSchema = z.object({
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
  budget_total: z.number().min(1, "Budget must be greater than 0"),
  currency: z.enum(["USD", "INR", "EUR", "GBP"], { errorMap: () => ({ message: "Invalid currency" }) }),
  num_travelers: z.number().min(1, "Number of travelers must be at least 1"),
  preferred_themes: z.array(z.string()).min(1, "At least one preferred theme is required"),
  accommodation_type: z.enum(["budget", "mid-range", "luxury", "any"]).optional(),
  transportation_preference: z.enum(["public", "private", "rental", "mixed", "any"]).optional(),
  meal_preference: z.enum(["local", "international", "vegetarian", "vegan", "any"]).optional(),
  activity_level: z.enum(["relaxed", "moderate", "active", "very-active"]).optional(),
  group_type: z.enum(["solo", "couple", "family", "friends", "business"]).optional(),
  special_occasions: z.string().optional(),
  accessibility_needs: z.string().optional(),
  additional_info: z.string().optional(),
})

export function validateItinerarySchema(data: any): ValidationResult {
  return {
    success: true,
    data,
  }
}

export function validateTripRequest(data: any): ValidationResult {
  try {
    const validatedData = tripRequestSchema.parse(data)
    return {
      success: true,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          value: err.code,
        })),
      }
    }
    return {
      success: false,
      errors: [{ message: "Validation failed" }],
    }
  }
}

export function validateBookingRequest(data: any): ValidationResult {
  const requiredFields = ["itinerary_id", "user_id", "items"]
  const errors = []

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (data.items && (!Array.isArray(data.items) || data.items.length === 0)) {
    errors.push("At least one booking item is required")
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    }
  }

  return {
    success: true,
    data,
  }
}
