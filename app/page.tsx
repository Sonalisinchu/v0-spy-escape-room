"use client"

import { useGame } from "@/lib/game-context"
import { MissionHeader } from "@/components/mission-header"
import { MissionLog } from "@/components/mission-log"
import { LoginScreen } from "@/components/login-screen"
import { HostDashboard } from "@/components/host-dashboard"
import { Round1 } from "@/components/round1"
import { Round2 } from "@/components/round2"
import { Round3 } from "@/components/round3"
import { CompletionScreen } from "@/components/completion-screen"

export default function Home() {
  const { currentUser, isHost, round2Puzzle, laserGrid, missionComplete } = useGame()

  return (
    <div className="mission-grid-bg flex min-h-screen flex-col">
      <MissionHeader />

      <main className="flex-1">
        {!currentUser ? (
          <LoginScreen />
        ) : isHost ? (
          <HostDashboard />
        ) : missionComplete ? (
          <CompletionScreen />
        ) : laserGrid ? (
          <Round3 />
        ) : round2Puzzle ? (
          <Round2 />
        ) : (
          <Round1 />
        )}
      </main>

      <MissionLog />
    </div>
  )
}
