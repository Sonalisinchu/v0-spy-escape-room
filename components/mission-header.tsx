"use client"

import { useGame } from "@/lib/game-context"

export function MissionHeader() {
  const { currentUser, missionTimeLeft, timerRunning } = useGame()

  const minutes = Math.floor(missionTimeLeft / 60)
  const seconds = missionTimeLeft % 60

  return (
    <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-primary/50 bg-primary/10">
            <span className="font-mono text-lg font-bold text-primary terminal-glow">◈</span>
          </div>
          <div>
            <h1 className="font-mono text-xl font-bold text-primary terminal-glow">OPERATION: NIGHTFALL</h1>
            <p className="text-xs text-muted-foreground">Classified Mission Protocol</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {currentUser && (
            <div className="flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5">
              <div className="size-2 animate-pulse rounded-full bg-accent" />
              <span className="font-mono text-sm font-medium text-accent">AGENT: {currentUser.toUpperCase()}</span>
            </div>
          )}

          {timerRunning && (
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-muted-foreground">MISSION TIME:</span>
              <span
                className={`font-bold ${missionTimeLeft < 300 ? "text-destructive animate-pulse" : "text-primary"}`}
              >
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
