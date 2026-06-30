# Phase 5: Technical — Draft

## 5.1 Stack

- Three.js (render 3D mesh)
- TypeScript hoặc vanilla JS
- Grid logic = 2D array

## 5.2 Level Data Format

Dùng số, template string / 2D array:

| Giá trị | Object |
|---------|--------|
| 0 | Sàn trống |
| 1 | Tường |
| 2 | Player (source) |
| 3 | Goal |
| 4 | Box thường |
| 5 | Ống ngang |
| 6 | Ống dọc |
| 7 | Connector đa hướng |

Out of scope trong MVP: key/door, directional corner, color gate, enemy.

```js
const level1 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 2, 0, 5, 0, 3, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]
```

## 5.3 Level Scope

| Chapter | Level | Grid |
|---------|-------|------|
| 1 | 1-6 | linh động, nhỏ/gọn |
| 2 | 7-11 | linh động, bridge/access rõ |
| 3 | 12-14 | linh động, connector route/build |

## 5.4 Core Systems

| System | Mô tả |
|--------|-------|
| Grid | Parse level array → render mesh |
| Input | Arrow keys / WASD / swipe → direction |
| Move | Validate → push logic → tunnel pass-through |
| Tunnel check | Từ ô player, follow hướng ống đến khi ra sàn trống hoặc bị chặn |
| Undo | Stack of grid states, pop on undo |
| Win check | Player position === goal position |
| Level manager | Load level, reset, next level, unlock |

## 5.5 Thứ tự build

1. Grid render + player move (30 phút)
2. Push logic (30 phút)
3. Tunnel pass-through (30 phút)
4. Undo + reset (15 phút)
5. Level manager + 14 level data (45 phút)
6. UI: menu, level select, win panel (30 phút)
7. Polish: animation, mesh, sound (30 phút)

Tổng: ~4 tiếng
