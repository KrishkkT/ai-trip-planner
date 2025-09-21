const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const { v4: uuidv4 } = require("uuid")

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "demo-key",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "demo@demo.com",
}

if (!process.env.FIREBASE_PROJECT_ID) {
  console.log("Using Firestore emulator for development")
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
}

const app = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore(app)

// Sample data based on the India-specific example from requirements
const sampleTripRequest = {
  origin: "Mumbai,India",
  destination: "Udaipur,India",
  start_date: "2025-10-05",
  end_date: "2025-10-08",
  budget_total: 30000,
  currency: "INR",
  preferred_themes: ["heritage", "relaxation"],
  num_travelers: 2,
}

const sampleItinerary = {
  id: uuidv4(),
  itineraries: [
    {
      id: `balanced_${uuidv4()}`,
      type: "balanced",
      title: "Balanced Udaipur Heritage Experience",
      description: "Perfect mix of royal palaces, local culture, and relaxation in the City of Lakes",
      total_cost: {
        amount: 27000,
        currency: "INR",
      },
      days: [
        {
          day: 1,
          date: "2025-10-05",
          activities: [
            {
              name: "City Palace Complex Tour",
              type: "heritage",
              duration: "3 hours",
              cost: { amount: 1200, currency: "INR" },
              location: {
                name: "City Palace, Udaipur",
                coordinates: { lat: 24.5854, lng: 73.6833 },
              },
              booking_info: {
                bookable: true,
                provider: "EaseMyTrip",
                booking_url: "https://easemytrip.com/activities/udaipur-city-palace",
              },
            },
            {
              name: "Lake Pichola Boat Ride",
              type: "relaxation",
              duration: "1.5 hours",
              cost: { amount: 800, currency: "INR" },
              location: {
                name: "Lake Pichola",
                coordinates: { lat: 24.5714, lng: 73.6756 },
              },
              booking_info: {
                bookable: true,
                provider: "EaseMyTrip",
                booking_url: "https://easemytrip.com/activities/lake-pichola-boat",
              },
            },
          ],
          accommodation: {
            name: "Heritage Hotel Udaipur",
            type: "hotel",
            cost: { amount: 8000, currency: "INR" },
            location: {
              name: "Old City, Udaipur",
              coordinates: { lat: 24.5854, lng: 73.6833 },
            },
            booking_info: {
              bookable: true,
              provider: "EaseMyTrip",
              booking_url: "https://easemytrip.com/hotels/udaipur-heritage",
            },
          },
          meals: [
            { type: "breakfast", name: "Hotel Breakfast", cost: { amount: 500, currency: "INR" } },
            { type: "lunch", name: "Rajasthani Thali", cost: { amount: 800, currency: "INR" } },
            { type: "dinner", name: "Rooftop Restaurant", cost: { amount: 1200, currency: "INR" } },
          ],
          transportation: {
            type: "taxi",
            cost: { amount: 1000, currency: "INR" },
          },
          daily_cost: { amount: 9000, currency: "INR" },
        },
      ],
      highlights: [
        "Explore the magnificent City Palace complex",
        "Romantic boat ride on Lake Pichola",
        "Traditional Rajasthani cuisine experience",
        "Heritage hotel stay with royal ambiance",
      ],
      best_for: ["Heritage enthusiasts", "Couples", "Photography lovers"],
    },
  ],
  metadata: {
    generated_at: new Date().toISOString(),
    confidence_score: 0.9,
    request_id: uuidv4(),
    model_version: "seed-data-v1",
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
}

const sampleUser = {
  uid: "demo_user_123",
  email: "demo@example.com",
  displayName: "Demo User",
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
}

async function seedDatabase() {
  try {
    console.log("🌱 Seeding development database...")

    // Create sample user
    await db.collection("users").doc(sampleUser.uid).set(sampleUser)
    console.log("✅ Created sample user")

    // Create sample itinerary
    await db.collection("itineraries").doc(sampleItinerary.id).set(sampleItinerary)
    console.log("✅ Created sample itinerary")

    // Create sample booking
    const sampleBooking = {
      id: uuidv4(),
      user_id: sampleUser.uid,
      itinerary_id: sampleItinerary.id,
      booking_id: "mock_booking_123",
      status: "confirmed",
      total_amount: 27000,
      currency: "INR",
      created_at: new Date().toISOString(),
    }

    await db.collection("bookings").doc(sampleBooking.id).set(sampleBooking)
    console.log("✅ Created sample booking")

    // Create sample event
    const sampleEvent = {
      id: uuidv4(),
      type: "weather",
      severity: "medium",
      date: "2025-10-06",
      location: {
        name: "Udaipur, India",
        coordinates: { lat: 24.5854, lng: 73.6833 },
      },
      description: "Light rain expected in the afternoon",
      created_at: new Date().toISOString(),
    }

    await db.collection("events").doc(sampleEvent.id).set(sampleEvent)
    console.log("✅ Created sample event")

    console.log("🎉 Database seeding completed successfully!")
    console.log("\nSample data created:")
    console.log(`- User ID: ${sampleUser.uid}`)
    console.log(`- Itinerary ID: ${sampleItinerary.id}`)
    console.log(`- Booking ID: ${sampleBooking.id}`)
    console.log(`- Event ID: ${sampleEvent.id}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
