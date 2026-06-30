# Phase 1: Định hình — Draft

## 1.1 Game Concept

Soko Pipe = sokoban + tunnel mechanic. Player đẩy box để mở đường, nhưng box ống có thể đi xuyên qua nếu đúng hướng. Cùng 1 object vừa là vật cản vừa là đường đi → mỗi level là bài toán "đẩy hay xuyên?"

- Thể loại: puzzle / sokoban variant
- Platform: Web (Three.js)
- Single player
- Session: 1-3 phút/level
- Tham chiếu: Sokoban (push), Baba Is You (rule twist), Sokobond (simple mechanic deep puzzle)

## 1.2 Game Pillars

1. **Dual-use** — cùng 1 box, 2 cách tương tác. Quyết định đẩy hay xuyên = core decision
2. **Teach by play** — zero text tutorial, level layout buộc player tự khám phá mechanic
3. **Short & sharp** — level nhỏ, fail nhanh, retry 0 cost, mỗi level xong trong 1-3 phút

## 1.3 Core Loop

Chọn level → quan sát grid → đẩy/xuyên box → đến đích → unlock level tiếp

## 1.4 USP (Unique Selling Point)

Sokoban thường: box = vật cản, đẩy ra khỏi đường.
Soko Pipe: box ống = vật cản HOẶC đường đi tùy hướng. 1 object 2 vai trò → depth gấp đôi cùng grid size.

## 1.5 Art Direction

- 3D isometric, low-poly mesh
- Box thường = cube đặc
- Box ống = cylinder rỗng, nhìn thấy lỗ xuyên
- Màu phân biệt rõ từng loại object
- Camera: isometric cố định
