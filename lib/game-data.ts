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
export const MISSION_TIME = 25 * 60 // 25 minutes in seconds

export const ROUND1_QUESTIONS: Round1Question[] = [
  {
    question: "Riddle: I shrink smaller every time I take a bath. What am I?",
    answer: "soap",
    reward: "7",
    hint: "Think of what gets smaller as you use it in water.",
  },
  {
    question: "Riddle: I can be written, I can be spoken, I can be exposed, but I can also be hidden. What am I?",
    answer: "secret",
    reward: "5",
    hint: "A thing spies love and hide.",
  },
  {
    question: "Pattern: 4, 9, 19, 39, 79, ? — what comes next?",
    answer: "159",
    reward: "3",
    hint: "Each term ≈ previous ×2 + 1.",
  },
  {
    question: "Syntax: Fix the code `if x = 5:` — what is the correct operator to compare?",
    answer: "==",
    reward: "8",
    hint: "Equality check uses two characters.",
  },
  {
    question: 'Python output: What does this print? `print("Agent" * 2 + "7")`',
    answer: "agentagent7",
    reward: "4",
    hint: "String repetition and concatenation.",
  },
]

export const CODE_PUZZLES: CodePuzzle[] = [
  {
    display: "Puzzle A",
    code: `s = 0
for i in range(1, 6):
    s += i * (i + 2)
print(s)`,
    answer: "85",
    hint: "Compute i*(i+2) for i=1..5 then sum.",
  },
  {
    display: "Puzzle B (bitwise)",
    code: `x = 27
y = 14
r = 0
for k in range(3):
    r += (x ^ y) << k
    x >>= 1
    y >>= 1
print(r)`,
    answer: "61",
    hint: "Compute XOR each round and left-shift by k.",
  },
  {
    display: "Puzzle C",
    code: `arr = [1,3,2,4]
s = 0
for i in range(len(arr)):
    if i % 2 == 0:
        s += arr[i] * 3
    else:
        s += arr[i] * 2
print(s)`,
    answer: "23",
    hint: "Even indices ×3, odd indices ×2; sum.",
  },
  {
    display: "Puzzle D",
    code: `x = 1
for i in range(1, 6):
    if i % 2 == 0:
        x += i*i
    else:
        x += i
print(x)`,
    answer: "30",
    hint: "Add i for odd i; add i^2 for even i; start x=1.",
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
