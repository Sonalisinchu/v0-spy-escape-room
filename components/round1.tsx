"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { ROUND1_QUESTIONS, MAX_HINTS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Round1() {
  const {
    round1Index,
    numbersCollected,
    hintsUsed,
    addLog,
    consumeHint,
    collectNumber,
    advanceRound1,
    setRound2Puzzle,
    currentUser,
  } = useGame()

  const [answer, setAnswer] = useState("")
  const [comboCode, setComboCode] = useState("")

  const currentQuestion = ROUND1_QUESTIONS[round1Index]
  const isComplete = round1Index >= ROUND1_QUESTIONS.length

  const handleSubmit = () => {
    if (!answer.trim()) return

    if (answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
      collectNumber(currentQuestion.reward)
      addLog(`Agent ${currentUser}: Correct intel recovered -> ${currentQuestion.reward}`)
      advanceRound1()
      setAnswer("")
    } else {
      addLog(`Agent ${currentUser}: Wrong intel attempt.`)
    }
  }

  const handleHint = () => {
    if (hintsUsed >= MAX_HINTS) return
    addLog(`Agent ${currentUser}: Used hint for Round 1.`)
    alert(`Hint: ${currentQuestion.hint}`)
    consumeHint()
  }

  const handleUnlock = () => {
    if (numbersCollected.length < 5) {
      alert("You must collect all 5 digits first.")
      return
    }

    const correctCode = numbersCollected.join("")
    if (comboCode === correctCode) {
      addLog(`Agent ${currentUser}: Door 2 unlocked with code ${correctCode}.`)
      setRound2Puzzle(true)
    } else {
      addLog(`Agent ${currentUser}: Door 2 wrong code attempt ${comboCode}.`)
      alert("Combined code is incorrect. Re-check digits and order.")
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold text-primary terminal-glow">ROUND 1: INTEL EXTRACTION</h2>
          <p className="text-sm text-muted-foreground">Extract all five intel fragments to proceed</p>
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/10 px-4 py-2">
          <span className="font-mono text-sm font-medium text-accent">PROGRESS: {numbersCollected.length}/5</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Question Card */}
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">
              {isComplete ? "ALL FRAGMENTS RETRIEVED" : `INTEL FRAGMENT #${round1Index + 1}`}
            </CardTitle>
            <CardDescription>
              {isComplete
                ? "Enter the combined code to unlock Door 2"
                : "Solve the challenge to retrieve the code digit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isComplete && currentQuestion && (
              <>
                <ScrollArea className="h-32 rounded-md border border-border bg-background/50 p-4">
                  <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{currentQuestion.question}</p>
                </ScrollArea>

                <div className="space-y-2">
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your answer..."
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
              </>
            )}

            {isComplete && (
              <div className="space-y-4">
                <div className="rounded-md border border-accent/30 bg-accent/10 p-4">
                  <p className="mb-2 font-mono text-sm text-accent">Collected Digits:</p>
                  <div className="flex gap-2">
                    {numbersCollected.map((num, idx) => (
                      <div
                        key={idx}
                        className="flex size-12 items-center justify-center rounded-md border border-accent bg-accent/20 font-mono text-2xl font-bold text-accent"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    value={comboCode}
                    onChange={(e) => setComboCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    placeholder="Enter 5-digit code..."
                    className="font-mono text-lg"
                    maxLength={5}
                  />
                  <Button onClick={handleUnlock} className="w-full">
                    UNLOCK DOOR 2
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Mission Progress</CardTitle>
            <CardDescription>Track your intel collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ROUND1_QUESTIONS.map((q, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-md border p-3 ${
                    idx < numbersCollected.length
                      ? "border-accent/50 bg-accent/10"
                      : idx === round1Index && !isComplete
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-background/50"
                  }`}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded font-mono text-sm font-bold ${
                      idx < numbersCollected.length
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx < numbersCollected.length ? numbersCollected[idx] : "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Fragment #{idx + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {idx < numbersCollected.length
                        ? "Collected"
                        : idx === round1Index && !isComplete
                          ? "In Progress"
                          : "Locked"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">
                Hints used: {hintsUsed}/{MAX_HINTS}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
