"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { MAX_HINTS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Round3() {
  const {
    round3Crypto,
    round3Attempts,
    hintsUsed,
    addLog,
    consumeHint,
    decrementR3Attempts,
    updatePlayerStatus,
    currentUser,
  } = useGame()

  const [answer, setAnswer] = useState("")
  const [hintUsed, setHintUsed] = useState(false)
  const [missionComplete, setMissionComplete] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim() || round3Attempts <= 0) return

    const result = round3Crypto.solutions[0]?.result.toString()

    if (answer.trim() === result) {
      addLog(`Agent ${currentUser}: CRYPTARITHM solved: ${answer}. Mission success.`)
      updatePlayerStatus("Escaped")
      setMissionComplete(true)
      alert("ACCESS GRANTED — You have extracted, decoded, and escaped. Mission complete!")
    } else {
      decrementR3Attempts()
      addLog(`Agent ${currentUser}: Wrong cryptarithm attempt ${answer}. Attempts left ${round3Attempts - 1}`)

      if (round3Attempts - 1 <= 0) {
        updatePlayerStatus("Failed")
        alert("MISSION FAILED — All attempts exhausted.")
      } else {
        alert(`Incorrect. ${round3Attempts - 1} attempts remaining.`)
      }
    }
    setAnswer("")
  }

  const handleHint = () => {
    const mapping = round3Crypto.solutions[0]?.mapping
    if (!mapping) return

    const [letter, digit] = Object.entries(mapping)[0]
    consumeHint()
    setHintUsed(true)
    addLog(`Agent ${currentUser}: Used Round-3 hint revealing ${letter}=${digit}.`)
    alert(`Hint: ${letter} = ${digit}`)
  }

  if (!round3Crypto) return null

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
        <h2 className="font-mono text-2xl font-bold text-primary terminal-glow">ROUND 3: CRYPTARITHM LOCK</h2>
        <p className="text-sm text-muted-foreground">Solve the cryptographic puzzle to escape</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">CRYPTOGRAPHIC LOCK</CardTitle>
            <CardDescription>Each letter represents a unique digit (0-9)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border bg-background/50 p-8 text-center">
              <p className="font-mono text-3xl font-bold text-primary">{round3Crypto.display}</p>
            </div>

            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
              Submit the numeric RESULT (right-hand side) to unlock the exit.
            </div>

            <div className="space-y-2">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter numeric result..."
                className="font-mono text-lg"
                disabled={round3Attempts <= 0}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1" disabled={round3Attempts <= 0}>
                  Submit Answer
                </Button>
                <Button onClick={handleHint} disabled={hintUsed || hintsUsed >= MAX_HINTS} variant="outline">
                  Round-3 Hint
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
            <CardTitle className="font-mono text-lg">Solving Strategy</CardTitle>
            <CardDescription>Approach systematically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">STRATEGY 1:</p>
                <p className="text-muted-foreground">Identify unique letters and their constraints</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">STRATEGY 2:</p>
                <p className="text-muted-foreground">Leading digits cannot be zero</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">STRATEGY 3:</p>
                <p className="text-muted-foreground">Work from right to left, considering carries</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">STRATEGY 4:</p>
                <p className="text-muted-foreground">Use elimination to narrow down possibilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
