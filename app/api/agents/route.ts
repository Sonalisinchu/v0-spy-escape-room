import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET - Fetch all registered agents
export async function GET() {
  try {
    const agents = await sql`
      SELECT id, username, display_name, is_active, created_at 
      FROM registered_agents 
      WHERE is_active = true
      ORDER BY created_at DESC
    `
    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

// POST - Create a new agent
export async function POST(request: Request) {
  try {
    const { username, password, displayName } = await request.json()

    if (!username || !password || !displayName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO registered_agents (username, password, display_name)
      VALUES (${username}, ${password}, ${displayName})
      ON CONFLICT (username) DO UPDATE SET
        password = ${password},
        display_name = ${displayName},
        is_active = true
      RETURNING id, username, display_name
    `

    return NextResponse.json({ agent: result[0] })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}

// DELETE - Remove an agent
export async function DELETE(request: Request) {
  try {
    const { username } = await request.json()

    await sql`
      UPDATE registered_agents 
      SET is_active = false 
      WHERE username = ${username}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
