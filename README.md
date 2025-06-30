Weather App with Supabase Authentication

A beautiful React Native weather app with Supabase authentication, built with Expo Router.

Features

🌤️ Real-time weather data
🔐 Supabase authentication (sign up, sign in, password reset)
📱 Beautiful, modern UI with gradient backgrounds
🌙 Dark mode support
📍 Location-based weather
⚙️ Customizable settings
🔄 Offline data caching
Authentication Features

Sign Up: Create new accounts with email verification
Sign In: Secure authentication with email/password
Password Reset: Forgot password functionality
Session Management: Automatic session persistence
Sign Out: Secure logout functionality
Prerequisites

Node.js (v18 or higher)
Expo CLI
Supabase account
Setup Instructions

1. Install Dependencies

npm install
2. Supabase Setup

Create a new project at supabase.com
Go to your project settings
Copy your project URL and anon key
Update the services/supabase.ts file with your credentials:
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
3. Configure Authentication

In your Supabase dashboard:

Go to Authentication > Settings
Configure your site URL (for development: http://localhost:8081)
Add redirect URLs:
bolt-expo-starter://reset-password
exp://localhost:8081/*
4. Email Templates (Optional)

Customize email templates in Supabase dashboard:

Authentication > Email Templates
Customize confirmation and reset password emails
5. Run the App

npm run dev
Project Structure

project/
├── app/
│   ├── auth/                 # Authentication screens
│   │   ├── _layout.tsx      # Auth layout
│   │   ├── signin.tsx       # Sign in screen
│   │   ├── signup.tsx       # Sign up screen
│   │   └── forgot-password.tsx # Password reset screen
│   ├── (tabs)/              # Main app tabs
│   └── _layout.tsx          # Root layout with auth provider
├── components/              # Reusable components
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── services/               # API services
│   ├── supabase.ts         # Supabase configuration
│   ├── weatherService.ts   # Weather API service
│   └── storageService.ts   # Local storage service
└── types/                  # TypeScript type definitions
Authentication Flow

App Launch: Checks for existing session
Unauthenticated: Shows auth screens (sign in/sign up)
Authenticated: Shows main app with weather data
Session Management: Automatic token refresh and persistence
Key Components

AuthContext

Manages authentication state throughout the app:

User session management
Authentication state
Sign out functionality
Supabase Service

Handles all Supabase operations:

User registration
User login
Password reset
Session management
Authentication Screens

Sign In: Email/password authentication
Sign Up: New user registration with email verification
Forgot Password: Password reset via email
Environment Variables

Create a .env file in the root directory:

EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Then update services/supabase.ts:

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
Security Features

Secure password storage (handled by Supabase)
Email verification for new accounts
Secure password reset flow
Session token management
Automatic token refresh
Customization

Styling

The app uses a consistent design system with:

Gradient backgrounds
Glassmorphism effects
Consistent color scheme
Responsive layouts
Authentication UI

All auth screens feature:

Beautiful gradient backgrounds
Form validation
Loading states
Error handling
Keyboard-aware layouts
Troubleshooting

Common Issues

Authentication not working: Check Supabase credentials and redirect URLs
Email verification: Ensure email templates are configured in Supabase
Password reset: Verify redirect URLs are set correctly
Session persistence: Check AsyncStorage permissions
Development Tips

Use Expo DevTools for debugging
Check Supabase logs for authentication issues
Test on both iOS and Android simulators
Verify email templates work in development
Contributing

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request 

