"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MapPin } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-accent/5 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('/world-map-with-travel-destinations-and-landmarks.jpg')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 shadow-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                Powered by Google Gemini AI
                <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Beta
                </span>
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl text-balance leading-tight">
            Plan Your Perfect Trip with AI Intelligence
          </h1>

          <p className="mt-8 text-xl leading-8 text-muted-foreground text-pretty max-w-3xl mx-auto">
            Get personalized travel itineraries in seconds. From budget-friendly adventures to luxury experiences,
            our AI creates the perfect trip tailored to your preferences and budget.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/plan">
              <Button
                size="lg"
                className="group px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Planning Your Trip
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 hover:bg-accent/5 bg-transparent"
              >
                How It Works
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">AI-Powered</div>
                <div className="text-sm text-muted-foreground">Smart Planning</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                <div className="w-6 h-6 rounded-full bg-accent" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">Instant</div>
                <div className="text-sm text-muted-foreground">Booking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
