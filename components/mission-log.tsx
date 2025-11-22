"use client"

import { useGame } from "@/lib/game-context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MissionLog() {
  const { logs } = useGame()

  return (
    <div className="border-t border-primary/30 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <h3 className="mb-2 font-mono text-sm font-bold text-accent">MISSION LOG (LIVE)</h3>
        <ScrollArea className="h-32 rounded-md border border-border bg-background/50 p-3">
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-muted-foreground">[{log.timestamp}]</span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-muted-foreground">System: Awaiting mission initialization...</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
