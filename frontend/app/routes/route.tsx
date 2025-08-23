// app/api/events/route.ts
export async function GET() {
    return Response.json([])
  }
  
  export async function POST(request: Request) {
    const event = await request.json()
    // Hier später in Datenbank speichern
    return Response.json(event)
  }