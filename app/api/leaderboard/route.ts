import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET - Fetch leaderboard (completed games sorted by time)
export async function GET() {
  try {
    const leaderboard = await sql`
      SELECT 
        agent_name,
        display_name,
        total_time_seconds,
        hints_used,
        end_time,
        secret_key
      FROM game_sessions 
      WHERE status = 'completed'
      ORDER BY total_time_seconds ASC
      LIMIT 50
    `
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
