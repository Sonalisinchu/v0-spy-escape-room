"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { MAX_HINTS, MISSION_TIME } from "@/lib/game-data"

export function CompletionScreen() {
  const { secretKey, currentUser, logout, missionTimeLeft, hintsUsed } = useGame()
  const [copied, setCopied] = useState(false)

  if (!secretKey) return null

  const GOOGLE_FORM_URL = "https://forms.gle/zjmHMMcCGLdXsCLc6"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timeTaken = MISSION_TIME - missionTimeLeft
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60

  return (
    <div className="mission-grid-bg flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-green-500 bg-slate-950 p-8 shadow-lg shadow-green-500/30">
        <div className="space-y-6">
          {/* Success Header */}
          <div className="text-center">
            <div className="mb-4 text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-green-400 terminal-glow">MISSION COMPLETE</h1>
            <p className="mt-2 text-sm text-cyan-400">Classification: SUCCESS</p>
          </div>

          {/* Agent Info */}
          <div className="rounded border border-cyan-500 bg-slate-900 p-4 text-center">
            <p className="text-xs text-gray-400">AGENT CALLSIGN</p>
            <p className="mt-1 font-mono text-xl text-cyan-400">{currentUser}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-cyan-500 bg-slate-900 p-3 text-center">
              <p className="text-xs text-gray-400">TIME TAKEN</p>
              <p className="mt-1 font-mono text-lg text-green-400">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="rounded border border-cyan-500 bg-slate-900 p-3 text-center">
              <p className="text-xs text-gray-400">HINTS USED</p>
              <p className="mt-1 font-mono text-lg text-yellow-400">
                {hintsUsed}/{MAX_HINTS}
              </p>
            </div>
          </div>

          {/* Secret Key */}
          <div className="rounded border-2 border-green-500 bg-slate-900 p-4">
            <p className="text-xs text-gray-400 text-center mb-2">YOUR SECRET KEY</p>
            <div className="flex items-center gap-2 bg-black/50 rounded p-3">
              <p className="flex-1 font-mono text-lg font-bold text-green-400 break-all text-center">{secretKey}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded bg-yellow-900/30 border border-yellow-500/50 p-4 text-center">
            <p className="text-sm text-yellow-300 font-medium">
              Submit your team name and secret key to claim your victory!
            </p>
          </div>

          {/* Form Link Button */}
          <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 font-mono">
              <ExternalLink className="mr-2 h-5 w-5" />
              SUBMIT COMPLETION REPORT
            </Button>
          </a>

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            LOGOUT
          </Button>
        </div>
      </Card>
    </div>
  )
}
