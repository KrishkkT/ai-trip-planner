import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Clock,
  ExternalLink,
  Globe,
  Shield,
  Users,
  Zap,
  Heart,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react"

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description:
      "Advanced Google Gemini AI analyzes your preferences to create personalized itineraries that match your travel style perfectly.",
    badge: "Smart AI",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get three complete travel itineraries in under 30 seconds. No more hours of research and planning.",
    badge: "Lightning Fast",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Plan trips to destinations worldwide with local insights, hidden gems, and authentic experiences.",
    badge: "500+ Cities",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: ExternalLink,
    title: "Easy Booking",
    description:
      "Seamlessly connect to EaseMyTrip to book flights, hotels, and activities with trusted travel partners.",
    badge: "One-Click",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Users,
    title: "Group Planning",
    description: "Perfect for solo travelers, couples, families, or groups with customized recommendations for each.",
    badge: "All Groups",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "Your data is protected with enterprise-grade security. Plan with confidence using our AI-powered platform.",
    badge: "Secure",
    color: "from-indigo-500/20 to-purple-500/20",
  },
]

const additionalFeatures = [
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get live updates on weather, events, and local conditions for your destination.",
  },
  {
    icon: Heart,
    title: "Personalized Recommendations",
    description: "AI learns your preferences to suggest activities and places you'll love.",
  },
  {
    icon: Star,
    title: "Premium Experiences",
    description: "Access exclusive tours, restaurants, and accommodations not found elsewhere.",
  },
  {
    icon: TrendingUp,
    title: "Budget Optimization",
    description: "Smart budget allocation across accommodation, food, activities, and transport.",
  },
  {
    icon: MapPin,
    title: "Local Insights",
    description: "Discover hidden gems and authentic experiences recommended by locals.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Easily modify your itinerary with drag-and-drop scheduling and real-time updates.",
  },
]

export function EnhancedFeatures() {
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

        {/* Main Features Grid */}
        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {mainFeatures.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm overflow-hidden relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="h-1 bg-gradient-to-r from-primary/50 via-accent to-primary/50 group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                <CardHeader className="pb-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Plus many more powerful features</h3>
            <p className="text-lg text-muted-foreground">
              Discover all the tools and capabilities that make trip planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
