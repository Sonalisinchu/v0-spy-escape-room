"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, UserPlus } from "lucide-react"

export function HostDashboard() {
  const { players, logout, agentCredentials, addAgentCredential, removeAgentCredential, clearAllAgents } = useGame()
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newDisplayName, setNewDisplayName] = useState("")
  const [error, setError] = useState("")

  const handleAddAgent = () => {
    setError("")
    if (!newUsername || !newPassword || !newDisplayName) {
      setError("All fields are required")
      return
    }

    const success = addAgentCredential(newUsername, newPassword, newDisplayName)
    if (!success) {
      setError("Agent already exists")
      return
    }

    setNewUsername("")
    setNewPassword("")
    setNewDisplayName("")
  }

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
          <CardTitle className="font-mono">Agent Management</CardTitle>
          <CardDescription>Create and manage agent credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono text-xs">
                Username
              </Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="agent001"
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="password"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-mono text-xs">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Agent Smith"
                className="font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddAgent} className="w-full font-mono">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {agentCredentials.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-medium">Registered Agents ({agentCredentials.length})</h3>
                <Button onClick={clearAllAgents} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">Username</TableHead>
                      <TableHead className="font-mono">Password</TableHead>
                      <TableHead className="font-mono">Display Name</TableHead>
                      <TableHead className="font-mono">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentCredentials.map((agent) => (
                      <TableRow key={agent.username}>
                        <TableCell className="font-mono">{agent.username}</TableCell>
                        <TableCell className="font-mono">{agent.password}</TableCell>
                        <TableCell className="font-mono">{agent.displayName}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => removeAgentCredential(agent.username)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-border bg-background/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">No agents registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>

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
                      <TableCell className="font-mono font-medium">
                        {agentCredentials.find((a) => a.username === agent)?.displayName || agent}
                      </TableCell>
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
