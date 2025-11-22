"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function HostDashboard() {
  const { players, logout } = useGame()

  return (
    <div className="container mx-auto space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold text-primary terminal-glow">HOST DASHBOARD</h2>
          <p className="text-sm text-muted-foreground">Monitor all active agents</p>
        </div>
        <Button onClick={logout} variant="outline">
          Logout Host
        </Button>
      </div>

      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono">Active Agents</CardTitle>
          <CardDescription>Real-time mission progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(players).length === 0 ? (
            <div className="rounded-md border border-border bg-background/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">No agents currently active</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono">Agent</TableHead>
                    <TableHead className="font-mono">Round</TableHead>
                    <TableHead className="font-mono">Digits</TableHead>
                    <TableHead className="font-mono">Hints</TableHead>
                    <TableHead className="font-mono">R3 Attempts</TableHead>
                    <TableHead className="font-mono">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(players).map(([agent, data]) => (
                    <TableRow key={agent}>
                      <TableCell className="font-mono font-medium">{agent}</TableCell>
                      <TableCell className="font-mono">{data.round}</TableCell>
                      <TableCell className="font-mono">{data.numbers.join(",") || "-"}</TableCell>
                      <TableCell className="font-mono">{data.hints}</TableCell>
                      <TableCell className="font-mono">{data.r3_attempts}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            data.status === "Escaped"
                              ? "bg-accent/20 text-accent"
                              : data.status === "Failed"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {data.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-border bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="font-mono text-2xl font-bold text-primary">{Object.keys(players).length}</p>
            </div>
            <div className="rounded-md border border-border bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Escaped</p>
              <p className="font-mono text-2xl font-bold text-accent">
                {Object.values(players).filter((p) => p.status === "Escaped").length}
              </p>
            </div>
            <div className="rounded-md border border-border bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="font-mono text-2xl font-bold text-destructive">
                {Object.values(players).filter((p) => p.status === "Failed").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
