// Game configuration and data

export interface Round1Question {
  question: string
  answer: string
  reward: string
  hint: string
}

export interface CodePuzzle {
  display: string
  code: string
  answer: string
  hint: string
}

export interface LaserGrid {
  size: number
  grid: number[][] // 0 = safe, 1 = laser
  start: [number, number]
  goal: [number, number]
  solutionPath: Array<[number, number]>
}

export const USERS: Record<string, string> = {
  agent007: "bond",
  agentX: "shadow",
  host: "admin",
}

export const MAX_HINTS = 2
export const HINT_PENALTY = 5
export const MISSION_TIME = 20 * 60 // 20 minutes in seconds

export const ROUND1_QUESTIONS: Round1Question[] = [
  {
    question: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo",
    reward: "6",
    hint: "It repeats sound.",
  },
  {
    question: "Pattern: 9 → 18 → 36 → 72 → ? (what's next?)",
    answer: "144",
    reward: "2",
    hint: "Each term doubles.",
  },
  {
    question: "How do you define a function in Python? (single keyword)",
    answer: "def",
    reward: "8",
    hint: "Starts a function block.",
  },
  {
    question: "I have branches but no fruit, trunk or leaves. What am I?",
    answer: "bank",
    reward: "5",
    hint: "Money place.",
  },
  {
    question: "Operator for not equal in Python?",
    answer: "!=",
    reward: "4",
    hint: "Two-character operator.",
  },
]

export const CODE_PUZZLES: CodePuzzle[] = [
  {
    display: "Puzzle 1",
    code: `n = 4
total = 0
for i in range(n):
    for j in range(i+1):
        total += (i*j) + 1
print(total)`,
    answer: "21",
    hint: "Inner loop runs 1,2,3,4 times.",
  },
  {
    display: "Puzzle 2 (bitwise)",
    code: `x = 13
y = 6
res = 0
for k in range(4):
    res += (x & y) << k
    x = x >> 1
    y = y >> 1
print(res)`,
    answer: "20",
    hint: "AND bits and shift left by k each iteration.",
  },
  {
    display: "Puzzle 3 (cumulative)",
    code: `arr = [2,3,5,7]
val = 1
s = 0
for a in arr:
    val *= a
    s += val
print(s)`,
    answer: "254",
    hint: "Running products are summed.",
  },
  {
    display: "Puzzle 4",
    code: `x = 0
for i in range(1,7):
    if i % 2 == 0:
        x += i // 2
    else:
        x += i
print(x)`,
    answer: "15",
    hint: "Odds add i; evens add i//2.",
  },
]

export function generateLaserGrid(size = 5, obstacleProbability = 0.28): LaserGrid {
  const grid: number[][] = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0))

  // Carve a guaranteed path from (0,0) to (size-1, size-1)
  const path: Array<[number, number]> = [[0, 0]]
  let [r, c] = [0, 0]

  while (r !== size - 1 || c !== size - 1) {
    const choices: Array<[number, number]> = []
    if (r < size - 1) choices.push([r + 1, c])
    if (c < size - 1) choices.push([r, c + 1])
    if (r > 0 && Math.random() < 0.08) choices.push([r - 1, c])
    if (c > 0 && Math.random() < 0.08) choices.push([r, c - 1])

    const [nr, nc] = choices[Math.floor(Math.random() * choices.length)]
    r = nr
    c = nc
    if (!path.some(([pr, pc]) => pr === r && pc === c)) {
      path.push([r, c])
    }
  }

  // Mark path as safe
  for (const [pr, pc] of path) {
    grid[pr][pc] = 0
  }

  // Add obstacles to non-path cells
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!path.some(([pr, pc]) => pr === i && pc === j)) {
        if (Math.random() < obstacleProbability) {
          grid[i][j] = 1
        }
      }
    }
  }

  // Verify path exists using BFS
  if (!hasPath(grid, size)) {
    // If no path, clear all obstacles along guaranteed path
    for (const [pr, pc] of path) {
      grid[pr][pc] = 0
    }
  }

  return {
    size,
    grid,
    start: [0, 0],
    goal: [size - 1, size - 1],
    solutionPath: path,
  }
}

function hasPath(grid: number[][], size: number): boolean {
  if (grid[0][0] === 1) return false

  const visited: boolean[][] = Array(size)
    .fill(false)
    .map(() => Array(size).fill(false))
  const queue: Array<[number, number]> = [[0, 0]]
  visited[0][0] = true

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    if (r === size - 1 && c === size - 1) return true

    for (const [dr, dc] of directions) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc] && grid[nr][nc] === 0) {
        visited[nr][nc] = true
        queue.push([nr, nc])
      }
    }
  }

  return false
}
