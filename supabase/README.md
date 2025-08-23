# Supabase Setup

This directory contains the database migrations for the NoteTrack application.

## Database Schema

The application uses a Supabase backend with the following tables:

### Events Table

The `events` table stores calendar events for each user:

```sql
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  start timestamp with time zone not null,
  "end" timestamp with time zone,
  user_id uuid references auth.users(id) on delete cascade not null,
  all_day boolean default false,
  description text,
  location text,
  color text
);
```

## Setting up the Database

1. Create a new Supabase project at https://supabase.com/
2. Run the migration script `migrations/20250823112900_create_events_table.sql` in the Supabase SQL editor
3. Set up authentication (email/password) in the Supabase dashboard
4. Update your `.env.local` file with the Supabase URL and anon key

## Row Level Security

The events table uses Row Level Security (RLS) to ensure that users can only access their own data:

- Users can view their own events
- Users can insert their own events
- Users can update their own events
- Users can delete their own events

## Environment Variables

Make sure to set the following environment variables in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
