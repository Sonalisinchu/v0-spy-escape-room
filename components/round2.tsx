"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { CODE_PUZZLES, MAX_HINTS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Round2() {
  const { hintsUsed, addLog, consumeHint, initRound3, currentUser } = useGame()
  const [puzzle, setPuzzle] = useState(CODE_PUZZLES[0])
  const [answer, setAnswer] = useState("")

  const handleHint = () => {
    if (hintsUsed >= MAX_HINTS) return
    addLog(`Agent ${currentUser}: Used hint for Round 2.`)
    alert(`Hint: ${puzzle.hint}`)
    consumeHint()
  }

  useEffect(() => {
    // Pick a random puzzle on mount
    const randomPuzzle = CODE_PUZZLES[Math.floor(Math.random() * CODE_PUZZLES.length)]
    setPuzzle(randomPuzzle)
  }, [])

  const handleSubmit = () => {
    if (!answer.trim()) return

    if (answer.trim() === puzzle.answer) {
      addLog(`Agent ${currentUser}: Decoding correct -> ${answer}. Moving to Round 3.`)
      initRound3()
    } else {
      addLog(`Agent ${currentUser}: Decoding incorrect attempt ${answer}.`)
      alert("Incorrect. Try again.")
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-primary terminal-glow">ROUND 2: DECODE MESSAGE</h2>
        <p className="text-sm text-muted-foreground">Analyze the code and determine its output</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">{puzzle.display}</CardTitle>
            <CardDescription>What is the numeric output of this code?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-64">
              <pre className="rounded-md border border-border bg-background/50 p-4 font-mono text-sm leading-relaxed text-foreground">
                {puzzle.code}
              </pre>
            </ScrollArea>

            <div className="space-y-2">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter the numeric output..."
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  Submit Answer
                </Button>
                <Button onClick={handleHint} disabled={hintsUsed >= MAX_HINTS} variant="outline">
                  Hint ({MAX_HINTS - hintsUsed} left)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Analysis Tips</CardTitle>
            <CardDescription>Approach the code systematically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">TIP 1:</p>
                <p className="text-muted-foreground">Trace through the loops step by step, tracking variable changes</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">TIP 2:</p>
                <p className="text-muted-foreground">Write down the value of each variable at each iteration</p>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
                <p className="mb-1 font-mono text-xs font-medium text-accent">TIP 3:</p>
                <p className="text-muted-foreground">Remember: range(n) goes from 0 to n-1</p>
              </div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">Hints remaining: {MAX_HINTS - hintsUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
