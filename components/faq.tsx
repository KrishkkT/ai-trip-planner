import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How does the AI trip planner work?",
      answer:
        "Our AI analyzes your preferences, budget, dates, and interests to generate three personalized itineraries. Each itinerary includes detailed daily schedules, accommodation recommendations, transportation options, and cost breakdowns tailored to your specific needs.",
    },
    {
      question: "How accurate are the cost estimates?",
      answer:
        "Our cost estimates are based on current market data and are typically accurate within 10-15%. However, actual costs may vary depending on seasonal fluctuations, booking timing, and personal spending habits. We recommend using our estimates as a baseline for your budget planning.",
    },
    {
      question: "Can I modify the generated itineraries?",
      answer:
        "Yes! The generated itineraries serve as a comprehensive starting point. You can use them as-is or modify activities, accommodations, and schedules to better match your preferences. Each itinerary includes booking links and contact information for easy customization.",
    },
    {
      question: "What destinations are supported?",
      answer:
        "Our AI trip planner supports over 500 destinations worldwide, including major cities, popular tourist destinations, and hidden gems. From bustling metropolises to remote islands, we can help you plan trips to virtually any destination.",
    },
    {
      question: "How long does it take to generate an itinerary?",
      answer:
        "Itinerary generation typically takes less than 2 minutes. Our AI processes your preferences and creates three detailed, personalized itineraries with accommodation, transportation, and activity recommendations in real-time.",
    },
    {
      question: "Is the service free to use?",
      answer:
        "Yes, generating itineraries is completely free! You can create unlimited trip plans and access all our features without any cost. We make money through affiliate partnerships with hotels and booking platforms when you make reservations.",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our AI trip planner
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card/30 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
