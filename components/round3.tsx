"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { MAX_HINTS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Round3() {
  const {
    laserGrid,
    round3Attempts,
    hintsUsed,
    addLog,
    consumeHint,
    decrementR3Attempts,
    updatePlayerStatus,
    currentUser,
    resetToRound1,
    setMissionComplete,
    saveSessionToDb,
  } = useGame()

  const [commands, setCommands] = useState("")
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set(["0,0"]))
  const [revealedLasers, setRevealedLasers] = useState<Set<string>>(new Set())
  const [hintUsed, setHintUsed] = useState(false)
  const [missionCompleteLocal, setMissionCompleteLocal] = useState(false)

  useEffect(() => {
    if (laserGrid && revealedLasers.size === 0) {
      setRevealedLasers(new Set())
    }
  }, [laserGrid, revealedLasers.size])

  if (!laserGrid) return null

  const generateSecretKey = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const agentPrefix = (currentUser || "AGENT").substring(0, 4).toUpperCase()
    return `${agentPrefix}-${timestamp}-${random}`
  }

  const handleSubmit = async () => {
    if (!commands.trim() || round3Attempts <= 0) return

    const moves = commands.toUpperCase().split("")
    let row = 0
    let col = 0
    const visited = new Set<string>(["0,0"])
    let hitLaser = false

    for (const move of moves) {
      if (move === "U") row--
      else if (move === "D") row++
      else if (move === "L") col--
      else if (move === "R") col++
      else continue

      if (row < 0 || row >= laserGrid.size || col < 0 || col >= laserGrid.size) {
        addLog(`Agent ${currentUser}: Out of bounds at (${row},${col})`)
        alert("INVALID PATH: Out of bounds!")
        return
      }

      const key = `${row},${col}`

      if (laserGrid.lasers.has(key)) {
        hitLaser = true
        setRevealedLasers((prev) => new Set([...prev, key]))
        addLog(`Agent ${currentUser}: Hit laser at (${row},${col})`)
        break
      }

      visited.add(key)
    }

    if (!hitLaser && row === laserGrid.size - 1 && col === laserGrid.size - 1) {
      addLog(`Agent ${currentUser}: Successfully navigated laser grid. Mission complete.`)
      updatePlayerStatus("Escaped")

      const secretKey = generateSecretKey()
      setMissionComplete(true, secretKey)
      setMissionCompleteLocal(true)

      // Save to database
      await saveSessionToDb(secretKey)

      alert("ACCESS GRANTED — You have successfully escaped!")
      return
    }

    decrementR3Attempts()
    addLog(`Agent ${currentUser}: Failed laser navigation. Attempts left: ${round3Attempts - 1}`)

    if (round3Attempts - 1 <= 0) {
      alert("MISSION FAILED — All attempts exhausted. Restarting from Round 1. Timer continues!")
      resetToRound1()
    } else {
      alert(`${hitLaser ? "HIT LASER!" : "DIDN'T REACH GOAL"} ${round3Attempts - 1} attempts remaining.`)
    }

    setCommands("")
    setVisitedCells(new Set(["0,0"]))
  }

  const handleHint = () => {
    if (hintsUsed >= MAX_HINTS || hintUsed) return

    consumeHint()
    setHintUsed(true)
    addLog(`Agent ${currentUser}: Used Round-3 hint.`)
    alert(
      "Hint:\n- Start by moving DOWN\n- Avoid the second column at the top\n- Look for safe paths along the left side\n- The goal is at bottom-right (4,4)",
    )
  }

  if (missionCompleteLocal) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="mx-auto max-w-2xl border-accent/50 bg-accent/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-2xl text-accent">MISSION COMPLETE</CardTitle>
            <CardDescription>Excellent work, Agent {currentUser}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border border-accent bg-accent/20 p-6 text-center">
                <div className="mb-2 text-6xl">✓</div>
                <p className="font-mono text-lg font-bold text-accent">ACCESS GRANTED</p>
                <p className="mt-2 text-sm text-foreground/80">
                  You have successfully extracted intel, decoded communications, and escaped.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-primary terminal-glow">ROUND 3: LASER GRID NAVIGATION</h2>
        <p className="text-sm text-muted-foreground">
          Navigate from top-left (0,0) to bottom-right (4,4) avoiding lasers
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">5x5 LASER GRID</CardTitle>
            <CardDescription>Green = Start (0,0), Blue = Goal (4,4), Red = Revealed Laser</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${laserGrid.size}, 1fr)` }}>
              {Array.from({ length: laserGrid.size }, (_, row) =>
                Array.from({ length: laserGrid.size }, (_, col) => {
                  const key = `${row},${col}`
                  const isStart = row === 0 && col === 0
                  const isGoal = row === laserGrid.size - 1 && col === laserGrid.size - 1
                  const isLaser = revealedLasers.has(key)
                  const isVisited = visitedCells.has(key)

                  let bgColor = "bg-background/50 border-border"
                  let content = ""

                  if (isStart) {
                    bgColor = "bg-green-500/30 border-green-500"
                    content = "S"
                  } else if (isGoal) {
                    bgColor = "bg-blue-500/30 border-blue-500"
                    content = "G"
                  } else if (isLaser) {
                    bgColor = "bg-red-500/30 border-red-500"
                    content = "✕"
                  } else if (isVisited) {
                    bgColor = "bg-primary/20 border-primary/50"
                  }

                  return (
                    <div
                      key={key}
                      className={`aspect-square rounded border ${bgColor} flex items-center justify-center text-xs font-mono font-bold`}
                    >
                      {content}
                    </div>
                  )
                }),
              )}
            </div>

            <div className="space-y-2">
              <Input
                value={commands}
                onChange={(e) => setCommands(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter path: e.g., DDRRDRRD"
                className="font-mono text-lg"
                disabled={round3Attempts <= 0}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1" disabled={round3Attempts <= 0}>
                  Submit Path
                </Button>
                <Button onClick={handleHint} disabled={hintUsed || hintsUsed >= MAX_HINTS} variant="outline">
                  Hint ({MAX_HINTS - hintsUsed} left)
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="font-mono text-sm font-medium text-destructive">ATTEMPTS LEFT: {round3Attempts}</p>
              <p className="text-xs text-muted-foreground mt-1">If you fail all attempts, you restart from Round 1!</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Navigation Guide</CardTitle>
            <CardDescription>Use these commands to navigate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">U = UP</p>
                <p className="text-muted-foreground">Move one cell upward (row - 1)</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">D = DOWN</p>
                <p className="text-muted-foreground">Move one cell downward (row + 1)</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">L = LEFT</p>
                <p className="text-muted-foreground">Move one cell to the left (col - 1)</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">R = RIGHT</p>
                <p className="text-muted-foreground">Move one cell to the right (col + 1)</p>
              </div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <p className="font-mono text-xs font-medium">Goal: Reach (4,4) from (0,0)</p>
                <p className="text-muted-foreground">Avoid hidden lasers - they are revealed when you hit them!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
