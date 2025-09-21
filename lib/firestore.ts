import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { v4 as uuidv4 } from "uuid"

// Initialize Firebase Admin
let db: any = null
let isFirebaseConfigured = false

// Check if all required Firebase environment variables are present
const hasFirebaseConfig =
  process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL

// Initialize Firebase Admin only if configuration is available
if (hasFirebaseConfig && !getApps().length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }

    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })

    db = getFirestore()
    isFirebaseConfigured = true
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    isFirebaseConfigured = false
  }
}

function ensureFirebaseConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Please set up Firebase environment variables.")
  }
}

export async function saveItinerary(itineraryData: any) {
  try {
    ensureFirebaseConfigured()
    const id = uuidv4()
    const docRef = db.collection("itineraries").doc(id)

    const itineraryDoc = {
      id,
      ...itineraryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
    }

    await docRef.set(itineraryDoc)

    return itineraryDoc
  } catch (error) {
    console.error("Error saving itinerary:", error)
    throw new Error("Failed to save itinerary")
  }
}

export async function getItinerary(id: string) {
  try {
    ensureFirebaseConfigured()
    const docRef = db.collection("itineraries").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return null
    }

    return doc.data()
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw new Error("Failed to retrieve itinerary")
  }
}

export async function saveBooking(bookingData: any) {
  try {
    ensureFirebaseConfigured()
    const id = uuidv4()
    const docRef = db.collection("bookings").doc(id)

    const bookingDoc = {
      id,
      ...bookingData,
      created_at: new Date().toISOString(),
      status: "pending",
    }

    await docRef.set(bookingDoc)

    return bookingDoc
  } catch (error) {
    console.error("Error saving booking:", error)
    throw new Error("Failed to save booking")
  }
}

export async function saveUser(userData: any) {
  try {
    ensureFirebaseConfigured()
    const docRef = db.collection("users").doc(userData.uid)

    const userDoc = {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    await docRef.set(userDoc, { merge: true })

    return userDoc
  } catch (error) {
    console.error("Error saving user:", error)
    throw new Error("Failed to save user")
  }
}

export async function saveEvent(eventData: any) {
  try {
    ensureFirebaseConfigured()
    const id = uuidv4()
    const docRef = db.collection("events").doc(id)

    const eventDoc = {
      id,
      ...eventData,
      created_at: new Date().toISOString(),
    }

    await docRef.set(eventDoc)

    return eventDoc
  } catch (error) {
    console.error("Error saving event:", error)
    throw new Error("Failed to save event")
  }
}
