import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// POST - Verify agent credentials
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Check for host login
    if (username === "host" && password === "admin") {
      return NextResponse.json({
        success: true,
        isHost: true,
        displayName: "Mission Control",
      })
    }

    // Check registered agents
    const agents = await sql`
      SELECT id, username, display_name 
      FROM registered_agents 
      WHERE username = ${username} 
        AND password = ${password}
        AND is_active = true
    `

    if (agents.length > 0) {
      return NextResponse.json({
        success: true,
        isHost: false,
        displayName: agents[0].display_name,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Error authenticating:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
