"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { MISSION_TIME, type CryptoData } from "./game-data"

export interface PlayerData {
  round: number
  numbers: string[]
  hints: number
  r3_attempts: number
  status: string
}

export interface AgentCredential {
  username: string
  password: string
  displayName: string
}

interface GameLog {
  timestamp: string
  message: string
}

interface LaserGrid {
  size: number
  lasers: Set<string>
  solution: string[]
}

interface GameContextType {
  currentUser: string | null
  isHost: boolean
  players: Record<string, PlayerData>
  agentCredentials: AgentCredential[]
  addAgentCredential: (username: string, password: string, displayName: string) => boolean
  removeAgentCredential: (username: string) => void
  clearAllAgents: () => void
  hintsUsed: number
  round1Index: number
  numbersCollected: string[]
  round2Puzzle: any
  round3Crypto: CryptoData | null
  laserGrid: LaserGrid | null
  round3Attempts: number
  missionTimeLeft: number
  timerRunning: boolean
  logs: GameLog[]
  login: (username: string, password: string) => boolean
  logout: () => void
  addLog: (message: string) => void
  consumeHint: () => void
  collectNumber: (number: string) => void
  advanceRound1: () => void
  setRound2Puzzle: (puzzle: any) => void
  initRound3: () => void
  decrementR3Attempts: () => void
  updatePlayerStatus: (status: string) => void
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  updatePlayerData: (updates: Partial<PlayerData>) => void
  resetToRound1: () => void
  missionComplete: boolean
  secretKey: string | null
  setMissionComplete: (complete: boolean, key?: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [players, setPlayers] = useState<Record<string, PlayerData>>({})
  const [agentCredentials, setAgentCredentials] = useState<AgentCredential[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [round1Index, setRound1Index] = useState(0)
  const [numbersCollected, setNumbersCollected] = useState<string[]>([])
  const [round2Puzzle, setRound2PuzzleState] = useState<any>(null)
  const [round3Crypto, setRound3Crypto] = useState<CryptoData | null>(null)
  const [laserGrid, setLaserGrid] = useState<LaserGrid | null>(null)
  const [round3Attempts, setRound3Attempts] = useState(3)
  const [missionTimeLeft, setMissionTimeLeft] = useState(MISSION_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [logs, setLogs] = useState<GameLog[]>([])
  const [missionComplete, setMissionCompleteState] = useState(false)
  const [secretKey, setSecretKey] = useState<string | null>(null)

  const isHost = currentUser === "host"

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { timestamp, message }])
  }, [])

  const addAgentCredential = useCallback((username: string, password: string, displayName: string): boolean => {
    if (!username || !password || !displayName) return false

    setAgentCredentials((prev) => {
      if (prev.some((agent) => agent.username === username)) {
        return prev
      }
      return [...prev, { username, password, displayName }]
    })
    return true
  }, [])

  const removeAgentCredential = useCallback((username: string) => {
    setAgentCredentials((prev) => prev.filter((agent) => agent.username !== username))
  }, [])

  const clearAllAgents = useCallback(() => {
    setAgentCredentials([])
  }, [])

  const login = useCallback(
    (username: string, password: string): boolean => {
      if (username === "host" && password === "admin") {
        setCurrentUser(username)
        addLog(`Host connected to Mission Control.`)
        return true
      }

      const agent = agentCredentials.find((a) => a.username === username && a.password === password)

      if (agent) {
        setCurrentUser(username)

        setPlayers((prev) => ({
          ...prev,
          [username]: prev[username] || {
            round: 1,
            numbers: [],
            hints: 0,
            r3_attempts: 3,
            status: "In Round 1",
          },
        }))

        setTimerRunning(true)

        setHintsUsed(0)
        setRound1Index(0)
        setNumbersCollected([])
        setRound2PuzzleState(null)
        setRound3Crypto(null)
        setLaserGrid(null)
        setRound3Attempts(3)

        addLog(`Agent ${agent.displayName} (${username}) connected to OPERATION: ESCAPE ROOM.`)
        return true
      }

      return false
    },
    [addLog, agentCredentials],
  )

  const logout = useCallback(() => {
    if (currentUser) {
      addLog(`Agent ${currentUser} disconnected.`)
    }
    setCurrentUser(null)
    setHintsUsed(0)
    setRound1Index(0)
    setNumbersCollected([])
    setRound2PuzzleState(null)
    setRound3Crypto(null)
    setLaserGrid(null)
    setRound3Attempts(3)
    setMissionCompleteState(false)
    setSecretKey(null)
  }, [currentUser, addLog])

  const consumeHint = useCallback(() => {
    setHintsUsed((prev) => prev + 1)
    if (currentUser && currentUser !== "host") {
      setPlayers((prev) => ({
        ...prev,
        [currentUser]: { ...prev[currentUser], hints: prev[currentUser].hints + 1 },
      }))
    }
  }, [currentUser])

  const collectNumber = useCallback(
    (number: string) => {
      setNumbersCollected((prev) => [...prev, number])
      if (currentUser && currentUser !== "host") {
        setPlayers((prev) => ({
          ...prev,
          [currentUser]: {
            ...prev[currentUser],
            numbers: [...prev[currentUser].numbers, number],
          },
        }))
      }
    },
    [currentUser],
  )

  const advanceRound1 = useCallback(() => {
    setRound1Index((prev) => prev + 1)
  }, [])

  const setRound2Puzzle = useCallback(
    (puzzle: any) => {
      setRound2PuzzleState(puzzle)
      if (currentUser && currentUser !== "host") {
        setPlayers((prev) => ({
          ...prev,
          [currentUser]: { ...prev[currentUser], round: 2 },
        }))
      }
    },
    [currentUser],
  )

  const initRound3 = useCallback(() => {
    const grid = generateLaserGrid()
    setLaserGrid(grid)
    setRound3Attempts(3)
    if (currentUser && currentUser !== "host") {
      setPlayers((prev) => ({
        ...prev,
        [currentUser]: { ...prev[currentUser], round: 3, r3_attempts: 3 },
      }))
    }
  }, [currentUser])

  const decrementR3Attempts = useCallback(() => {
    setRound3Attempts((prev) => {
      const newVal = prev - 1
      if (currentUser && currentUser !== "host") {
        setPlayers((prevPlayers) => ({
          ...prevPlayers,
          [currentUser]: { ...prevPlayers[currentUser], r3_attempts: newVal },
        }))
      }
      return newVal
    })
  }, [currentUser])

  const updatePlayerStatus = useCallback(
    (status: string) => {
      if (currentUser && currentUser !== "host") {
        setPlayers((prev) => ({
          ...prev,
          [currentUser]: { ...prev[currentUser], status },
        }))
        if (status === "Escaped" || status === "Failed") {
          setTimerRunning(false)
        }
      }
    },
    [currentUser],
  )

  const startTimer = useCallback(() => {
    setTimerRunning(true)
  }, [])

  const stopTimer = useCallback(() => {
    setTimerRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setTimerRunning(false)
    setMissionTimeLeft(MISSION_TIME)
  }, [])

  const updatePlayerData = useCallback(
    (updates: Partial<PlayerData>) => {
      if (currentUser && currentUser !== "host") {
        setPlayers((prev) => ({
          ...prev,
          [currentUser]: { ...prev[currentUser], ...updates },
        }))
      }
    },
    [currentUser],
  )

  const resetToRound1 = useCallback(() => {
    setHintsUsed(0)
    setRound1Index(0)
    setNumbersCollected([])
    setRound2PuzzleState(null)
    setLaserGrid(null)
    setRound3Attempts(3)

    if (currentUser && currentUser !== "host") {
      setPlayers((prev) => ({
        ...prev,
        [currentUser]: {
          round: 1,
          numbers: [],
          hints: 0,
          r3_attempts: 3,
          status: "Restarting from Round 1",
        },
      }))
      addLog(`Agent ${currentUser}: Failed Round 3. Restarting from Round 1. Timer continues.`)
    }
  }, [currentUser, addLog])

  const setMissionComplete = useCallback((complete: boolean, key?: string) => {
    setMissionCompleteState(complete)
    if (complete && key) {
      setSecretKey(key)
      setTimerRunning(false)
    }
  }, [])

  useEffect(() => {
    if (!timerRunning) return

    const interval = setInterval(() => {
      setMissionTimeLeft((prev) => {
        if (prev <= 0) {
          setTimerRunning(false)
          addLog("Mission timer elapsed.")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerRunning, addLog])

  const value: GameContextType = {
    currentUser,
    isHost,
    players,
    agentCredentials,
    addAgentCredential,
    removeAgentCredential,
    clearAllAgents,
    hintsUsed,
    round1Index,
    numbersCollected,
    round2Puzzle,
    round3Crypto,
    laserGrid,
    round3Attempts,
    missionTimeLeft,
    timerRunning,
    logs,
    login,
    logout,
    addLog,
    consumeHint,
    collectNumber,
    advanceRound1,
    setRound2Puzzle,
    initRound3,
    decrementR3Attempts,
    updatePlayerStatus,
    startTimer,
    stopTimer,
    resetTimer,
    updatePlayerData,
    resetToRound1,
    missionComplete,
    secretKey,
    setMissionComplete,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

function generateLaserGrid(): LaserGrid {
  const size = 5
  const lasers = new Set<string>()

  // Fixed 5x5 grid layout: 0 = safe, 1 = laser
  const gridLayout = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ]

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gridLayout[r][c] === 1) {
        lasers.add(`${r},${c}`)
      }
    }
  }

  const solution = ["D", "D", "R", "R", "D", "R", "R", "D"]

  return { size, lasers, solution }
}
