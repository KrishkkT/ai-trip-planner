import { MapPin, Users, Star, Clock } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: MapPin,
      value: "500+",
      label: "Destinations Covered",
      description: "From bustling cities to hidden gems",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Happy Travelers",
      description: "Satisfied customers worldwide",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      description: "Based on user reviews",
    },
    {
      icon: Clock,
      value: "< 2 min",
      label: "Planning Time",
      description: "Get your itinerary instantly",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Travelers Worldwide</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of travelers who have discovered their perfect trips with our AI-powered planning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
