"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { MAX_HINTS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
    stopTimer,
  } = useGame()

  const [pathInput, setPathInput] = useState("")
  const [hintUsed, setHintUsed] = useState(false)
  const [missionComplete, setMissionComplete] = useState(false)
  const [cellStates, setCellStates] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!laserGrid) return

    // Collect all laser positions (excluding start and goal)
    const laserPositions: [number, number][] = []
    for (let r = 0; r < laserGrid.size; r++) {
      for (let c = 0; c < laserGrid.size; c++) {
        if (laserGrid.grid[r][c] === 1) {
          // Exclude start and goal positions
          if (!(r === 0 && c === 0) && !(r === laserGrid.size - 1 && c === laserGrid.size - 1)) {
            laserPositions.push([r, c])
          }
        }
      }
    }

    // Randomly select 4-6 laser positions to reveal
    const numToReveal = Math.min(Math.floor(laserPositions.length * 0.4), 6)
    const shuffled = [...laserPositions].sort(() => Math.random() - 0.5)
    const revealed = shuffled.slice(0, numToReveal)

    // Initialize cell states with start, goal, and some revealed lasers
    const initialStates: Record<string, string> = {}
    initialStates["0,0"] = "start"
    initialStates[`${laserGrid.size - 1},${laserGrid.size - 1}`] = "goal"

    revealed.forEach(([r, c]) => {
      initialStates[`${r},${c}`] = "laser"
    })

    setCellStates(initialStates)
  }, [laserGrid])

  const handleHint = () => {
    if (!laserGrid || hintUsed) return

    // Reveal 2 safe coordinates from solution path (excluding start and goal)
    const pool = laserGrid.solutionPath.filter(
      ([r, c]) => !(r === 0 && c === 0) && !(r === laserGrid.size - 1 && c === laserGrid.size - 1),
    )
    const revealed = pool.slice(0, Math.min(2, pool.length))
    const coordsText = revealed.map(([r, c]) => `(${r},${c})`).join(", ")

    consumeHint()
    setHintUsed(true)
    addLog(`Agent ${currentUser}: Used Round-3 hint revealing coordinates ${coordsText}.`)
    alert(`Hint - Safe Coordinates: ${coordsText}`)
  }

  const handleSubmit = () => {
    if (!laserGrid || !pathInput.trim() || round3Attempts <= 0) return

    const path = pathInput.trim().toUpperCase()

    // Validate input
    if (!/^[UDLR]+$/.test(path)) {
      alert("Invalid path. Only U (Up), D (Down), L (Left), R (Right) allowed.")
      return
    }

    // Execute path
    const moveMap: Record<string, [number, number]> = {
      U: [-1, 0],
      D: [1, 0],
      L: [0, -1],
      R: [0, 1],
    }

    let [r, c] = laserGrid.start
    const newCellStates: Record<string, string> = {}
    newCellStates[`${r},${c}`] = "start"

    let safeRun = true
    let steps = 0

    for (const move of path) {
      const [dr, dc] = moveMap[move]
      r += dr
      c += dc
      steps++

      // Check bounds
      if (r < 0 || r >= laserGrid.size || c < 0 || c >= laserGrid.size) {
        decrementR3Attempts()
        addLog(`Agent ${currentUser}: Off-grid at step ${steps}. Attempts left: ${round3Attempts - 1}`)
        alert(`BREACH: You moved off-grid at step ${steps}. Attempt lost.`)
        safeRun = false
        break
      }

      // Check laser
      if (laserGrid.grid[r][c] === 1) {
        newCellStates[`${r},${c}`] = "laser"
        setCellStates(newCellStates)
        decrementR3Attempts()
        addLog(`Agent ${currentUser}: Laser hit at (${r},${c}). Attempts left: ${round3Attempts - 1}`)
        alert(`LASER HIT: You hit a laser at (${r},${c}). Attempt lost.`)
        safeRun = false
        break
      }

      // Mark as safe
      newCellStates[`${r},${c}`] = "safe"

      // Check goal
      if (r === laserGrid.goal[0] && c === laserGrid.goal[1]) {
        newCellStates[`${r},${c}`] = "goal"
        setCellStates(newCellStates)
        addLog(`Agent ${currentUser}: LASER GRID solved. Mission success.`)
        updatePlayerStatus("Escaped")
        setMissionComplete(true)
        stopTimer()
        alert(`SUCCESS: You reached the goal safely in ${steps} moves! Mission complete.`)
        return
      }
    }

    setCellStates(newCellStates)

    // Path incomplete
    if (safeRun && (r !== laserGrid.goal[0] || c !== laserGrid.goal[1])) {
      decrementR3Attempts()
      addLog(`Agent ${currentUser}: Incomplete path. Attempts left: ${round3Attempts - 1}`)
      alert(`INCOMPLETE: You did not reach the goal. Attempts left: ${round3Attempts - 1}`)
    }

    // Check failure
    if (round3Attempts - 1 <= 0 && !missionComplete) {
      updatePlayerStatus("Failed")
      stopTimer()
      alert("MISSION FAILED: All attempts exhausted.")
      // Reveal full grid
      revealFullGrid()
    }

    setPathInput("")
  }

  const revealFullGrid = () => {
    if (!laserGrid) return

    const newCellStates: Record<string, string> = {}
    for (let r = 0; r < laserGrid.size; r++) {
      for (let c = 0; c < laserGrid.size; c++) {
        if (r === 0 && c === 0) {
          newCellStates[`${r},${c}`] = "start"
        } else if (r === laserGrid.size - 1 && c === laserGrid.size - 1) {
          newCellStates[`${r},${c}`] = "goal"
        } else if (laserGrid.grid[r][c] === 1) {
          newCellStates[`${r},${c}`] = "laser"
        } else {
          newCellStates[`${r},${c}`] = "safe"
        }
      }
    }
    setCellStates(newCellStates)
  }

  const getCellDisplay = (r: number, c: number) => {
    const key = `${r},${c}`
    const state = cellStates[key]

    if (!state) return " "
    if (state === "start") return "S"
    if (state === "goal") return "G"
    if (state === "safe") return "·"
    if (state === "laser") return "X"
    return " "
  }

  const getCellColor = (r: number, c: number) => {
    const key = `${r},${c}`
    const state = cellStates[key]

    if (state === "start") return "bg-accent/30 border-accent"
    if (state === "goal") return "bg-primary/30 border-primary"
    if (state === "safe") return "bg-muted/30 border-muted"
    if (state === "laser") return "bg-destructive/30 border-destructive"
    return "bg-background/50 border-border"
  }

  if (!laserGrid) return null

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
                  You have successfully extracted intel, decoded communications, and navigated the laser grid.
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
        <p className="text-sm text-muted-foreground">Navigate from start to goal avoiding laser beams</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">LASER GRID</CardTitle>
            <CardDescription>
              Start: top-left (0,0) → Goal: bottom-right ({laserGrid.size - 1},{laserGrid.size - 1})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mx-auto w-fit rounded-md border border-primary/30 bg-background/50 p-4">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${laserGrid.size}, minmax(0, 1fr))` }}>
                {Array.from({ length: laserGrid.size }).map((_, r) =>
                  Array.from({ length: laserGrid.size }).map((_, c) => (
                    <div
                      key={`${r},${c}`}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded border-2 font-mono text-lg font-bold transition-colors",
                        getCellColor(r, c),
                      )}
                    >
                      {getCellDisplay(r, c)}
                    </div>
                  )),
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-md border border-border bg-background/30 p-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-accent bg-accent/30"></div>
                <span>S = Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-primary bg-primary/30"></div>
                <span>G = Goal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-muted bg-muted/30"></div>
                <span>· = Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-destructive bg-destructive/30"></div>
                <span>X = Laser</span>
              </div>
            </div>

            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="font-mono text-sm font-medium text-destructive">ATTEMPTS LEFT: {round3Attempts}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">PATH CONTROLS</CardTitle>
            <CardDescription>Enter a sequence of moves to navigate the grid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enter path using:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded border border-border bg-background/50 p-2">
                  <span className="font-mono font-bold text-accent">U</span> = Up
                </div>
                <div className="rounded border border-border bg-background/50 p-2">
                  <span className="font-mono font-bold text-accent">D</span> = Down
                </div>
                <div className="rounded border border-border bg-background/50 p-2">
                  <span className="font-mono font-bold text-accent">L</span> = Left
                </div>
                <div className="rounded border border-border bg-background/50 p-2">
                  <span className="font-mono font-bold text-accent">R</span> = Right
                </div>
              </div>
            </div>

            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
              Example: <span className="font-mono text-primary">RRDDDR</span> means Right, Right, Down, Down, Down,
              Right
            </div>

            <div className="space-y-2">
              <Input
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter path (e.g., RRDD)..."
                className="font-mono text-lg"
                disabled={round3Attempts <= 0 || missionComplete}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1" disabled={round3Attempts <= 0 || missionComplete}>
                  Run Path
                </Button>
                <Button onClick={handleHint} disabled={hintUsed || hintsUsed >= MAX_HINTS} variant="outline">
                  Hint (2 coords)
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-md border border-accent/30 bg-accent/5 p-3 text-sm">
              <p className="font-medium text-accent">Strategy Tips:</p>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                <li>Plan your path before submitting</li>
                <li>Start with simple right/down moves</li>
                <li>Use hint to reveal safe cells</li>
                <li>You have 3 attempts total</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
