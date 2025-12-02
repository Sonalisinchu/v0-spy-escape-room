import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET - Fetch all game sessions (for host dashboard)
export async function GET() {
  try {
    const sessions = await sql`
      SELECT * FROM game_sessions 
      ORDER BY created_at DESC
      LIMIT 100
    `
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

// POST - Create a new game session (when agent starts game)
export async function POST(request: Request) {
  try {
    const { agentName, displayName } = await request.json()

    const result = await sql`
      INSERT INTO game_sessions (agent_name, display_name, status)
      VALUES (${agentName}, ${displayName}, 'in_progress')
      RETURNING id, agent_name, display_name, start_time
    `

    return NextResponse.json({ session: result[0] })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

// PATCH - Update game session (round completion, game end)
export async function PATCH(request: Request) {
  try {
    const { sessionId, updates } = await request.json()

    const setClauses = []
    const values: any[] = []

    if (updates.round1Completed !== undefined) {
      setClauses.push("round1_completed = true")
    }
    if (updates.round2Completed !== undefined) {
      setClauses.push("round2_completed = true")
    }
    if (updates.round3Completed !== undefined) {
      setClauses.push("round3_completed = true")
    }
    if (updates.status) {
      setClauses.push(`status = '${updates.status}'`)
    }
    if (updates.secretKey) {
      setClauses.push(`secret_key = '${updates.secretKey}'`)
    }
    if (updates.endTime) {
      setClauses.push("end_time = NOW()")
    }
    if (updates.totalTimeSeconds !== undefined) {
      setClauses.push(`total_time_seconds = ${updates.totalTimeSeconds}`)
    }
    if (updates.hintsUsed !== undefined) {
      setClauses.push(`hints_used = ${updates.hintsUsed}`)
    }
    if (updates.attemptsUsed !== undefined) {
      setClauses.push(`attempts_used = ${updates.attemptsUsed}`)
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    const result = await sql`
      UPDATE game_sessions 
      SET ${sql.unsafe(setClauses.join(", "))}
      WHERE id = ${sessionId}
      RETURNING *
    `

    return NextResponse.json({ session: result[0] })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
