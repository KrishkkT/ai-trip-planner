# Sequence Diagrams

## Generate → Book Flow

This document outlines the complete user journey from trip planning to booking confirmation.

### 1. Trip Planning Sequence

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant RateLimit
    participant Validator
    participant AIOrchestrator
    participant GeminiAI
    participant SchemaValidator
    participant Firestore
    
    User->>Frontend: Fill trip planning form
    User->>Frontend: Submit preferences
    
    Frontend->>API: POST /api/v1/itineraries/generate
    Note over Frontend,API: Request includes origin, destination,<br/>dates, budget, themes, travelers
    
    API->>RateLimit: Check rate limits
    RateLimit-->>API: Rate limit OK
    
    API->>Validator: Validate trip request
    Validator-->>API: Validation passed
    
    API->>AIOrchestrator: Generate itinerary
    
    AIOrchestrator->>GeminiAI: Send canonical prompt
    Note over AIOrchestrator,GeminiAI: Prompt includes user preferences<br/>and JSON schema requirements
    
    GeminiAI-->>AIOrchestrator: Return JSON response
    
    AIOrchestrator->>SchemaValidator: Validate response
    
    alt Schema validation fails
        SchemaValidator-->>AIOrchestrator: Validation failed
        AIOrchestrator->>GeminiAI: Retry with lower temperature
        GeminiAI-->>AIOrchestrator: Return corrected JSON
        AIOrchestrator->>SchemaValidator: Re-validate
    end
    
    SchemaValidator-->>AIOrchestrator: Validation passed
    
    AIOrchestrator->>Firestore: Save itinerary
    Firestore-->>AIOrchestrator: Return itinerary ID
    
    AIOrchestrator-->>API: Return success with ID
    API-->>Frontend: Return itinerary ID
    
    Frontend->>User: Redirect to results page
\`\`\`

### 2. Itinerary Display Sequence

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Firestore
    
    User->>Frontend: Navigate to results page
    
    Frontend->>API: GET /api/v1/itineraries/{id}
    API->>Firestore: Fetch itinerary data
    Firestore-->>API: Return itinerary
    API-->>Frontend: Return itinerary data
    
    Frontend->>User: Display 3 itinerary options
    Note over Frontend,User: Shows Balanced, Budget,<br/>and Experience options
    
    User->>Frontend: Select "View Details"
    Frontend->>User: Show detailed itinerary
    Note over Frontend,User: Day-by-day breakdown with<br/>activities, hotels, costs
\`\`\`

### 3. Booking Initiation Sequence

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant BookingModal
    participant LocalStorage
    
    User->>Frontend: Click "Book This Itinerary"
    Frontend->>BookingModal: Open booking modal
    
    BookingModal->>LocalStorage: Check authentication
    
    alt User not authenticated
        LocalStorage-->>BookingModal: No auth token
        BookingModal->>Frontend: Redirect to login
        Frontend->>User: Show login page
    else User authenticated
        LocalStorage-->>BookingModal: Return user data
        BookingModal->>User: Show booking options
        Note over BookingModal,User: Display selectable items:<br/>hotels, activities, flights
    end
    
    User->>BookingModal: Select items to book
    User->>BookingModal: Click "Proceed to Payment"
\`\`\`

### 4. Booking Creation Sequence

\`\`\`mermaid
sequenceDiagram
    participant BookingModal
    participant API
    participant AuthMiddleware
    participant EMTAdapter
    participant Firestore
    participant PaymentGateway
    
    BookingModal->>API: POST /api/v1/bookings/create
    Note over BookingModal,API: Includes selected items,<br/>user ID, itinerary ID
    
    API->>AuthMiddleware: Verify JWT token
    AuthMiddleware-->>API: Authentication successful
    
    API->>EMTAdapter: Create booking request
    
    alt Development mode (no EMT API key)
        EMTAdapter->>EMTAdapter: Generate mock booking
        EMTAdapter-->>API: Return mock checkout URL
    else Production mode
        EMTAdapter->>PaymentGateway: Create real booking
        PaymentGateway-->>EMTAdapter: Return checkout URL
        EMTAdapter-->>API: Return real checkout URL
    end
    
    API->>Firestore: Save booking record
    Firestore-->>API: Confirm booking saved
    
    API-->>BookingModal: Return checkout URL
    BookingModal->>PaymentGateway: Redirect to payment
\`\`\`

### 5. Payment Processing Sequence

\`\`\`mermaid
sequenceDiagram
    participant User
    participant PaymentGateway
    participant CheckoutPage
    participant Firestore
    participant EmailService
    
    User->>PaymentGateway: Complete payment details
    PaymentGateway->>PaymentGateway: Process payment
    
    alt Payment successful
        PaymentGateway->>CheckoutPage: Redirect to success page
        CheckoutPage->>Firestore: Update booking status
        Firestore-->>CheckoutPage: Confirm status update
        
        CheckoutPage->>EmailService: Send confirmation email
        EmailService-->>User: Delivery confirmation email
        
        CheckoutPage->>User: Show booking confirmation
        Note over CheckoutPage,User: Display booking details,<br/>receipt, and next steps
        
    else Payment failed
        PaymentGateway->>CheckoutPage: Redirect to failure page
        CheckoutPage->>User: Show payment error
        CheckoutPage->>User: Option to retry payment
    end
\`\`\`

### 6. Real-time Event Processing Sequence

\`\`\`mermaid
sequenceDiagram
    participant ExternalSystem
    participant WebhookAPI
    participant RealtimeProcessor
    participant Firestore
    participant NotificationService
    participant User
    
    ExternalSystem->>WebhookAPI: POST /api/v1/webhooks/realtime
    Note over ExternalSystem,WebhookAPI: Weather alert, flight delay,<br/>venue closure, etc.
    
    WebhookAPI->>WebhookAPI: Validate webhook signature
    
    WebhookAPI->>RealtimeProcessor: Process event
    
    RealtimeProcessor->>Firestore: Find affected itineraries
    Firestore-->>RealtimeProcessor: Return matching itineraries
    
    RealtimeProcessor->>RealtimeProcessor: Apply adjustment rules
    Note over RealtimeProcessor: Generate alternative activities,<br/>adjust schedules, update costs
    
    RealtimeProcessor->>Firestore: Update affected itineraries
    Firestore-->>RealtimeProcessor: Confirm updates
    
    RealtimeProcessor->>NotificationService: Send user notifications
    NotificationService->>User: Push notification/email
    Note over NotificationService,User: "Your itinerary has been updated<br/>due to weather conditions"
    
    RealtimeProcessor-->>WebhookAPI: Return processing result
    WebhookAPI-->>ExternalSystem: Confirm event processed
\`\`\`

### 7. Dashboard Access Sequence

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant LocalStorage
    participant API
    participant Firestore
    
    User->>Frontend: Navigate to dashboard
    
    Frontend->>LocalStorage: Check authentication
    
    alt User not authenticated
        LocalStorage-->>Frontend: No auth token
        Frontend->>User: Redirect to login
    else User authenticate
