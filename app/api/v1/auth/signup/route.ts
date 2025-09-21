import { type NextRequest, NextResponse } from "next/server"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { saveUser } from "@/lib/firestore"
import { generateJWT } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    if (!auth) {
      return NextResponse.json({ error: "Authentication service not configured" }, { status: 503 })
    }

    const { email, password, displayName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    if (displayName) {
      await updateProfile(user, { displayName })
    }

    // Save user to Firestore
    await saveUser({
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    })

    // Generate JWT token
    const token = await generateJWT({
      uid: user.uid,
      email: user.email,
    })

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
      },
      token,
    })
  } catch (error: any) {
    console.error("Signup error:", error)

    let errorMessage = "Signup failed"
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
    } else if (error.code === "auth/invalid-api-key") {
      errorMessage = "Authentication service not configured"
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
