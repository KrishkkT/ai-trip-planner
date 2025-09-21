import { render, screen, waitFor } from "@testing-library/react"
import { ItineraryResults } from "@/components/itinerary-results"
import useSWR from "swr"
import jest from "jest" // Import jest to declare it

// Mock SWR
jest.mock("swr")
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

const mockItineraryData = {
  itineraries: [
    {
      id: "balanced_123",
      type: "balanced",
      title: "Balanced Paris Adventure",
      description: "Perfect mix of culture and cuisine",
      total_cost: { amount: 1500, currency: "USD" },
      days: [
        {
          day: 1,
          date: "2025-10-05",
          activities: [],
          accommodation: {
            name: "Test Hotel",
            type: "hotel",
            cost: { amount: 200, currency: "USD" },
            location: { name: "Paris Center", coordinates: { lat: 48.8566, lng: 2.3522 } },
          },
          meals: [],
          transportation: { type: "metro", cost: { amount: 20, currency: "USD" } },
          daily_cost: { amount: 220, currency: "USD" },
        },
      ],
      highlights: ["Visit Eiffel Tower", "Seine River Cruise", "Louvre Museum"],
      best_for: ["First-time visitors", "Culture lovers"],
    },
  ],
  metadata: {
    generated_at: "2025-01-01T00:00:00Z",
    confidence_score: 0.9,
    request_id: "test_request",
  },
}

describe("ItineraryResults Component", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001/api/v1"
  })

  it("renders loading state initially", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    })

    render(<ItineraryResults itineraryId="test_id" />)

    expect(screen.getAllByTestId("skeleton")).toHaveLength(3)
  })

  it("renders itinerary cards when data is loaded", async () => {
    mockUseSWR.mockReturnValue({
      data: mockItineraryData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    })

    render(<ItineraryResults itineraryId="test_id" />)

    await waitFor(() => {
      expect(screen.getByText("Balanced Paris Adventure")).toBeInTheDocument()
      expect(screen.getByText("Perfect mix of culture and cuisine")).toBeInTheDocument()
      expect(screen.getByText("USD 1,500")).toBeInTheDocument()
    })
  })

  it("displays confidence score", async () => {
    mockUseSWR.mockReturnValue({
      data: mockItineraryData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    })

    render(<ItineraryResults itineraryId="test_id" />)

    await waitFor(() => {
      expect(screen.getByText("90% Match")).toBeInTheDocument()
    })
  })

  it("renders error state when data fails to load", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("Failed to fetch"),
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    })

    render(<ItineraryResults itineraryId="test_id" />)

    expect(screen.getByText("Failed to load itineraries. Please try again.")).toBeInTheDocument()
    expect(screen.getByText("Retry")).toBeInTheDocument()
  })

  it("displays highlights and best_for tags", async () => {
    mockUseSWR.mockReturnValue({
      data: mockItineraryData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    })

    render(<ItineraryResults itineraryId="test_id" />)

    await waitFor(() => {
      expect(screen.getByText("Visit Eiffel Tower")).toBeInTheDocument()
      expect(screen.getByText("First-time visitors")).toBeInTheDocument()
      expect(screen.getByText("Culture lovers")).toBeInTheDocument()
    })
  })
})
