import { NextResponse } from 'next/server'

// GET /api/events - Get all events for the current user
export async function GET() {
  try {
    // We're using Supabase directly in the frontend, so this API route is not needed
    // Returning an empty array for compatibility
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events - Create a new event
export async function POST(request: Request) {
  try {
    const eventData = await request.json()
    
    // We're using Supabase directly in the frontend, so this API route is not needed
    // Returning the event data for compatibility
    return NextResponse.json(eventData)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
