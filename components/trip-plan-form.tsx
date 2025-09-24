"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, MapPin, DollarSign, Calendar, Sparkles, Plane, Hotel, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"

const tripPlanSchema = z.object({
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget_total: z.number().min(1, "Budget must be greater than 0"),
  currency: z.enum(["USD", "INR", "EUR", "GBP"]),
  num_travelers: z.number().min(1, "Number of travelers must be at least 1"),
  preferred_themes: z.array(z.string()).min(1, "Please select at least one theme"),
  accommodation_type: z.enum(["budget", "mid-range", "luxury", "any"]),
  transportation_preference: z.enum(["public", "private", "rental", "mixed", "any"]),
  meal_preference: z.enum(["local", "international", "vegetarian", "vegan", "any"]),
  activity_level: z.enum(["relaxed", "moderate", "active", "very-active"]),
  group_type: z.enum(["solo", "couple", "family", "friends", "business"]),
  special_occasions: z.string().optional(),
  accessibility_needs: z.string().optional(),
  additional_info: z.string().optional(),
})

type TripPlanFormData = z.infer<typeof tripPlanSchema>

const themes = [
  { id: "heritage", label: "Heritage & Culture", icon: "🏛️" },
  { id: "food", label: "Food & Cuisine", icon: "🍜" },
  { id: "adventure", label: "Adventure & Sports", icon: "🏔️" },
  { id: "relaxation", label: "Relaxation & Wellness", icon: "🧘" },
  { id: "nature", label: "Nature & Wildlife", icon: "🌿" },
  { id: "nightlife", label: "Nightlife & Entertainment", icon: "🎭" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "photography", label: "Photography", icon: "📸" },
]

const popularDestinations = {
  India: [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivali",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubli-Dharwad",
    "Bareilly",
    "Moradabad",
    "Mysore",
    "Gurgaon",
    "Aligarh",
    "Jalandhar",
    "Tiruchirappalli",
    "Bhubaneswar",
    "Salem",
    "Mira-Bhayandar",
    "Warangal",
    "Thiruvananthapuram",
    "Guntur",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai Nagar",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Nellore",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Rourkela",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Akola",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Jammu",
    "Sangli-Miraj & Kupwad",
    "Mangalore",
    "Erode",
    "Belgaum",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Jalgaon",
    "Udaipur",
    "Maheshtala",
    "Davanagere",
    "Kozhikode",
    "Kurnool",
    "Rajpur Sonarpur",
    "Rajahmundry",
    "Bokaro",
    "South Dumdum",
    "Bellary",
    "Patiala",
    "Gopalpur",
    "Agartala",
    "Bhagalpur",
    "Muzaffarnagar",
    "Bhatpara",
    "Panihati",
    "Latur",
    "Dhule",
    "Rohtak",
    "Korba",
    "Bhilwara",
    "Berhampur",
    "Muzaffarpur",
    "Ahmednagar",
    "Mathura",
    "Kollam",
    "Avadi",
    "Kadapa",
    "Kamarhati",
    "Sambalpur",
    "Bilaspur",
    "Shahjahanpur",
    "Satara",
    "Bijapur",
    "Rampur",
    "Shivamogga",
    "Chandrapur",
    "Junagadh",
    "Thrissur",
    "Alwar",
    "Bardhaman",
    "Kulti",
    "Kakinada",
    "Nizamabad",
    "Parbhani",
    "Tumkur",
    "Khammam",
    "Ozhukarai",
    "Bihar Sharif",
    "Panipat",
    "Darbhanga",
    "Bally",
    "Aizawl",
    "Dewas",
    "Ichalkaranji",
  ],
  "United States": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington DC",
    "Boston",
    "El Paso",
    "Nashville",
    "Detroit",
    "Oklahoma City",
    "Portland",
    "Las Vegas",
    "Memphis",
    "Louisville",
    "Baltimore",
    "Milwaukee",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Mesa",
    "Kansas City",
    "Atlanta",
    "Long Beach",
    "Colorado Springs",
    "Raleigh",
    "Miami",
    "Virginia Beach",
    "Omaha",
    "Oakland",
    "Minneapolis",
    "Tulsa",
    "Arlington",
    "Tampa",
    "New Orleans",
    "Wichita",
    "Cleveland",
    "Bakersfield",
    "Aurora",
    "Anaheim",
    "Honolulu",
    "Santa Ana",
    "Riverside",
    "Corpus Christi",
    "Lexington",
    "Stockton",
    "Henderson",
    "Saint Paul",
    "St. Louis",
    "Cincinnati",
    "Pittsburgh",
    "Greensboro",
    "Anchorage",
    "Plano",
    "Lincoln",
    "Orlando",
    "Irvine",
    "Newark",
    "Toledo",
    "Durham",
    "Chula Vista",
    "Fort Wayne",
    "Jersey City",
    "St. Petersburg",
    "Laredo",
    "Madison",
    "Chandler",
    "Buffalo",
    "Lubbock",
    "Scottsdale",
    "Reno",
    "Glendale",
    "Gilbert",
    "Winston-Salem",
    "North Las Vegas",
    "Norfolk",
    "Chesapeake",
    "Garland",
    "Irving",
    "Hialeah",
    "Fremont",
    "Boise",
    "Richmond",
    "Baton Rouge",
    "Spokane",
    "Des Moines",
    "Tacoma",
    "San Bernardino",
    "Modesto",
    "Fontana",
    "Santa Clarita",
    "Birmingham",
    "Oxnard",
    "Fayetteville",
    "Moreno Valley",
    "Akron",
    "Huntington Beach",
    "Little Rock",
    "Augusta",
    "Amarillo",
    "Mobile",
    "Grand Rapids",
    "Salt Lake City",
    "Tallahassee",
    "Huntsville",
    "Grand Prairie",
    "Knoxville",
    "Worcester",
    "Newport News",
    "Brownsville",
    "Overland Park",
    "Santa Rosa",
    "Providence",
    "Garden Grove",
    "Chattanooga",
    "Oceanside",
    "Jackson",
    "Fort Lauderdale",
    "Santa Clara",
    "Rancho Cucamonga",
    "Port St. Lucie",
    "Tempe",
    "Ontario",
    "Vancouver",
    "Cape Coral",
    "Sioux Falls",
    "Springfield",
    "Peoria",
    "Pembroke Pines",
    "Elk Grove",
    "Lancaster",
    "Corona",
    "Eugene",
    "Palmdale",
    "Salinas",
    "Pasadena",
    "Fort Collins",
    "Hayward",
    "Pomona",
    "Cary",
    "Rockford",
    "Alexandria",
    "Escondido",
    "McKinney",
    "Joliet",
    "Sunnyvale",
    "Torrance",
    "Bridgeport",
    "Lakewood",
    "Hollywood",
    "Paterson",
    "Naperville",
    "Syracuse",
    "Mesquite",
    "Dayton",
    "Savannah",
    "Clarksville",
    "Orange",
    "Fullerton",
    "Killeen",
    "Frisco",
    "Hampton",
    "McAllen",
    "Warren",
    "Bellevue",
    "West Valley City",
    "Columbia",
    "Olathe",
    "Sterling Heights",
    "New Haven",
    "Miramar",
    "Waco",
    "Thousand Oaks",
    "Cedar Rapids",
    "Charleston",
    "Visalia",
    "Topeka",
    "Elizabeth",
    "Gainesville",
    "Thornton",
    "Roseville",
    "Carrollton",
    "Coral Springs",
    "Stamford",
    "Simi Valley",
    "Concord",
    "Hartford",
    "Kent",
    "Lafayette",
    "Midland",
    "Surprise",
    "Denton",
    "Victorville",
    "Evansville",
    "Abilene",
    "Athens",
    "Vallejo",
    "Allentown",
    "Norman",
    "Beaumont",
    "Independence",
    "Murfreesboro",
    "Ann Arbor",
    "Fargo",
    "Wilmington",
    "Golden",
    "Ventura",
    "Carlsbad",
  ],
  "United Kingdom": [
    "London",
    "Manchester",
    "Glasgow",
    "Liverpool",
    "Leeds",
    "Sheffield",
    "Edinburgh",
    "Bristol",
    "Cardiff",
    "Leicester",
    "Wakefield",
    "Coventry",
    "Nottingham",
    "Newcastle upon Tyne",
    "Sunderland",
    "Belfast",
    "Brighton",
    "Hull",
    "Plymouth",
    "Stoke-on-Trent",
    "Wolverhampton",
    "Derby",
    "Swansea",
    "Southampton",
    "Salford",
    "Aberdeen",
    "Westminster",
    "Portsmouth",
    "York",
    "Peterborough",
    "Dundee",
    "Oxford",
    "Newport",
    "Preston",
    "St Albans",
    "Norwich",
    "Chester",
    "Cambridge",
    "Salisbury",
    "Exeter",
    "Gloucester",
    "Lisburn",
    "Chichester",
    "Winchester",
    "Londonderry",
    "Carlisle",
    "Bath",
    "Hereford",
    "Armagh",
    "Inverness",
    "Stirling",
    "Canterbury",
    "Lichfield",
    "Newry",
    "Ripon",
    "Bangor",
    "Truro",
    "Ely",
    "Wells",
    "St Davids",
  ],
  Canada: [
    "Toronto",
    "Montreal",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Kitchener",
    "Victoria",
    "Halifax",
    "Oshawa",
    "Windsor",
    "Saskatoon",
    "St. Catharines",
    "Regina",
    "Sherbrooke",
    "Barrie",
    "Kelowna",
    "Abbotsford",
    "Sudbury",
    "Kingston",
    "Saguenay",
    "Trois-Rivières",
    "Guelph",
    "Whitby",
    "Coquitlam",
    "Saanich",
    "Burlington",
    "Oakville",
    "Burnaby",
    "Richmond Hill",
    "Thunder Bay",
    "Vaughan",
    "Mississauga",
    "Laval",
    "Markham",
    "Gatineau",
    "Longueuil",
    "Langley",
    "Lévis",
    "Kamloops",
    "Nanaimo",
    "Chicoutimi",
    "Red Deer",
    "Lethbridge",
    "Medicine Hat",
    "Brantford",
    "Moncton",
    "Saint John",
    "Belleville",
    "Sarnia",
  ],
  Australia: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Newcastle",
    "Canberra",
    "Sunshine Coast",
    "Wollongong",
    "Hobart",
    "Geelong",
    "Townsville",
    "Cairns",
    "Darwin",
    "Toowoomba",
    "Ballarat",
    "Bendigo",
    "Albury",
    "Launceston",
    "Mackay",
    "Rockhampton",
    "Bunbury",
    "Bundaberg",
    "Coffs Harbour",
    "Wagga Wagga",
    "Hervey Bay",
    "Mildura",
    "Shepparton",
    "Port Macquarie",
    "Gladstone",
    "Tamworth",
    "Traralgon",
    "Bowral",
    "Geraldton",
    "Dubbo",
    "Nowra",
    "Warrnambool",
  ],
}

const allCountries = Object.keys(popularDestinations)

export function TripPlanForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [originCountry, setOriginCountry] = useState<string>("")
  const [destinationCountry, setDestinationCountry] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripPlanFormData>({
    resolver: zodResolver(tripPlanSchema),
    defaultValues: {
      currency: "USD",
      num_travelers: 1,
      preferred_themes: [],
      accommodation_type: "any",
      transportation_preference: "any",
      meal_preference: "any",
      activity_level: "moderate",
      group_type: "solo",
    },
  })

  const handleThemeChange = (themeId: string, checked: boolean) => {
    const newThemes = checked ? [...selectedThemes, themeId] : selectedThemes.filter((id) => id !== themeId)
    setSelectedThemes(newThemes)
    setValue("preferred_themes", newThemes)
  }

  const onSubmit = async (data: TripPlanFormData) => {
    setIsLoading(true)
    console.log("[v0] Submitting form data:", data)

    try {
      const response = await fetch("/api/v1/itineraries/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] API error:", errorData)
        throw new Error(errorData.error || "Failed to generate itinerary")
      }

      const result = await response.json()
      console.log("[v0] API success result:", result)
      router.push(`/results/${result.id}`)
    } catch (error) {
      console.error("[v0] Error generating itinerary:", error)
      alert("Failed to generate itinerary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Plan Your Perfect Trip</h1>
        <p className="text-lg text-muted-foreground">
          Tell us about your dream destination and we'll create three personalized itineraries for you
        </p>
      </div>

      <Card className="w-full shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            Trip Details
          </CardTitle>
          <CardDescription className="text-base">
            Provide detailed information to generate three personalized itineraries tailored to your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Destination Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Where are you going?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">From</Label>
                  <div className="space-y-3">
                    <Select onValueChange={setOriginCountry}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select origin country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                        {allCountries.map((country) => (
                          <SelectItem key={country} value={country} className="hover:bg-accent/20">
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {originCountry && (
                      <Select onValueChange={(value) => setValue("origin", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select origin city" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50 max-h-60">
                          {popularDestinations[originCountry as keyof typeof popularDestinations]?.map((city) => (
                            <SelectItem key={`${originCountry}-${city}`} value={city} className="hover:bg-accent/20">
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {errors.origin && <p className="text-sm text-destructive">{errors.origin.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">To</Label>
                  <div className="space-y-3">
                    <Select onValueChange={setDestinationCountry}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select destination country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                        {allCountries.map((country) => (
                          <SelectItem key={country} value={country} className="hover:bg-accent/20">
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {destinationCountry && (
                      <Select onValueChange={(value) => setValue("destination", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select destination city" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50 max-h-60">
                          {popularDestinations[destinationCountry as keyof typeof popularDestinations]?.map((city) => (
                            <SelectItem key={`${destinationCountry}-${city}`} value={city} className="hover:bg-accent/20">
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {errors.destination && <p className="text-sm text-destructive">{errors.destination.message}</p>}
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">When are you traveling?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                    className={`h-12 ${errors.start_date ? "border-destructive" : ""}`}
                  />
                  {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date" className="text-sm font-medium">
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register("end_date")}
                    className={`h-12 ${errors.end_date ? "border-destructive" : ""}`}
                  />
                  {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
                </div>
              </div>
            </div>

            {/* Budget & Travelers Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Budget & Group Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget_total" className="text-sm font-medium">
                    Total Budget
                  </Label>
                  <Input
                    id="budget_total"
                    type="number"
                    placeholder="e.g., 30000"
                    {...register("budget_total", { valueAsNumber: true })}
                    className={`h-12 ${errors.budget_total ? "border-destructive" : ""}`}
                  />
                  {errors.budget_total && <p className="text-sm text-destructive">{errors.budget_total.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-medium">
                    Currency
                  </Label>
                  <Select onValueChange={(value) => setValue("currency", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="USD" className="hover:bg-accent/20">
                        USD ($)
                      </SelectItem>
                      <SelectItem value="INR" className="hover:bg-accent/20">
                        INR (₹)
                      </SelectItem>
                      <SelectItem value="EUR" className="hover:bg-accent/20">
                        EUR (€)
                      </SelectItem>
                      <SelectItem value="GBP" className="hover:bg-accent/20">
                        GBP (£)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="num_travelers" className="text-sm font-medium">
                    Number of Travelers
                  </Label>
                  <Input
                    id="num_travelers"
                    type="number"
                    min="1"
                    max="10"
                    {...register("num_travelers", { valueAsNumber: true })}
                    className={`h-12 ${errors.num_travelers ? "border-destructive" : ""}`}
                  />
                  {errors.num_travelers && <p className="text-sm text-destructive">{errors.num_travelers.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="group_type" className="text-sm font-medium">
                    Group Type
                  </Label>
                  <Select onValueChange={(value) => setValue("group_type", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select group type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="solo" className="hover:bg-accent/20">
                        Solo Travel
                      </SelectItem>
                      <SelectItem value="couple" className="hover:bg-accent/20">
                        Couple
                      </SelectItem>
                      <SelectItem value="family" className="hover:bg-accent/20">
                        Family with Kids
                      </SelectItem>
                      <SelectItem value="friends" className="hover:bg-accent/20">
                        Friends Group
                      </SelectItem>
                      <SelectItem value="business" className="hover:bg-accent/20">
                        Business Travel
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_level" className="text-sm font-medium">
                    Activity Level
                  </Label>
                  <Select onValueChange={(value) => setValue("activity_level", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="relaxed" className="hover:bg-accent/20">
                        Relaxed (2-3 activities/day)
                      </SelectItem>
                      <SelectItem value="moderate" className="hover:bg-accent/20">
                        Moderate (4-5 activities/day)
                      </SelectItem>
                      <SelectItem value="active" className="hover:bg-accent/20">
                        Active (6-7 activities/day)
                      </SelectItem>
                      <SelectItem value="very-active" className="hover:bg-accent/20">
                        Very Active (8+ activities/day)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Travel Preferences</h3>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">What interests you? (Select at least one)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                    >
                      <Checkbox
                        id={theme.id}
                        checked={selectedThemes.includes(theme.id)}
                        onCheckedChange={(checked) => handleThemeChange(theme.id, checked as boolean)}
                      />
                      <Label htmlFor={theme.id} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        <span>{theme.icon}</span>
                        {theme.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.preferred_themes && (
                  <p className="text-sm text-destructive">{errors.preferred_themes.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    Accommodation Preference
                  </Label>
                  <Select onValueChange={(value) => setValue("accommodation_type", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="any" className="hover:bg-accent/20">
                        Any
                      </SelectItem>
                      <SelectItem value="budget" className="hover:bg-accent/20">
                        Budget (Hostels, Budget Hotels)
                      </SelectItem>
                      <SelectItem value="mid-range" className="hover:bg-accent/20">
                        Mid-Range (3-4 Star Hotels)
                      </SelectItem>
                      <SelectItem value="luxury" className="hover:bg-accent/20">
                        Luxury (5 Star Hotels, Resorts)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Transportation Preference
                  </Label>
                  <Select onValueChange={(value) => setValue("transportation_preference", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="any" className="hover:bg-accent/20">
                        Any
                      </SelectItem>
                      <SelectItem value="public" className="hover:bg-accent/20">
                        Public Transport
                      </SelectItem>
                      <SelectItem value="private" className="hover:bg-accent/20">
                        Private Car/Taxi
                      </SelectItem>
                      <SelectItem value="rental" className="hover:bg-accent/20">
                        Rental Car
                      </SelectItem>
                      <SelectItem value="mixed" className="hover:bg-accent/20">
                        Mixed Options
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Food Preference
                  </Label>
                  <Select onValueChange={(value) => setValue("meal_preference", value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-md border border-border/50">
                      <SelectItem value="any" className="hover:bg-accent/20">
                        Any
                      </SelectItem>
                      <SelectItem value="local" className="hover:bg-accent/20">
                        Local Cuisine
                      </SelectItem>
                      <SelectItem value="international" className="hover:bg-accent/20">
                        International
                      </SelectItem>
                      <SelectItem value="vegetarian" className="hover:bg-accent/20">
                        Vegetarian
                      </SelectItem>
                      <SelectItem value="vegan" className="hover:bg-accent/20">
                        Vegan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="special_occasions" className="text-sm font-medium">
                    Special Occasions (Optional)
                  </Label>
                  <Input
                    id="special_occasions"
                    placeholder="e.g., Anniversary, Birthday, Honeymoon"
                    {...register("special_occasions")}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessibility_needs" className="text-sm font-medium">
                    Accessibility Needs (Optional)
                  </Label>
                  <Input
                    id="accessibility_needs"
                    placeholder="e.g., Wheelchair accessible, Mobility assistance"
                    {...register("accessibility_needs")}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info" className="text-sm font-medium">
                  Additional Information (Optional)
                </Label>
                <Textarea
                  id="additional_info"
                  placeholder="Any specific requirements, dietary restrictions, must-see places, or special requests..."
                  {...register("additional_info")}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Generating Your Personalized Itineraries...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generate Custom Itineraries
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
