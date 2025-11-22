"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { MISSION_TIME, generateCrypto, type CryptoData } from "./game-data"

export interface PlayerData {
  round: number
  numbers: string[]
  hints: number
  r3_attempts: number
  status: string
}

interface GameLog {
  timestamp: string
  message: string
}

interface GameContextType {
  currentUser: string | null
  isHost: boolean
  players: Record<string, PlayerData>
  hintsUsed: number
  round1Index: number
  numbersCollected: string[]
  round2Puzzle: any
  round3Crypto: CryptoData | null
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
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [players, setPlayers] = useState<Record<string, PlayerData>>({})
  const [hintsUsed, setHintsUsed] = useState(0)
  const [round1Index, setRound1Index] = useState(0)
  const [numbersCollected, setNumbersCollected] = useState<string[]>([])
  const [round2Puzzle, setRound2PuzzleState] = useState<any>(null)
  const [round3Crypto, setRound3Crypto] = useState<CryptoData | null>(null)
  const [round3Attempts, setRound3Attempts] = useState(3)
  const [missionTimeLeft, setMissionTimeLeft] = useState(MISSION_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [logs, setLogs] = useState<GameLog[]>([])

  const isHost = currentUser === "host"

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { timestamp, message }])
  }, [])

  const login = useCallback(
    (username: string, password: string): boolean => {
      const USERS: Record<string, string> = {
        agent007: "bond",
        agentX: "shadow",
        host: "admin",
      }

      if (USERS[username] === password) {
        setCurrentUser(username)

        if (username !== "host") {
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

          // Reset session for player
          setHintsUsed(0)
          setRound1Index(0)
          setNumbersCollected([])
          setRound2PuzzleState(null)
          setRound3Crypto(null)
          setRound3Attempts(3)
        }

        addLog(`Agent ${username} connected to Mission Nightfall.`)
        return true
      }
      return false
    },
    [addLog],
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
    setRound3Attempts(3)
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
    const crypto = generateCrypto()
    setRound3Crypto(crypto)
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

  // Timer effect
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
    hintsUsed,
    round1Index,
    numbersCollected,
    round2Puzzle,
    round3Crypto,
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
