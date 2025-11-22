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

export interface CryptoData {
  type: "add" | "mul"
  display: string
  words: string[]
  solutions: Array<{ mapping: Record<string, number>; result: number }>
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
    reward: "4",
    hint: "Think of places that repeat sound.",
  },
  {
    question: "I have keys but no locks. I have space but no rooms. What am I?",
    answer: "keyboard",
    reward: "9",
    hint: "You use it to type.",
  },
  {
    question: "Pattern: 2, 4, 8, 16, ?",
    answer: "32",
    reward: "3",
    hint: "Each term doubles.",
  },
  {
    question: 'Fix: prnt("Hello Agent") — what is the correct function name?',
    answer: "print",
    reward: "7",
    hint: "Standard Python print() function.",
  },
  {
    question: "Which operator checks equality in Python? (example: x __ 10)",
    answer: "==",
    reward: "1",
    hint: "Use the equality operator.",
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

// Simplified cryptarithm examples
export const CRYPTO_TEMPLATES = [
  {
    type: "simple" as const,
    display: "AB + BC = CAD",
    solution: { A: 1, B: 8, C: 2, D: 0 },
    result: 210,
  },
  {
    type: "simple" as const,
    display: "XY × 2 = YX",
    solution: { X: 3, Y: 6 },
    result: 63,
  },
]

export function generateCrypto(): CryptoData {
  const template = CRYPTO_TEMPLATES[Math.floor(Math.random() * CRYPTO_TEMPLATES.length)]

  return {
    type: "add",
    display: template.display,
    words: [],
    solutions: [
      {
        mapping: template.solution,
        result: template.result,
      },
    ],
  }
}
