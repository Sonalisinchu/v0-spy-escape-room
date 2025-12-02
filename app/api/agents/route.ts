import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET - Fetch all registered agents
export async function GET() {
  try {
    const agents = await sql`
      SELECT id, username, password, display_name as "displayName", is_active, created_at 
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
      RETURNING id, username, display_name as "displayName"
    `

    return NextResponse.json({ agent: result[0] })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}

// DELETE - Remove an agent or clear all agents
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const clearAll = url.searchParams.get("all")
    const username = url.searchParams.get("username")

    if (clearAll === "true") {
      // Clear all agents
      await sql`
        UPDATE registered_agents 
        SET is_active = false
      `
      return NextResponse.json({ success: true, message: "All agents cleared" })
    }

    if (username) {
      // Remove single agent by username from query param
      await sql`
        UPDATE registered_agents 
        SET is_active = false 
        WHERE username = ${username}
      `
      return NextResponse.json({ success: true })
    }

    // Try to get username from body for backwards compatibility
    try {
      const body = await request.json()
      if (body.username) {
        await sql`
          UPDATE registered_agents 
          SET is_active = false 
          WHERE username = ${body.username}
        `
        return NextResponse.json({ success: true })
      }
    } catch {
      // Body parsing failed, that's okay
    }

    return NextResponse.json({ error: "No username provided" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
