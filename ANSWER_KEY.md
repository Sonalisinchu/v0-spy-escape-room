# Spy Mission: Answer Key

## Round 1: Intel Extraction

| Question | Answer | Reward Digit | Hint |
|----------|--------|--------------|------|
| I speak without a mouth and hear without ears. What am I? | **echo** | **6** | It repeats sound. |
| Pattern: 9 → 18 → 36 → 72 → ? (what's next?) | **144** | **2** | Each term doubles. |
| How do you define a function in Python? (single keyword) | **def** | **8** | Starts a function block. |
| I have branches but no fruit, trunk or leaves. What am I? | **bank** | **5** | Money place. |
| Operator for not equal in Python? | **!=** | **4** | Two-character operator. |

**Combined Door 2 Code:** `62854`

---

## Round 2: Code Decoding

### Puzzle 1
\`\`\`python
n = 4
total = 0
for i in range(n):
    for j in range(i+1):
        total += (i*j) + 1
print(total)
\`\`\`
**Answer:** `21`  
**Hint:** Inner loop runs 1,2,3,4 times.

### Puzzle 2 (bitwise)
\`\`\`python
x = 13
y = 6
res = 0
for k in range(4):
    res += (x & y) << k
    x = x >> 1
    y = y >> 1
print(res)
\`\`\`
**Answer:** `20`  
**Hint:** AND bits and shift left by k each iteration.

### Puzzle 3 (cumulative)
\`\`\`python
arr = [2,3,5,7]
val = 1
s = 0
for a in arr:
    val *= a
    s += val
print(s)
\`\`\`
**Answer:** `254`  
**Hint:** Running products are summed.

### Puzzle 4
\`\`\`python
x = 0
for i in range(1,7):
    if i % 2 == 0:
        x += i // 2
    else:
        x += i
print(x)
\`\`\`
**Answer:** `15`  
**Hint:** Odds add i; evens add i//2.

---

## Round 3: Laser Grid Navigation

The laser grid is **procedurally generated** each game session, so there is no fixed answer. However:

- **Grid Size:** 5×5
- **Start Position:** (0, 0) - top-left
- **Goal Position:** (4, 4) - bottom-right
- **Obstacles:** ~28% density (lasers)
- **Solution:** A guaranteed safe path exists from start to goal
- **Input Format:** Sequence of U/D/L/R commands (Up, Down, Left, Right)
- **Attempts:** 3 total
- **Hint:** Reveals 2 safe coordinates from the solution path

**Note:** The solution path is calculated using BFS (Breadth-First Search) algorithm during grid generation and stored in `laserGrid.solutionPath`. Each game instance will have a different grid and solution.

### Example Path Format
- `RRDDDR` = Right, Right, Down, Down, Down, Right
- `DDDDRRRR` = Down×4, Right×4
- `RDRDRDRD` = Right-Down repeated 4 times

---

## Game Credentials

| Username | Password | Role |
|----------|----------|------|
| agent007 | bond | Player |
| agentX | shadow | Player |
| host | admin | Host Dashboard |

---

## Scoring & Penalties

- **Max Hints:** 2 total across all rounds
- **Hint Penalty:** 5 seconds added to mission time
- **Mission Duration:** 20 minutes (1200 seconds)
- **Round 3 Attempts:** 3 attempts to navigate laser grid

---

## Game Flow

1. **Login** → Choose agent credentials
2. **Round 1** → Answer 5 questions to collect 5 digits
3. **Door 2 Unlock** → Enter combined 5-digit code
4. **Round 2** → Solve random Python code puzzle
5. **Round 3** → Navigate laser grid from start to goal
6. **Mission Complete** → Successful escape or failure
