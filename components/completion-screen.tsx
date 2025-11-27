"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function CompletionScreen() {
  const { secretKey, currentUser, logout, missionTimeLeft } = useGame()
  const [copied, setCopied] = useState(false)

  if (!secretKey) return null

  // To use: Go to your Google Form > Click "Send" > Copy the form ID from the URL (the long string after /forms/d/)
  const GOOGLE_FORM_ID = "zjmHMMcCGLdXsCLc6" // Updated Google Form ID
  const AGENT_FIELD_ID = "entry.1234567890" // Replace with your "Team Name" field ID
  const SECRET_KEY_FIELD_ID = "entry.0987654321" // Replace with your "Secret Key" field ID

  const googleFormUrl = `https://forms.gle/${GOOGLE_FORM_ID}?usp=pp_url&${AGENT_FIELD_ID}=${encodeURIComponent(currentUser || "")}&${SECRET_KEY_FIELD_ID}=${encodeURIComponent(secretKey)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mission-grid-bg flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-cyan-500 bg-slate-950 p-8 shadow-lg shadow-cyan-500/50">
        <div className="space-y-6">
          {/* Success Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-400">MISSION COMPLETE</h1>
            <p className="mt-2 text-sm text-cyan-400">Classification: SUCCESS</p>
          </div>

          {/* Agent Info */}
          <div className="rounded border border-cyan-500 bg-slate-900 p-4 text-center">
            <p className="text-xs text-gray-400">AGENT CALLSIGN</p>
            <p className="mt-1 font-mono text-xl text-cyan-400">{currentUser}</p>
          </div>

          {/* Time Taken */}
          <div className="rounded border border-cyan-500 bg-slate-900 p-4 text-center">
            <p className="text-xs text-gray-400">MISSION TIME REMAINING</p>
            <p className="mt-1 font-mono text-xl text-green-400">
              {Math.floor(missionTimeLeft / 60)}:{String(missionTimeLeft % 60).padStart(2, "0")}
            </p>
          </div>

          {/* Secret Key */}
          <div className="rounded border border-green-500 bg-slate-900 p-4">
            <p className="text-xs text-gray-400">YOUR SECRET KEY</p>
            <div className="mt-3 flex items-center gap-2">
              <p className="flex-1 font-mono text-lg font-bold text-green-400 break-all">{secretKey}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded bg-yellow-900/20 p-3 text-center">
            <p className="text-sm text-yellow-300">Submit your team name and secret key to claim your victory.</p>
          </div>

          {/* Form Link Button */}
          <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700">SUBMIT COMPLETION REPORT</Button>
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
