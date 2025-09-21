import Link from "next/link"
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-secondary/50 to-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">AI Trip Planner</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Powered by Google Gemini AI and integrated with EaseMyTrip, we create personalized travel experiences that
              match your unique preferences and budget.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@aitripplanner.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-primary" />
                <Link
                  href="https://www.easemytrip.com/"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  Powered by EaseMyTrip
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/plan" className="hover:text-primary transition-colors flex items-center gap-2">
                  Plan Trip
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.easemytrip.com/"
                  target="_blank"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  Book on EaseMyTrip
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center md:text-left text-sm text-muted-foreground">
              © 2025 AI Trip Planner. Built for Google GenAI Exchange Hackathon.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <span className="font-semibold text-primary">Google Gemini AI</span>
              <span>+</span>
              <span className="font-semibold text-primary">EaseMyTrip</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
