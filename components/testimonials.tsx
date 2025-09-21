import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "The AI trip planner created the most amazing itinerary for my Japan trip. Every recommendation was spot-on and saved me hours of research!",
      trip: "Tokyo & Kyoto Adventure",
    },
    {
      name: "Raj Patel",
      location: "Mumbai, India",
      rating: 5,
      text: "I was skeptical about AI planning, but this exceeded all expectations. The budget breakdown was perfect and the local recommendations were incredible.",
      trip: "European Backpacking",
    },
    {
      name: "Emma Wilson",
      location: "London, UK",
      rating: 5,
      text: "Planning our family vacation to Thailand was so easy. The itinerary considered our kids' needs and included perfect family-friendly activities.",
      trip: "Thailand Family Holiday",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">What Our Travelers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real travelers who used our AI trip planner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  <div className="text-sm text-primary font-medium mt-1">{testimonial.trip}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
