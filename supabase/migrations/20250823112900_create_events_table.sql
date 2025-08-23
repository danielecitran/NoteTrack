-- Create events table
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

-- Create indexes
create index if not exists events_user_id_idx on events (user_id);
create index if not exists events_start_idx on events (start);
create index if not exists events_end_idx on events ("end");

-- Set up Row Level Security (RLS)
alter table events enable row level security;

-- Create policies
create policy "Users can view their own events" on events
  for select using (auth.uid() = user_id);

create policy "Users can insert their own events" on events
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own events" on events
  for update using (auth.uid() = user_id);

create policy "Users can delete their own events" on events
  for delete using (auth.uid() = user_id);
