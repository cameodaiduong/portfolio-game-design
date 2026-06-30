# Phase 2: Gameplay Design — Draft

## 2.1 Mechanics

Scope hiện tại: **14 level**, tập trung vào 3 lớp mechanic:

1. Sokoban push cơ bản
2. Tunnel box thẳng: ngang/dọc
3. Tunnel box connector: bẻ hướng và tự tạo route

Không có directional corner, key/door, color gate, enemy, rotate tile trong bản portfolio/MVP.

### Game Objects

| ID | Tên | Nhóm | Visual (mesh) | Tương tác |
|----|-----|------|---------------|-----------|
| `0` | Sàn trống | Tile | flat tile | Player đi bộ qua được |
| `1` | Tường | Tile | cube đặc, tối | Chặn di chuyển, chặn push, chặn tunnel |
| `2` | Player | Actor | nhân vật nhỏ | Di chuyển 4 hướng, push object, xuyên tunnel |
| `3` | Goal | Tile endpoint | tile highlight vàng | Player tới đây → win |
| `4` | Box thường | Push object | cube đặc, xám | Bị đẩy, chặn đường, không xuyên |
| `5` | Box ngang | Tunnel box | cylinder rỗng nằm ngang | Bị đẩy; entry/traverse tunnel theo trái-phải |
| `6` | Box dọc | Tunnel box | cylinder rỗng đứng dọc | Bị đẩy; entry/traverse tunnel theo lên-xuống |
| `7` | Connector | Tunnel box | khớp nối đa hướng | Bị đẩy; nối/rẽ route sau khi route bắt đầu từ `5/6` |

### Push Core
- Player di chuyển 4 hướng (lên/xuống/trái/phải)
- Bản chất game vẫn là Sokoban: phần lớn puzzle đến từ việc đứng đúng phía và đẩy object đúng thứ tự ( giống kiểu đặt các box vào vị trí point )
- Object đẩy được gồm: box thường `4`, box ngang `5`, box dọc `6`, connector box `7`
- Đẩy box mà ô phía sau là tường hoặc box khác → không đẩy được, player đứng yên
- Player chỉ đẩy được 1 box/lần, không kéo ngược
- Sau khi đẩy thành công, player đứng vào ô cũ của object

### Box Thường
- Box thường là vật cản/khối đẩy thuần Sokoban
- Bị đẩy 1 ô nếu ô sau trống/đi được
- Chặn đường đi bộ, chặn push, chặn tunnel
- Không bao giờ là tunnel route, không thể xuyên qua
- Dùng trong level để:
  - Chặn vị trí đứng push
  - Buộc player dọn đường trước
  - Tạo dependency/order trong solution

### Tunnel Box

Tunnel box là object đẩy được như box thường, nhưng nếu được nối đúng hướng thì cũng trở thành đường đi. MVP có 3 loại:

#### Box ngang 
- Box tunnel thẳng theo trục trái/phải
- Player trên sàn, đi vào `5` theo trái/phải:
  - Ô tiếp theo sau `5` là pipe/connector đúng hướng hoặc goal `3` → player bước vào pipe, tốn 1 move
  - Nếu không → đẩy `5` như box thường
- Đi vào từ trên/dưới → không kích hoạt tunnel, chỉ đẩy

#### Box dọc
- Box tunnel thẳng theo trục lên/xuống
- Player trên sàn, đi vào `6` theo lên/xuống:
  - Ô tiếp theo sau `6` là pipe/connector đúng hướng hoặc goal `3` → player bước vào pipe, tốn 1 move
  - Nếu không → đẩy `6` như box thường
- Đi vào từ trái/phải → không kích hoạt tunnel, chỉ đẩy

#### Connector
- Là box tunnel đa hướng
- Bị đẩy như box thường khi player đi vào từ sàn
- Không bao giờ là tunnel entry point: player không được bắt đầu xuyên từ `7`
- Chỉ hoạt động khi player đã bắt đầu route từ `5` hoặc `6`
- Khi đang ở trong tunnel route, connector nhận mọi hướng vào và cho đi thẳng hoặc rẽ sang mọi hướng hợp lệ
- Dùng để:
  - Nối route ngang↔dọc
  - Cho route đi thẳng qua giữa
  - Được đẩy vào khe để hoàn thành route còn thiếu

### Tunnel Traversal

Traversal là di chuyển **từng ô**, mỗi ô = 1 move. Player không teleport qua cả chain.

**Entry (từ sàn vào pipe):**
- Player trên sàn, đi vào `5` theo ngang hoặc `6` theo dọc
- Điều kiện: ô tiếp theo sau pipe là pipe/connector đúng hướng hoặc goal `3`
- Đủ điều kiện → player bước vào pipe (đứng trên pipe), tốn 1 move
- Không đủ → đẩy pipe như box thường
- `7` (connector) không bao giờ là entry point

**Inside (đang đứng trên pipe/connector):**
- Mỗi move = di chuyển 1 ô theo hướng input
- Ô tiếp theo là pipe/connector đúng hướng → bước qua, tốn 1 move
- Ô tiếp theo là sàn `0` hoặc goal `3` (không có object) → bước ra, tốn 1 move
- Ô tiếp theo là tường/box/object sai hướng → không di chuyển

**Win:** player bước lên ô goal `3` → win

**Ví dụ:** `2 0 5 0 3`
```
move 1 →: đi bộ sang c1           → 0 2 5 0 3
move 2 →: đẩy 5 sang c3           → 0 0 2 5 3
           (ô sau 5 là floor → đẩy, không phải tunnel)
move 3 →: bước vào 5              → 0 0 0 [P trên 5] 3
           (ô sau 5 là goal → entry OK)
move 4 →: bước ra goal → win
```

### Pipe Visual Feedback
- Pipe/connector nằm trong route hợp lệ → giảm opacity (trong suốt), player nhìn thấy đường xuyên
- Push pipe ra khỏi route → khôi phục opacity ban đầu (opaque)
- Pipe trong route vẫn push được — push sẽ phá route và visual revert
- Route check chạy sau mỗi move (dynamic)

## 2.2 Game Rules

- **Win condition:** player đến ô goal `3`
- **Lose condition:** không có lose state — puzzle game, sai thì undo/reset
- **Undo:** unlimited, lùi từng bước
- **Reset:** về trạng thái đầu level, không giới hạn

## 2.3 Edge Cases

| Case | Kết quả |
|------|---------|
| Đẩy pipe/connector đang nối tunnel | Tunnel đứt, visual revert. |
| Player đang đứng trên pipe, pipe có bị đẩy không? | Không — chỉ player đẩy, không có ngoại lực |
| Connector nhận vào và đi ra cùng trục | Hợp lệ — connector hoạt động như đoạn nối thẳng |

## 2.4 Mechanic đã cắt khỏi scope

| Mechanic | Lý do cắt |
|----------|-----------|
| Color gate (ống màu + đổi màu player) | Thời gian không đủ |
| Enemy (quái tuần tra, trốn trong ống) | Thời gian không đủ, cần AI pathfinding |
| Ô xoay (rotate tile) | Không cần — connector đã giải quyết đổi hướng |
| Directional corners (┘└┐┌) | Connector đa hướng đủ depth, corner thêm complexity không cần thiết |
| Key/Door | Không phục vụ core thesis "pipe vừa là vật cản vừa là đường đi"; dễ làm scope loãng |
