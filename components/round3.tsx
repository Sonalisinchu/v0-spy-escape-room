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
  } = useGame()

  const [commands, setCommands] = useState("")
  const [currentPos, setCurrentPos] = useState({ row: 0, col: 0 })
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set(["0,0"]))
  const [revealedLasers, setRevealedLasers] = useState<Set<string>>(new Set())
  const [hintUsed, setHintUsed] = useState(false)
  const [missionComplete, setMissionComplete] = useState(false)

  useEffect(() => {
    if (laserGrid && revealedLasers.size === 0) {
      setRevealedLasers(new Set())
    }
  }, [laserGrid])

  if (!laserGrid) return null

  const handleSubmit = () => {
    if (!commands.trim() || round3Attempts <= 0) return

    const moves = commands.toUpperCase().split("")
    let row = 0
    let col = 0
    const visited = new Set<string>(["0,0"])
    let hitLaser = false

    // Simulate the path
    for (const move of moves) {
      if (move === "U") row--
      else if (move === "D") row++
      else if (move === "L") col--
      else if (move === "R") col++
      else continue

      // Check bounds
      if (row < 0 || row >= laserGrid.size || col < 0 || col >= laserGrid.size) {
        addLog(`Agent ${currentUser}: Out of bounds at (${row},${col})`)
        alert("INVALID PATH: Out of bounds!")
        return
      }

      const key = `${row},${col}`

      // Check laser hit
      if (laserGrid.lasers.has(key)) {
        hitLaser = true
        setRevealedLasers((prev) => new Set([...prev, key]))
        addLog(`Agent ${currentUser}: Hit laser at (${row},${col})`)
        break
      }

      visited.add(key)
    }

    // Check if reached goal
    if (!hitLaser && row === laserGrid.size - 1 && col === laserGrid.size - 1) {
      addLog(`Agent ${currentUser}: Successfully navigated laser grid. Mission complete.`)
      updatePlayerStatus("Escaped")
      setMissionComplete(true)
      alert("ACCESS GRANTED — You have successfully escaped!")
      return
    }

    // Failed attempt
    decrementR3Attempts()
    addLog(`Agent ${currentUser}: Failed laser navigation. Attempts left: ${round3Attempts - 1}`)

    if (round3Attempts - 1 <= 0) {
      updatePlayerStatus("Failed")
      alert("MISSION FAILED — All attempts exhausted.")
    } else {
      alert(`${hitLaser ? "HIT LASER!" : "DIDN'T REACH GOAL"} ${round3Attempts - 1} attempts remaining.`)
    }

    setCommands("")
    setCurrentPos({ row: 0, col: 0 })
    setVisitedCells(new Set(["0,0"]))
  }

  const handleHint = () => {
    if (!laserGrid.solution || laserGrid.solution.length === 0) return

    consumeHint()
    setHintUsed(true)
    addLog(`Agent ${currentUser}: Used Round-3 hint.`)
    alert("Hint:\n- The safe path starts with RR (Right, Right)\n- Never go Left or Up\n- Stay within the 4x4 grid")
  }

  if (missionComplete) {
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
              <div className="space-y-2 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
                <p>
                  <span className="font-medium">Agent:</span> {currentUser}
                </p>
                <p>
                  <span className="font-medium">Status:</span> Escaped
                </p>
                <p>
                  <span className="font-medium">Hints Used:</span> {hintsUsed}/{MAX_HINTS}
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
        <p className="text-sm text-muted-foreground">Navigate from top-left to bottom-right avoiding lasers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">LASER GRID</CardTitle>
            <CardDescription>Red = Laser, Green = Start, Blue = Goal</CardDescription>
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

                  let bgColor = "bg-background/50"
                  if (isStart) bgColor = "bg-green-500/30 border-green-500"
                  else if (isGoal) bgColor = "bg-blue-500/30 border-blue-500"
                  else if (isLaser) bgColor = "bg-red-500/30 border-red-500"
                  else if (isVisited) bgColor = "bg-primary/20"

                  return (
                    <div
                      key={key}
                      className={`aspect-square rounded border ${bgColor} flex items-center justify-center text-xs font-mono`}
                    >
                      {isStart && "S"}
                      {isGoal && "G"}
                      {isLaser && "✕"}
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
                placeholder="Enter commands: U D L R"
                className="font-mono text-lg"
                disabled={round3Attempts <= 0}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1" disabled={round3Attempts <= 0}>
                  Submit Path
                </Button>
                <Button onClick={handleHint} disabled={hintUsed || hintsUsed >= MAX_HINTS} variant="outline">
                  Hint
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="font-mono text-sm font-medium text-destructive">ATTEMPTS LEFT: {round3Attempts}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Navigation Guide</CardTitle>
            <CardDescription>Movement commands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">U = UP</p>
                <p className="text-muted-foreground">Move one cell upward</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">D = DOWN</p>
                <p className="text-muted-foreground">Move one cell downward</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">L = LEFT</p>
                <p className="text-muted-foreground">Move one cell to the left</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">R = RIGHT</p>
                <p className="text-muted-foreground">Move one cell to the right</p>
              </div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <p className="font-mono text-xs font-medium">Example: DDRR</p>
                <p className="text-muted-foreground">Moves down twice, then right twice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
