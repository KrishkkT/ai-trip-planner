import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Trip Planner - Personalized Travel Itineraries",
  description:
    "Generate personalized travel itineraries with AI. Plan your perfect trip with smart recommendations and seamless booking.",
  generator: "v0.app",
  keywords: ["travel", "AI", "trip planner", "itinerary", "booking", "EaseMyTrip"],
  authors: [{ name: "AI Trip Planner Team" }],
  openGraph: {
    title: "AI Trip Planner - Personalized Travel Itineraries",
    description: "Generate personalized travel itineraries with AI",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
