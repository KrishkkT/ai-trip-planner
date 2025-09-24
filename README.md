# AI-Powered Trip Planner

A full-stack web application that generates personalized travel itineraries using Google Gemini AI, built for the Google GenAI Exchange Hackathon with EaseMyTrip.

## 🚀 Features

- **AI-Powered Itinerary Generation**: Uses Google Gemini AI to create three distinct travel options (Balanced, Budget, Experience)
- **Comprehensive Trip Planning**: Day-by-day itineraries with activities, accommodations, meals, and transportation
- **Seamless Booking Integration**: Direct booking through EaseMyTrip with mock and real payment flows
- **Real-time Adjustments**: Dynamic itinerary updates based on weather, delays, and other events
- **User Authentication**: Secure Firebase-based authentication system
- **Responsive Design**: Modern, mobile-first UI built with Next.js and Tailwind CSS
- **Analytics Integration**: BigQuery integration for trip analytics and insights

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Google Gemini AI** - AI-powered itinerary generation
- **Firebase Admin** - Server-side Firebase integration
- **Express.js** - Additional server functionality

### Database & Auth
- **Firestore** - NoSQL database for storing itineraries and bookings
- **Firebase Auth** - User authentication and management
- **BigQuery** - Analytics and data warehousing

### External Integrations
- **EaseMyTrip API** - Travel booking and inventory
- **Google Maps API** - Location data and mapping
- **Gemini AI API** - Natural language processing and generation

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Google Cloud project with Gemini AI API access
- Google Maps API key
- EaseMyTrip API credentials (optional for development)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd ai-trip-planner
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template and fill in your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:

\`\`\`env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# EaseMyTrip Integration (optional for development)
EMT_API_KEY=your_emt_api_key_here
EMT_API_URL=https://api.easemytrip.com/v1

# Authentication
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
\`\`\`

### 3. Development Setup

#### Option A: Local Development
\`\`\`bash
npm run dev
\`\`\`

#### Option B: Docker Development
\`\`\`bash
docker-compose up
\`\`\`

### 4. Database Seeding

Seed the database with sample data:

\`\`\`bash
npm run seed
\`\`\`

## 🔑 Getting Your Gemini API Key

To get your Google Gemini API key:

1. **Visit Google AI Studio**: Go to [https://aistudio.google.com/](https://aistudio.google.com/)
2. **Sign in**: Use your Google account to sign in
3. **Create API Key**: Click "Get API Key" and then "Create API Key"
4. **Copy the Key**: Copy the generated API key
5. **Add to Environment**: Add it to your `.env.local` file as `GEMINI_API_KEY`

**Important**: Keep your API key secure and never commit it to version control.

## 🧪 Testing

Run the test suite:

\`\`\`bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
\`\`\`

### Test Coverage

- **Unit Tests**: AI orchestrator, EMT adapter, schema validation
- **Component Tests**: React components with React Testing Library
- **Integration Tests**: End-to-end booking flow
- **API Tests**: Route handlers and middleware

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`


## 🔧 Configuration

### Switching from Mock to Real EMT Integration

1. **Obtain EMT API Credentials**: Contact EaseMyTrip for API access
2. **Update Environment Variables**: Add `EMT_API_KEY` and `EMT_API_URL`
3. **Set Production Mode**: Ensure `NODE_ENV=production`

The application automatically switches from mock to real EMT integration when API credentials are provided.

## 🎯 Example Usage


## 🐛 Troubleshooting

### Common Issues

1. **Gemini API Errors**: Ensure your API key is valid and has sufficient quota
2. **Firebase Connection**: Verify your Firebase configuration and service account permissions
3. **Build Errors**: Clear `.next` folder and `node_modules`, then reinstall dependencies
4. **Environment Variables**: Double-check all required environment variables are set

### Development Mode

The application includes comprehensive fallbacks for development:
- Mock AI responses when Gemini API is unavailable
- Mock booking system when EMT API is not configured
- Firestore emulator support for local development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is built for the Google GenAI Exchange Hackathon with EaseMyTrip. See the competition terms for usage rights.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful natural language processing
- **EaseMyTriip** for travel booking integration and hackathon partnership
- **Vercel** for hosting and deployment platform
- **Firebase** for authentication and database services
- **shadcn/ui** for beautiful UI components

---

Built with ❤️ for the Google GenAI Exchange Hackathon
