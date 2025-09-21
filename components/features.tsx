import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, ExternalLink, Globe, Shield, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description:
      "Advanced Google Gemini AI analyzes your preferences to create personalized itineraries that match your travel style perfectly.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get three complete travel itineraries in under 30 seconds. No more hours of research and planning.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Plan trips to destinations worldwide with local insights, hidden gems, and authentic experiences.",
  },
  {
    icon: ExternalLink,
    title: "Easy Booking",
    description:
      "Seamlessly connect to EaseMyTrip to book flights, hotels, and activities with trusted travel partners.",
  },
  {
    icon: Users,
    title: "Group Planning",
    description: "Perfect for solo travelers, couples, families, or groups with customized recommendations for each.",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "Your data is protected with enterprise-grade security. Plan with confidence using our AI-powered platform.",
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Everything you need for the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              perfect trip
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-muted-foreground text-pretty">
            Our AI-powered platform combines intelligent planning with seamless booking to make travel planning
            effortless and enjoyable.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-primary/50 via-accent to-primary/50 group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
