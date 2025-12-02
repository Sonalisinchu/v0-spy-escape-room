import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET - Fetch game sessions (for host dashboard)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    if (activeOnly) {
      const sessions = await sql`
        SELECT 
          gs.agent_username,
          ra.display_name,
          gs.current_round,
          gs.hints_used,
          gs.status,
          gs.started_at
        FROM game_sessions gs
        LEFT JOIN registered_agents ra ON gs.agent_username = ra.username
        WHERE gs.status = 'in_progress'
        ORDER BY gs.started_at DESC
      `
      return NextResponse.json({ sessions })
    }

    const sessions = await sql`
      SELECT * FROM game_sessions 
      ORDER BY created_at DESC
      LIMIT 100
    `
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions", sessions: [] }, { status: 500 })
  }
}

// POST - Create or update a game session
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.agentUsername && body.secretKey) {
      const { agentUsername, startTime, endTime, status, secretKey, hintsUsed, timeRemaining } = body

      const result = await sql`
        INSERT INTO game_sessions (
          agent_username, 
          started_at, 
          completed_at, 
          status, 
          secret_key, 
          hints_used, 
          time_remaining,
          current_round
        )
        VALUES (
          ${agentUsername}, 
          ${startTime}, 
          ${endTime}, 
          ${status}, 
          ${secretKey}, 
          ${hintsUsed}, 
          ${timeRemaining},
          3
        )
        RETURNING *
      `
      return NextResponse.json({ session: result[0] })
    }

    // Handle starting a new session
    const { agentName, displayName } = body
    const result = await sql`
      INSERT INTO game_sessions (agent_username, status, current_round)
      VALUES (${agentName}, 'in_progress', 1)
      RETURNING *
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
    const { agentUsername, updates } = await request.json()

    const setClauses = []

    if (updates.currentRound !== undefined) {
      setClauses.push(`current_round = ${updates.currentRound}`)
    }
    if (updates.status) {
      setClauses.push(`status = '${updates.status}'`)
    }
    if (updates.secretKey) {
      setClauses.push(`secret_key = '${updates.secretKey}'`)
    }
    if (updates.completedAt) {
      setClauses.push(`completed_at = NOW()`)
    }
    if (updates.timeRemaining !== undefined) {
      setClauses.push(`time_remaining = ${updates.timeRemaining}`)
    }
    if (updates.hintsUsed !== undefined) {
      setClauses.push(`hints_used = ${updates.hintsUsed}`)
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    const result = await sql`
      UPDATE game_sessions 
      SET ${sql.unsafe(setClauses.join(", "))}
      WHERE agent_username = ${agentUsername} AND status = 'in_progress'
      RETURNING *
    `

    return NextResponse.json({ session: result[0] })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
