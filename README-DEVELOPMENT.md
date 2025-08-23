# NoteTrack Development Setup

This document provides instructions for setting up the NoteTrack application for local development and deployment.

## Project Structure

```
├── frontend/              # Next.js frontend application
│   ├── app/               # App router pages and components
│   ├── components/        # Shared UI components
│   ├── contexts/          # React context providers
│   ├── lib/               # Utility functions and Supabase client
│   └── public/            # Static assets
├── supabase/              # Supabase migrations and setup
└── netlify.toml           # Netlify deployment configuration
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Local Development

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the `frontend` directory with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup

1. Create a new Supabase project at https://supabase.com/
2. Run the migration script in `supabase/migrations/20250823112900_create_events_table.sql` in the Supabase SQL editor
3. Set up authentication (email/password) in the Supabase dashboard

## Database Schema

### Events Table

The `events` table stores calendar events for each user:
- `id`: UUID primary key
- `created_at`: Timestamp of creation
- `title`: Event title
- `start`: Start time of the event
- `end`: End time of the event (optional)
- `user_id`: Reference to the user who owns the event
- `all_day`: Boolean indicating if it's an all-day event
- `description`: Optional event description
- `location`: Optional event location
- `color`: Optional event color

## Authentication

The application uses Supabase Auth for user authentication with email and password. The `AuthContext` provides:
- User session management
- Sign up, sign in, and sign out functions
- Password reset functionality

## Deployment to Netlify

The project is configured for deployment to Netlify using the `netlify.toml` configuration file.

### Environment Variables

Make sure to set the following environment variables in your Netlify project settings:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Deployment Steps

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` file
3. The build will run automatically on each push to the main branch

## Features

1. **User Authentication**: Sign up, sign in, password reset
2. **Calendar**: FullCalendar integration with Supabase backend
3. **Responsive Design**: Works on mobile and desktop
4. **Dark Mode**: Automatic dark mode based on system preference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
