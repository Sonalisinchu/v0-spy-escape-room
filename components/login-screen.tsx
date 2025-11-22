"use client"

import type React from "react"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginScreen() {
  const { login, startTimer, resetTimer, missionTimeLeft, timerRunning } = useGame()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(username, password)
    if (!success) {
      setError("Invalid credentials. Access denied.")
    }
  }

  const minutes = Math.floor(missionTimeLeft / 60)
  const seconds = missionTimeLeft % 60

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
        {/* Mission Briefing */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 font-mono text-2xl font-bold text-primary terminal-glow">MISSION BRIEFING</h2>
            <div className="h-1 w-20 bg-accent" />
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
            <p>Agent, your target infiltrated a secure vault. Your objectives:</p>

            <ol className="list-inside list-decimal space-y-2 border-l-2 border-accent pl-4">
              <li>Extract five intel fragments (Round 1).</li>
              <li>Decode enemy communication (Round 2).</li>
              <li>Solve the cryptarithm lock (Round 3) to escape.</li>
            </ol>

            <p className="rounded-md border border-primary/30 bg-primary/5 p-3">
              You will have limited hints (max 2). Round 3 allows 3 attempts and one special hint. Proceed carefully —
              mission control will monitor your progress.
            </p>
          </div>

          <div className="space-y-3 rounded-md border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium text-accent">MISSION TIMER:</span>
              <span className="font-mono text-2xl font-bold text-accent">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={startTimer}
                disabled={timerRunning}
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Start Timer
              </Button>
              <Button onClick={resetTimer} size="sm" variant="outline" className="flex-1 bg-transparent">
                Reset Timer
              </Button>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex items-center">
          <Card className="w-full border-primary/30 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mono text-primary">Agent Login</CardTitle>
              <CardDescription>Enter your credentials to access the mission</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-mono text-xs">
                    Agent ID
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="agent007"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-mono text-xs">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="font-mono"
                  />
                </div>

                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full font-mono">
                  CONNECT TO MISSION
                </Button>

                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-mono font-medium">Example credentials:</p>
                  <p>agent007 / bond</p>
                  <p>agentX / shadow</p>
                  <p>{""}</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
