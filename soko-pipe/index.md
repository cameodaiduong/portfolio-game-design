# Soko Pipe — Game Design Document

> Sokoban variant: push boxes + traverse through pipes/tunnels if aligned correctly.
> Platform: Web (Three.js). Portfolio game.
> Scope MVP: 14 levels, 3 mechanic layers.

---

## 1. Overview

### 1.1 Game Concept

Soko Pipe is a sokoban variant combined with a tunnel mechanic. Players push boxes to clear paths, but pipe boxes can be traversed if aligned correctly. The same object is both an obstacle and a pathway, so each level revolves around the question "push or traverse?"

- Genre: puzzle / sokoban variant
- Platform: Web browser
- Single player
- Session: 1-3 minutes/level
- Scope MVP: 14 levels, 3 main mechanics: push, straight tunnel, connector
- References: Sokoban (push), Baba Is You (rule twist), Sokobond (simple mechanic, deep puzzle)

### 1.2 Game Pillars

1. **Dual-use** — same box, 2 interaction modes. Deciding to push or traverse is the core choice each step
2. **Teach by play** — zero text tutorial, level layout forces players to discover mechanics on their own
3. **Short & sharp** — small levels, fast failure, zero retry cost, each level completable in 1-3 minutes

### 1.3 Core Loop

Select level, observe grid, push or traverse boxes, reach goal, unlock next level

### 1.4 USP

In standard sokoban, boxes are only obstacles — players push them out of the way.
In Soko Pipe, pipe boxes are both obstacles and pathways depending on alignment. The same object has 2 roles, adding puzzle depth without increasing map size.

### 1.5 Art Direction

- 3D isometric, low-poly mesh
- Normal box is a solid cube
- Pipe box is a hollow cylinder, visible through-hole
- Colors clearly distinguish each object type
- Camera: fixed isometric

---

## 2. Gameplay

### 2.1 Game Objects

| ID | Name | Group | Visual (mesh) | Interaction |
|----|------|-------|---------------|-------------|
| `0` | Empty floor | Tile | flat tile | Player can walk through |
| `1` | Wall | Tile | solid dark cube | Blocks movement, push, and tunnel |
| `2` | Player | Actor | small character | Moves in 4 directions, pushes objects, traverses tunnels |
| `3` | Goal | Tile endpoint | yellow highlighted tile | Player wins the level upon reaching this |
| `4` | Normal box | Push object | solid gray cube | Can be pushed, blocks path, cannot be traversed |
| `5` | Horizontal box | Tunnel box | hollow horizontal cylinder | Can be pushed; entry/traverse tunnel left-right |
| `6` | Vertical box | Tunnel box | hollow vertical cylinder | Can be pushed; entry/traverse tunnel up-down |
| `7` | Connector | Tunnel box | multi-directional junction | Can be pushed; joins/bends route after route starts from `5/6` |

### 2.2 Mechanics

Current scope: **14 levels**, focused on 3 mechanic layers:

1. Basic sokoban push
2. Straight tunnel box: horizontal/vertical
3. Connector tunnel box: bending direction and creating routes

Core mechanic: **some boxes are both obstacles to push and pathways to traverse if aligned correctly**. Players must push boxes while aligning tunnel boxes to create routes leading to the goal.

- **Normal box (`4`)**: purely an obstacle/push block in standard sokoban style. Can be pushed 1 tile if the space behind is open. Blocks walking, pushing, and tunneling. Can never be traversed.
- **Horizontal box (`5`) / Vertical box (`6`)**: normally pushed like regular boxes. When correctly aligned with other pipes or the goal, players can step in and traverse through tile by tile.
- **Connector (`7`)**: a route junction piece. Connectors cannot be entered directly from the floor, but when a player is already inside a tunnel, connectors allow routes to bend or connect horizontal/vertical segments.
- **Goal (`3`)**: not a direct walk-to destination. Goals are usually placed behind walls/blocked areas, forcing players to create tunnel routes to reach them.

Each level therefore has 2 puzzle layers simultaneously:

1. **Push puzzle**: stand on the right side, push the right object, in the right order.
2. **Route puzzle**: after pushing, the tunnel must form a valid path for the player to traverse.

No directional corners, key/door, color gates, enemies, or rotate tiles in the portfolio/MVP build.

### 2.3 Push Core

- Player moves in 4 directions (up/down/left/right)
- The game is fundamentally sokoban: most puzzle difficulty comes from standing on the correct side and pushing objects in the right order
- Pushable objects include: normal box `4`, horizontal box `5`, vertical box `6`, connector box `7`
- Pushing a box where the space behind is a wall or another box fails — player stays in place
- Player can only push 1 box at a time, no pulling
- After a successful push, player stands on the box's previous tile

### 2.4 Normal Box

- Normal box is a pure sokoban obstacle/push block
- Pushed 1 tile if the space behind is open/walkable
- Blocks walking, pushing, and tunneling
- Never part of a tunnel route, cannot be traversed
- Used in levels to:
  - Block push positions
  - Force players to clear paths first
  - Create dependency/order in solutions

### 2.5 Tunnel Box

Tunnel boxes are pushable like normal boxes, but when aligned correctly they also become pathways. MVP has 3 types:

#### Horizontal Box

- Straight tunnel box along the left/right axis.
- When `5` connects horizontally with `5`, `7`, or `3`, it forms a valid horizontal pipe.
- Basic valid patterns:
  - `5-5`: 2 horizontal boxes form a horizontal tunnel.
  - `5-3`: horizontal box connects directly to goal.
  - `5-7`: horizontal box connects to connector for route continuation/bending.
- Player enters horizontal pipe from left or right, moving through tile by tile.
- Not yet validly connected means no traversal — push only.

#### Vertical Box

- Straight tunnel box along the up/down axis.
- When `6` connects vertically with `6`, `7`, or `3`, it forms a valid vertical pipe.
- Basic valid patterns:
  - `6-6`: 2 vertical boxes form a vertical tunnel.
  - `6-3`: vertical box connects directly to goal.
  - `6-7`: vertical box connects to connector for route continuation/bending.
- Player enters vertical pipe from top or bottom, moving through tile by tile.
- Not yet validly connected means no traversal — push only.

#### Connector

- Multi-directional tunnel box
- Pushed like a normal box when player approaches from the floor
- Never a tunnel entry point: player cannot start traversing from `7`
- Only activates when connected to 2 valid tunnel ends
- Valid examples: `6-7-3`, `5-7-5`, `6-7-5`
- `5-7` or `6-7` on one side alone is not enough to form a pipe
- When route is valid, player can traverse through connector to go straight or turn
- Used to:
  - Connect horizontal and vertical routes
  - Let routes pass straight through
  - Be pushed into gaps to complete missing routes

### 2.6 Tunnel Traversal

Traversal is **tile-by-tile** movement, each tile costs 1 move. Player does not teleport through the chain.

**Entry (from floor into pipe):**
- Player on floor, moves into `5` horizontally or `6` vertically
- Condition: that pipe is part of a valid route, e.g., `5-3`, `5-5`, `6-7-3`
- If conditions met, player steps into the pipe and stands on the same tile as the pipe, costs 1 move
- If not met, pushes the pipe like a normal box
- `7` (connector) is never an entry point

**Inside (standing on pipe/connector):**
- Each move travels 1 tile in the input direction
- If next tile is a pipe/connector in the correct direction, step through, costs 1 move
- If next tile is floor `0` or goal `3` (no object), step out, costs 1 move
- If next tile is wall/box/wrong-direction object, no movement

**Win:** player steps onto goal tile `3` to win the level

**Example:** `P 0 5 0 3`
```
move 1 →: walk to c1              → 0 P 5 0 3
move 2 →: push 5 to c3            → 0 0 P 5 3
           (tile behind 5 is floor → push, not tunnel)
move 3 →: enter pipe 5            → 0 0 0 [5+P] 3
           (5 is connected to goal forming pattern 5-3, so player stands on same tile as 5)
move 4 →: move from pipe to goal  → 0 0 0 5 P → win
```

### 2.7 Pipe Visual Feedback

- Pipe/connector in a valid route reduces opacity (transparent), player can see the traversal path
- Pushing pipe out of a route restores original opacity (opaque)
- Pipe in a route can still be pushed — pushing breaks the route and visual reverts
- Route check runs after every move (dynamic)

### 2.8 Game Rules

- **Win condition:** player reaches goal tile `3` via tunnel box route
- **Lose condition:** no lose state — puzzle game, mistakes are fixed via undo/reset
- **Undo:** unlimited, step-by-step rewind
- **Reset:** return to level initial state, unlimited

### 2.9 Edge Cases

| Case | Result |
|------|--------|
| `5-7` or `6-7` on one side only | Not a valid pipe; connector needs connections on both ends |
| Player enters connector `7` from floor | Not allowed; connector is not an entry point |
| Pipe already connected into route | Can still be pushed if player approaches as a push object |
| Player inside pipe but moves in wrong route direction | No movement |
| Goal `3` adjacent to normal floor | Cannot win by walking directly; goal must be entered via pipe route |
| Long multi-tile tunnel | No teleport; each tile traversed costs 1 step |
| Connector receives and outputs on same axis | Valid; connector can function as a straight pass-through |

### 2.10 Future Expansion / Out of MVP Scope

Not included in MVP. Can be expanded later.

| Mechanic | Expansion direction | Reason for exclusion from MVP |
|----------|---------------------|-------------------------------|
| Color gate | Pipe/player has color, can only traverse matching color routes | Adds new state, risks pulling focus away from pipe-push core |
| Enemy | Patrolling enemies, player uses tunnels to evade or reposition | Requires separate AI/pathfinding, better suited for later phase |
| Rotate tile | Player rotates pipe or connector direction to change route | Connector already solves direction-bending in MVP |
| Directional corners | Fixed-angle pipe corners like `└`, `┐` for specific route directions | Increases object count to learn; multi-directional connector is sufficient for 14 levels |
| Key/Door | Unlocks areas or new endpoints | Doesn't directly serve the core idea: box as both obstacle and pathway |

---

## 3. Level Design

> All levels are fixed, designer-placed. No random/procedural generation.
> Scope: **14 levels**, for portfolio/intern build.

### 3.1 Design Rules

- **Goal is always inside walls or unreachable by walking** — player must reach goal via pipe/tunnel route
- **Tunnel entry must be a straight pipe** — player can only start traversing from `5` horizontally or `6` vertically
- **Connector cannot be entered directly from floor** — only works when route already started from `5` or `6`
- **Connector must connect 2 valid ends** — e.g., `6-7-3`, `5-7-5`, `6-7-5`; one-sided `5-7` or `6-7` is not enough
- **Tunnel must be a bridge/access tool** — route must bridge across walls/blocked areas or bring player to new push positions
- **No text tutorial** — layout must teach mechanics by itself

### 3.2 Mechanic Progression

| Chapter | Level | Theme | Teaches |
|---------|-------|-------|---------|
| 1 | 1-6 | Straight Pipes Foundation | Push pipe to goal, horizontal/vertical, stand on correct side, box obstacle |
| 2 | 7-11 | Straight Tunnels | Tunnel as bridge/access tool, reaching new areas or push angles |
| 3 | 12-14 | Connector Tunnels | Connector bends route direction, sometimes must push connector to create path |

Core progression:

1. Player learns pipe as **object to push**
2. Player learns pipe as **path to traverse**
3. Player learns pipe/connector as **route to create or align**

Detailed per-level progression:

| Level | Mechanic focus | Design goal |
|-------|----------------|-------------|
| 1 | Horizontal pipe + goal | Teach that pipe can be pushed into goal to create a winning path |
| 2 | Vertical pipe | Same rules, only axis change so player understands `5` and `6` share the same mechanic system |
| 3 | Align before push | Force player to stand on the same axis before pushing pipe |
| 4 | Push from behind | Teach going around to stand on the correct side of the object |
| 5 | Normal box obstacle | Box blocks push position, not route |
| 6 | Straight pipe boss | Combines horizontal, vertical, box, and clearing order |
| 7 | First straight tunnel | Teach tunnel as bridge/access, not just an endpoint into goal |
| 8 | Multi-axis tunnel | Use vertical tunnel to open path to horizontal tunnel |
| 9 | Align tunnel pieces | Align 2 vertical pipes on the same axis to create a bridge, then use it to reach the top lane and traverse horizontal pipe into goal |
| 10 | Tunnel + box dependency | Use tunnel to reach new area, then clear box/push pipe |
| 11 | Straight tunnel boss | Tests route reading, access side, box order, and push positioning |
| 12 | Connector as route piece | Connector sits within a movement route, not as an entry point |
| 13 | Connector turn | Connector changes route direction, player must read the bend |
| 14 | Build connector route | Final test: push connector into the right position to create a movement path |

### 3.3 Chapter Structure

| Role | Characteristics |
|------|-----------------|
| Learn | 1 new concept, 1 main path, minimal noise |
| Practice | Added positioning or obstacle objects |
| Test | Combo of old + new mechanics, may have readable traps/dead-ends |
| Boss | Longer route, requires planning 2-3 steps ahead, no new rules introduced |

Difficulty increases through:
- dependency/order between box, pipe, connector
- push standing position
- route access bringing player to the back side of objects
- requiring self-created endpoints/tunnels before winning

### 3.4 Map Tightness

Every floor tile should have a reason to exist:
- Position where player needs to stand to push
- Intentional return/reposition path
- Tile for box/pipe/connector to pass through in solution
- Readable losing option/trap
- Necessary space for level readability

If a floor tile doesn't affect the solution, doesn't create choice, and doesn't improve layout readability, make it a wall.

### 3.5 Difficulty Curve

```
Difficulty
  ▲
  │                 ╱‾‾‾╲
  │          ╱‾‾╲  ╱     ╲
  │    ╱‾‾╲ ╱    ╲╱       ╲
  │___╱    ╲      dip       ╲
  └────────────────────────────► Level
    1-6     7-11     12-14
    Ch.1    Ch.2     Ch.3
```

Each chapter start has a slight dip to introduce new mechanics. Then difficulty increases through combination, not hidden new rules.

### 3.6 Level Layouts

> Legend: 0 floor, 1 wall, 2 player, 3 goal, 4 box, 5 horizontal box, 6 vertical box, 7 connector
> Steps = number of movement inputs, counting walk, push, enter pipe, traverse pipe.

---

#### Chapter 1: Straight Pipes Foundation (Level 1-6)

**Level 1 — Horizontal intro**

Teaches: a single pipe is pushed like a box; pipe touching goal becomes a path to traverse into goal.

```
1 1 1 1 1
1 2 5 0 3
1 1 1 1 1
```

- Grid: 5×3
- Steps: 3
- Solution: →, →, →
- Flow: push horizontal pipe right 1 tile, step into pipe, step out to goal.

**Level 2 — Vertical intro**

Teaches: vertical pipe uses the same rules as horizontal pipe, only axis changes to up/down.

```
1 3 1
1 0 1
1 6 1
1 2 1
1 1 1
```

- Grid: 3×5
- Steps: 3
- Solution: ↑, ↑, ↑
- Flow: push vertical pipe up 1 tile, step into pipe, step up to goal.

**Level 3 — Align with pipe**

Teaches: player must stand on the same axis as the pipe before pushing.

```
1 1 1 1 1 1
1 0 5 0 0 3
1 2 0 1 1 1
1 1 1 1 1 1
```

- Grid: 6×4
- Steps: 5
- Solution: ↑, →, →, →, →
- Flow: step up to align with pipe, push pipe right twice, step into pipe, step out to goal.

**Level 4 — Behind the pipe**

Teaches: to push pipe toward goal on the left, player must go around to the right side of the pipe then push back.

```
1 1 1 1 1 1 1
3 0 0 0 5 0 1
1 1 1 1 1 0 1
1 1 1 1 2 0 1
1 1 1 1 1 1 1
```

- Grid: 7×5
- Steps: 8
- Solution: →, ↑, ↑, ←, ←, ←, ←, ←
- Flow: go around through the right corridor, stand to the right of pipe, push pipe left 3 times to next to goal, step into pipe, step out to goal.

**Level 5 — Box obstacle**

Teaches: normal box is not a route; box is something to clear to open push positions for pipe.

```
1 1 1 1 1 1 1
1 0 0 0 1 1 1
1 0 1 4 5 0 3
1 0 1 0 1 1 1
1 2 1 1 1 1 1
1 1 1 1 1 1 1
```

- Grid: 7×6
- Steps: 9
- Solution: ↑, ↑, ↑, →, →, ↓, →, →, →
- Flow: go through left corridor upward, push box down, box's former position becomes standing spot to push pipe next to goal, step into pipe, step out to goal.

**Level 6 — Straight pipe boss**

Teaches: Chapter 1 mini-boss. Horizontal + vertical + box appear together; clear in the right order.

```
1 1 1 1 3 1 1
1 1 1 0 0 1 1
1 2 1 5 4 0 1
1 0 0 0 6 1 1
1 1 1 0 0 1 1
1 1 1 1 1 1 1
```

- Grid: 7×6
- Steps: 13
- Solution: ↓, →, →, ↑, →, ←, ↓, ↓, →, ↑, ↑, ↑, ↑
- Flow:
  - Go below horizontal pipe, push up to clear standing space
  - Push box right to clear the goal column
  - Go around below vertical pipe, push up next to goal
  - Step into pipe, step up to goal

---

#### Chapter 2: Straight Tunnels (Level 7-11)

**Level 7 — Tunnel intro**

Teaches: tunnel bridges across wall to bring player to the other side of a pipe, then push back toward goal.

```
1 1 1 1 1 1 1 1
3 0 0 5 0 0 0 1
1 1 1 1 1 1 0 1
1 2 0 5 0 5 0 1
1 1 1 1 1 1 1 1
```

- Grid: 8×5
- Steps: 13
- Solution: →, →, →, →, →, ↑, ↑, ←, ←, ←, ←, ←, ←
- Flow:
  - Push pipe in row 3 right 1 tile, forming a `5 5` tunnel
  - Step into tunnel, traverse through, step out to floor on the right
  - Go up to row 1 via right corridor
  - Push pipe in row 1 left twice next to goal
  - Step into pipe, step out to goal

**Level 8 — Multi-axis bridge**

Teaches: vertical + horizontal tunnel routes in a single play.

```
1 1 1 1 1 1 1
1 0 0 5 0 5 3
1 6 1 1 1 1 1
1 0 1 1 1 1 1
1 6 1 1 1 1 1
1 0 1 1 1 1 1
1 2 1 1 1 1 1
1 1 1 1 1 1 1
```

- Grid: 7×8
- Steps: 10
- Solution: ↑, ↑, ↑, ↑, ↑, →, →, →, →, →
- Flow:
  - Push `6` up 1 tile, forming a `6 6` vertical tunnel
  - Step into vertical tunnel, traverse through, step out to floor at row 1
  - Push `5` right 1 tile, forming a `5 5` horizontal tunnel next to goal
  - Step into horizontal tunnel, traverse through, step out to goal

---

**Level 9 — Align vertical pipes**

Teaches: push a vertical pipe into alignment with another vertical pipe to create a bridge, then use that bridge to reach the top lane and traverse horizontal pipe into goal.

```
1 1 1 1 1 1 1
1 0 0 5 0 0 3
1 6 1 1 1 1 1
1 0 0 0 0 1 1
1 0 1 6 0 1 1
1 0 0 0 1 1 1
1 2 1 1 1 1 1
1 1 1 1 1 1 1
```

- Grid: 7×8
- Steps: 22
- Solution: ↑, →, →, ↑, →, ↑, ←, ←, →, ↓, ↓, ←, ←, ↑, ↑, ↑, ↑, →, →, →, →, →
- Flow: push second `6` left into alignment with first `6`, form vertical tunnel, traverse up to row 1, push horizontal pipe next to goal, traverse into goal.

**Level 10 — Straight tunnel + box**

Teaches: use tunnel to traverse to another area, clear box, then push pipe next to goal.

```
1 1 1 1 1 1 1 1 1
1 1 0 0 0 0 4 0 3
1 1 1 0 1 5 0 0 1
1 1 1 0 0 0 0 1 1
1 1 1 1 1 1 0 1 1
1 0 0 0 1 1 0 1 1
1 0 1 5 1 1 0 1 1
1 2 0 0 5 0 0 1 1
1 1 1 1 1 1 1 1 1
```

- Grid: 9×9
- Steps: 41
- Solution: ↑, ↑, →, →, ↓, ↑, ←, ←, ↓, ↓, →, →, →, →, →, ↑, ↑, ↑, ↑, ↑, →, ↑, ←, ←, ←, ←, ↓, ↓, →, →, ↑, ↓, ←, ←, ↑, ↑, →, →, →, →, →
- Flow: push pipe down to form horizontal tunnel in row 7, traverse through right corridor upward, clear box to the left, push pipe next to goal, traverse into goal.

**Level 11 — Straight tunnel boss**

Teaches: Ch.2 boss. Clear boxes, align vertical pipes into a bridge, use tunnel to traverse to the right half, push final pipe into goal lane and traverse.

```
1 1 1 1 1 1 1 1 1 1
1 0 0 0 0 0 0 0 0 1
1 6 1 1 1 1 0 6 0 1
1 0 0 1 0 1 0 5 0 1
1 0 4 6 4 1 0 0 1 1
1 0 0 0 0 1 0 0 1 1
1 2 1 1 1 1 1 3 1 1
1 1 1 1 1 1 1 1 1 1
```

- Grid: 10×8
- Steps: 38
- Solution: ↑, →, →, →, ↑, ↓, ←, ←, ↑, ↓, →, →, ↑, ←, ←, ↓, ←, ↑, ↑, ↑, ↑, →, →, →, →, →, ↓, ↓, →, ←, ↑, ↑, →, ↓, ↓, ↓, ↓, ↓
- Flow:
  - Clear 2 boxes out of the way, align vertical pipes into same column forming vertical tunnel
  - Traverse vertical tunnel up to row 1, walk across to right half
  - Push horizontal pipe out, push vertical pipe down next to goal
  - Traverse vertical pipe into goal

---

#### Chapter 3: Connector Tunnels (Level 12-14)

**Level 12 — Connector bridge**

Teaches: connector is a route segment, not an entry point.

```
1 1 1 1 1 1 1
1 2 0 0 0 0 1
1 1 1 4 7 0 1
1 1 0 0 1 1 1
1 1 0 0 0 0 3
1 1 0 0 6 0 1
1 1 1 1 0 0 1
1 1 1 1 1 1 1
```

- Grid: 7×8
- Steps: 36
- Solution: →, →, ↓, ↓, ←, ↓, ↓, →, →, ↑, ←, ↑, ←, ↓, →, ↑, ↑, ↑, →, →, ↓, ←, ↑, ←, ↓, ↓, ←, ↓, →, →, ↓, ↓, →, ↑, ↑, →
- Concept: connector sits within a movement route, bridging across a blocked area
- Flow:
  - Clear box to open reposition space
  - Align vertical pipe and connector into a valid route
  - Use the created route to traverse past wall-blocked area and reach goal

**Level 13 — Reverse bend**

Teaches: connector changes route direction, player must read the bend.

```
1 1 1 1 1 1 1 1 1 1
1 1 0 0 1 1 1 1 1 1
1 1 0 0 0 0 0 0 0 1
1 3 0 1 4 1 1 0 0 1
1 1 1 1 0 6 0 7 1 1
1 1 1 1 0 1 0 0 1 1
1 1 1 1 1 1 2 1 1 1
1 1 1 1 1 1 1 1 1 1
```

- Grid: 10×8
- Steps: 36
- Solution: ↑, →, ↑, ↑, →, ↑, ←, ←, ←, ←, ←, ↑, ←, ↓, →, →, ↓, ↓, →, →, ↓, →, ↑, ↑, →, ↑, ←, ←, ←, ←, ←, ↑, ←, ↓, ↓, ←
- Concept: use vertical pipe as entry, go through connector to change route direction and reach goal
- Flow:
  - Clear box to open movement around the center area
  - Align vertical pipe with connector to create a route with a turning point
  - Traverse route through connector, then reposition to enter goal via valid route

**Level 14 — Connect to move**

Teaches: final test. Player must push connector into the right position to create a route.

```
1 1 1 1 1 1 1 1 1 1 1 1
1 2 0 0 0 0 1 1 1 1 1 1
1 1 0 0 7 0 1 1 1 1 1 1
1 1 0 0 1 1 1 1 1 1 1 1
1 1 0 4 0 5 0 1 1 1 1 1
1 1 0 1 0 1 0 0 0 0 1 1
1 1 0 6 0 1 1 0 1 6 0 1
1 1 0 0 0 1 1 0 0 0 0 1
1 1 1 1 1 1 1 0 1 1 1 1
1 1 1 1 1 1 1 3 1 1 1 1
```

- Grid: 12×10
- Steps: 66
- Solution: →, ↓, ↓, ↓, ↓, ↓, ↓, →, →, ↑, ↑, ↑, ←, →, ↓, ↓, ↓, ←, ←, ↑, ↑, ↑, ↑, ↑, →, ↑, →, →, ↓, ←, ↑, ←, ↓, ↓, ←, ↓, →, ←, ↓, ↓, →, ↓, →, ↑, ↑, ↑, →, →, ↓, →, →, →, ↓, →, ↓, ←, ←, →, ↑, ↑, ←, ←, ↓, ↓, ↓, ↓
- Concept: push connector into gap to create route, then use that route to reach goal
- Flow:
  - Clear box and pipe to open push positions
  - Move connector into position connecting tunnel boxes
  - Use the created route to reach new area, continue repositioning pipe
  - Create final route leading to goal

---

### 3.7 Teach-Through-Play

| Mechanic | How the first level sets it up |
|----------|-------------------------------|
| Push + traverse | L1: horizontal pipe between player and goal-in-wall |
| Vertical pipe | L2: walls block, vertical pipe is the only path |
| Align with pipe | L3: player starts off-axis from pipe |
| Sokoban positioning | L4: must go around to the other side of pipe |
| Box obstacle | L5: box clearly blocks push position |
| Straight tunnel | L7: tunnel bridges across wall, all other paths blocked |
| Tunnel as access | L7-L11: tunnel brings player to new push sides |
| Connector | L12: connector is a segment within a movement route |
| Build connector route | L14: push connector into gap to create route |

### 3.8 Boss / Checkpoint Levels

| Level | Type | Combined mechanics |
|-------|------|-------------------|
| 6 | Ch.1 boss | Horizontal + vertical + box positioning |
| 11 | Ch.2 boss | Straight tunnel + push side access + box/order |
| 14 | MVP final | Connector placement + route creation + existing pipe/tunnel rules |

## 4. UX & Flow

### 4.1 Game Flow

```
Open Prototype -- Gameplay -- Level Complete Popup -- Auto Next Level
                      |                    |
                  Level Select          Export Steps
                      |
                 Reset / Undo
```

Prototype opens directly into gameplay, no menu.

### 4.2 Screens

| Screen | Content |
|--------|---------|
| Gameplay | 3D grid, current level, move count, control panel |
| Level Select | List of 14 levels for quick testing, allows jumping levels in prototype |
| Level Complete Popup | Clear notification, step count, countdown to auto-advance |
| Export Steps | Exports input list in order for GDD/solution reference |

### 4.3 HUD

- Level number
- Move count
- Move history / input sequence
- Undo button
- Reset button
- Export steps button
- Level select / next level control
- Mobile D-pad: up, down, left, right

### 4.4 Unlock Logic

- Portfolio prototype prioritizes quick testing, so all 14 levels are directly selectable
- After clearing level N, game auto-advances to level N+1 after 5 seconds
- No star rating, no optimal step bonus
- Move count is used for solution logging and level length evaluation, not as a score

### 4.5 Input

- Desktop: arrow keys or WASD
- Mobile/iPad: D-pad with 4 directional buttons on UI
- Button UI: Undo, Reset, Export Steps
- Each input counts as 1 movement step
- Undo does not add extra steps

### 4.6 Camera

Fixed isometric. No zoom/pan/rotate. Camera auto-fits to level size, responsive for desktop/mobile.

### 4.7 Feedback

| Action | Feedback |
|--------|----------|
| Push box/pipe | Slide animation 1 tile |
| Traverse tunnel | Player moves tile by tile through pipe, no teleport |
| Push blocked | No movement, light shake |
| Pipe forms tunnel | Boxes in route change color/connect visually to show path |
| Connector valid | Connector changes visual along with route pipes |
| Goal not yet valid | Goal keeps warning/inactive color |
| Goal connected to route | Goal switches to active state and connects to tunnel |
| Win | Large popup, displays step count and auto-next countdown |
| Export steps | Copy/download input solution sequence |
| Undo | Rewind 1 state and update move history |

---

## 5. Technical

### 5.1 Stack

- Three.js (3D mesh rendering)
- Vanilla JavaScript
- HTML/CSS for HUD, popup, mobile controls
- Grid logic uses 2D array

### 5.2 Level Data Format

| Value | Object |
|-------|--------|
| 0 | Empty floor |
| 1 | Wall |
| 2 | Player |
| 3 | Goal |
| 4 | Normal box |
| 5 | Horizontal box |
| 6 | Vertical box |
| 7 | Connector |

```js
const level1 = [
  [1, 1, 1, 1, 1],
  [1, 2, 5, 0, 3],
  [1, 1, 1, 1, 1],
]
```

### 5.3 Core Systems

| System | Description |
|--------|-------------|
| Level parser | Reads 2D array, extracts player position, goal position, and object grid |
| Renderer | Renders floor, wall, player, box, tunnel box, connector, goal as 3D meshes |
| Input | Maps keyboard/D-pad buttons to 4 movement directions |
| Move resolver | Handles walk, push object, block movement, and tunnel traversal |
| Tunnel route check | Checks whether `5/6/7/3` clusters form valid routes |
| Visual state | Changes color/connection visuals for pipe, connector, goal when route is valid |
| Undo/reset | Saves state before each valid move, allows step-by-step undo or level reset |
| Move logging | Records input sequence for move history display and solution export |
| Level manager | Loads 14 levels, handles level transitions, auto-next after clear |
| Responsive UI | Desktop/mobile layout, D-pad for touchscreens |

### 5.4 Prototype Scope

- Playable directly in browser, no backend needed
- 14 fixed levels, no random/procedural generation
- Fixed camera so input is always easy to understand
- Focus on rule clarity, level readability, solution logging
- No save account, leaderboard, monetization, or audio polish in MVP
