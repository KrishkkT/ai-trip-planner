import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Sparkles, ExternalLink, CheckCircle } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: MapPin,
    title: "Tell us your preferences",
    description:
      "Share your destination, dates, budget, and travel style. The more details, the better your personalized itinerary.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "AI creates your itineraries",
    description:
      "Our Google Gemini AI analyzes thousands of options to generate three personalized itineraries: Budget, Balanced, and Premium.",
  },
  {
    step: 3,
    icon: ExternalLink,
    title: "Book on EaseMyTrip",
    description:
      "Review your AI-generated options and seamlessly book flights, hotels, and activities through our trusted partner EaseMyTrip.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Enjoy your perfect trip",
    description: "Follow your personalized itinerary and create unforgettable memories on your dream vacation.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-secondary/20 via-secondary/30 to-secondary/20 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">How it works</h2>
          <p className="mt-6 text-xl leading-8 text-muted-foreground text-pretty">
            From idea to itinerary in four simple steps. Let AI handle the complexity while you focus on the excitement.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <Card
                key={step.step}
                className="group relative hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-primary/50 via-accent to-primary/50 group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>

                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-accent/30 transform -translate-y-1/2" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
