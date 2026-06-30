# Sokopipe — GDD Checklist

> Sokoban variant: đẩy box + xuyên qua box ống nếu đúng hướng/màu.
> Platform: Web (Three.js, mesh-based). Portfolio game cho Falcon Games intern.

---

## Phase 1: Định hình (Definition)

### 1.1 Game Concept
- [ ] High concept (2 câu mô tả game)
- [ ] Thể loại: puzzle / sokoban variant
- [ ] Platform: Web browser (Three.js)
- [ ] Target audience: casual puzzle player
- [ ] Tham chiếu: Sokoban, Baba Is You, Sokobond

### 1.2 Game Pillars
- [ ] 3 trụ cột trải nghiệm cốt lõi
- Gợi ý: (1) Push & Pass — đẩy hoặc xuyên, cùng 1 object hai cách dùng (2) Teach by play — không tutorial text, level tự dạy (3) One more try — level ngắn, fail nhanh, retry nhanh

### 1.3 Core Loop
- [ ] Vòng lặp hành vi chính: Vào level → quan sát → đẩy/xuyên box → đến đích → unlock level mới
- [ ] Diagram core loop

### 1.4 USP (Unique Selling Point)
- [ ] Sokopipe khác sokoban thường ở đâu: box vừa là vật cản vừa là đường đi

### 1.5 Art Direction
- [ ] Visual style: 3D isometric, low-poly mesh
- [ ] Color palette: phân biệt rõ box thường vs box ống vs ô đặc biệt
- [ ] Camera: isometric cố định hoặc xoay nhẹ

---

## Phase 2: Thiết kế Gameplay (Gameplay Design)

### 2.1 Game Mechanics

| Mechanic | Mô tả | Status |
|----------|--------|--------|
| Box thường | Đẩy được, chặn đường, không xuyên qua | [ ] |
| Ống ngang (-) | Đẩy được, xuyên khi đi trái/phải | [ ] |
| Ống dọc (\|) | Đẩy được, xuyên khi đi lên/xuống | [ ] |
| Ống góc (┘└┐┌) | Đẩy được, xuyên theo hướng góc, hướng cố định | [ ] |
| Tunnel | 2+ ống thông hướng liền nhau = đường đi xuyên | [ ] |
| Key/Door | Lấy key để mở door, key có thể nằm sau tunnel | [ ] |

### 2.2 Game Rules
- [ ] Win condition: player đến ô đích (B)
- [ ] Lose condition: không có — puzzle game, retry thoải mái
- [ ] Undo: có, unlimited undo
- [ ] Reset level: có

### 2.3 Game Objects

| Object | Visual (mesh) | Behavior |
|--------|---------------|----------|
| Player (P) | nhân vật nhỏ | di chuyển 4 hướng, đẩy box, xuyên tunnel |
| Box thường (X) | cube đặc, xám | bị đẩy, chặn đường |
| Ống ngang (-) | cylinder rỗng nằm ngang | bị đẩy, xuyên trái/phải |
| Ống dọc (\|) | cylinder rỗng đứng dọc | bị đẩy, xuyên lên/xuống |
| Ống góc (┘└┐┌) | ống cong góc vuông | bị đẩy, xuyên theo hướng góc |
| Key (K) | icon chìa khoá | player đi qua → nhặt |
| Door (D) | tường có khoá | có key → mở vĩnh viễn |
| Source (1) | tile highlight | điểm xuất phát |
| Goal (2) | tile highlight | player đến → win |
| Tường (W) | cube đặc, tối | không đi qua, không đẩy |
| Sàn (.) | flat tile | đi qua tự do |

---

## Phase 3: Level Design (TRỌNG TÂM)

### 3.1 Mechanic Progression

| Chapter | Level | Mechanic mới | Mục đích dạy |
|---------|-------|-------------|---------------|
| 1 | 1-3 | Box thường + ống ngang | Đẩy vs xuyên |
| 2 | 4-6 | Thêm ống dọc | Hướng ống quyết định xuyên/chặn |
| 3 | 7-9 | Thêm corner (┘└┐┌) | Tunnel rẽ hướng |
| 4 | 10-12 | Multi-segment tunnel | Nối nhiều ống thành đường dài |
| 5 | 13-15 | Key/Door + combo | Xuyên tunnel lấy key, mở door, mastery |

### 3.2 Level Layout
- [ ] 15 level, mỗi level vẽ grid layout (ASCII hoặc hình)
- [ ] Mỗi level ghi rõ: size grid, objects, intended solution, số bước tối ưu
- [ ] 3 level đầu: grid nhỏ (5x5), ít object, 1 solution path
- [ ] Level giữa: grid lớn hơn (6x6, 7x7), nhiều object, 2+ path
- [ ] Level cuối: grid 7x7+, combo mechanic, 1 optimal path

### 3.3 Difficulty Curve
- [ ] Biểu đồ difficulty theo level (trục X: level, trục Y: complexity)
- [ ] Pattern: dễ → dạy mechanic mới (dip) → tăng dần → dạy mechanic mới (dip) → tăng
- [ ] Mỗi chapter bắt đầu = "safe level" dạy mechanic mới ở dạng đơn giản nhất

### 3.4 Teach-through-play Design
- [ ] Mỗi mechanic mới: level đầu tiên chỉ có 1 cách giải → buộc player dùng mechanic mới
- [ ] Không có text tutorial, level layout tự dạy
- [ ] Ghi rõ "dạy gì" cho mỗi level

---

## Phase 4: UX & Flow

### 4.1 Game Flow
- [ ] Sơ đồ: Main Menu → Level Select → Gameplay → Win Panel → Level Select
- [ ] Không cần: settings phức tạp, account, social

### 4.2 HUD (in-game)
- [ ] Level number
- [ ] Move count
- [ ] Undo button
- [ ] Reset button
- [ ] Menu button

### 4.3 Feedback
- [ ] Box đẩy: animation slide
- [ ] Xuyên ống: camera/effect khi đi qua
- [ ] Ô xoay: animation box quay 90°
- [ ] Win: particle effect + sound
- [ ] Đổi màu: player đổi màu mượt

---

## Phase 5: Technical (cho dev/AI code)

### 5.1 Stack
- [ ] Three.js (render 3D mesh)
- [ ] Vanilla JS hoặc TypeScript
- [ ] Grid-based logic (2D array)
- [ ] State management: level state = 2D array of cell types

### 5.2 Data Format
- [ ] Level format: JSON hoặc string grid
```
Ví dụ level 1:
W W W W W
W . . . W
W . H . W
W . B . W
W . . G W
W W W W W

W=wall, .=empty, H=player, B=box, P=pipe, G=goal
```

### 5.3 Core Systems
- [ ] Grid system: parse level → render mesh
- [ ] Input system: arrow keys / swipe
- [ ] Move system: validate → push logic → pipe pass-through logic
- [ ] Undo system: stack of states
- [ ] Win check: player on goal tile

---

## Thứ tự làm việc

1. **GDD viết xong** (doc này) → chốt mechanic + level layout
2. **Code engine** → grid render + move + push + pipe pass
3. **Build 15 level** → test difficulty curve
4. **Polish** → animation, sound, UI

Mỗi bước xong đánh dấu [x]. AI session mới đọc file này biết ngay context + progress.
