# Soko Pipe — Game Design Document

> Sokoban variant: đẩy box + xuyên qua pipe/tunnel nếu đúng hướng.
> Platform: Web (Three.js). Portfolio game.
> Scope MVP: 14 level, 3 mechanic layer.

---

## 1. Overview

### 1.1 Game Concept

Soko Pipe là biến thể sokoban kết hợp tunnel mechanic. Player đẩy box để mở đường, nhưng box ống có thể đi xuyên qua nếu đúng hướng. Cùng 1 object vừa là vật cản vừa là đường đi, nên mỗi level xoay quanh câu hỏi "đẩy hay xuyên?"

- Thể loại: puzzle / sokoban variant
- Platform: Web browser
- Single player
- Session: 1-3 phút/level
- Scope MVP: 14 level, 3 mechanic chính: push, straight tunnel, connector
- Tham chiếu: Sokoban (push), Baba Is You (rule twist), Sokobond (simple mechanic deep puzzle)

### 1.2 Game Pillars

1. **Dual-use** — cùng 1 box, 2 cách tương tác. Quyết định đẩy hay xuyên là lựa chọn chính mỗi bước
2. **Teach by play** — zero text tutorial, level layout buộc player tự khám phá mechanic
3. **Short & sharp** — level nhỏ, fail nhanh, retry 0 cost, mỗi level xong trong 1-3 phút

### 1.3 Core Loop

Chọn level, quan sát grid, đẩy hoặc xuyên box, đến đích, unlock level tiếp

### 1.4 USP

Sokoban thường, box chỉ là vật cản, player đẩy ra khỏi đường.
Soko Pipe, box ống vừa là vật cản vừa là đường đi tuỳ hướng. Cùng 1 object nhưng có 2 vai trò, tạo thêm độ sâu cho puzzle mà không cần tăng kích thước map.

### 1.5 Art Direction

- 3D isometric, low-poly mesh
- Box thường là cube đặc
- Box ống là cylinder rỗng, nhìn thấy lỗ xuyên
- Màu phân biệt rõ từng loại object
- Camera: isometric cố định

---

## 2. Gameplay

### 2.1 Mechanics

Scope hiện tại: **14 level**, tập trung vào 3 lớp mechanic:

1. Sokoban push cơ bản
2. Tunnel box thẳng: ngang/dọc
3. Tunnel box connector: bẻ hướng và tự tạo route

Core mechanic của Soko Pipe là: **một số box vừa là vật cản để đẩy, vừa có thể trở thành đường đi nếu được nối đúng hướng**. Player không chỉ đẩy box ra khỏi đường như Sokoban truyền thống, mà còn phải căn các tunnel box để tạo route dẫn tới goal.

- **Box thường (`4`)**: chỉ là vật cản. Player đẩy để mở đường hoặc tạo vị trí đứng push, không bao giờ đi xuyên qua được.
- **Box ngang (`5`) / box dọc (`6`)**: bình thường vẫn bị đẩy như box. Khi được nối đúng hướng với pipe khác hoặc goal, player có thể bước vào và đi xuyên từng ô qua tunnel.
- **Connector (`7`)**: là khớp nối route. Connector không cho player đi vào trực tiếp từ sàn, nhưng khi player đã ở trong tunnel thì nó cho route rẽ hướng hoặc nối ngang/dọc.
- **Goal (`3`)**: không phải điểm đi bộ trực tiếp. Goal thường nằm sau tường/vùng bị chặn, buộc player phải tạo tunnel route để đi vào.

Vì vậy mỗi level có 2 lớp bài toán cùng lúc:

1. **Push puzzle**: đứng đúng phía, đẩy đúng object, đúng thứ tự.
2. **Route puzzle**: sau khi đẩy xong, tunnel phải nối thành đường hợp lệ để player đi qua.

Không có directional corner, key/door, color gate, enemy, rotate tile trong bản portfolio/MVP.

### 2.2 Game Objects

| ID | Tên | Nhóm | Visual (mesh) | Tương tác |
|----|-----|------|---------------|-----------|
| `0` | Sàn trống | Tile | flat tile | Player đi bộ qua được |
| `1` | Tường | Tile | cube đặc, tối | Chặn di chuyển, chặn push, chặn tunnel |
| `2` | Player | Actor | nhân vật nhỏ | Di chuyển 4 hướng, push object, xuyên tunnel |
| `3` | Goal | Tile endpoint | tile highlight vàng | Player tới đây thì thắng level |
| `4` | Box thường | Push object | cube đặc, xám | Bị đẩy, chặn đường, không xuyên |
| `5` | Box ngang | Tunnel box | cylinder rỗng nằm ngang | Bị đẩy; entry/traverse tunnel theo trái-phải |
| `6` | Box dọc | Tunnel box | cylinder rỗng đứng dọc | Bị đẩy; entry/traverse tunnel theo lên-xuống |
| `7` | Connector | Tunnel box | khớp nối đa hướng | Bị đẩy; nối/rẽ route sau khi route bắt đầu từ `5/6` |

### 2.3 Push Core

- Player di chuyển 4 hướng (lên/xuống/trái/phải)
- Bản chất game vẫn là Sokoban: phần lớn puzzle đến từ việc đứng đúng phía và đẩy object đúng thứ tự (giống kiểu đặt các box vào vị trí point)
- Object đẩy được gồm: box thường `4`, box ngang `5`, box dọc `6`, connector box `7`
- Đẩy box mà ô phía sau là tường hoặc box khác thì không đẩy được, player đứng yên
- Player chỉ đẩy được 1 box/lần, không kéo ngược
- Sau khi đẩy thành công, player đứng vào ô cũ của object

### 2.4 Box Thường

- Box thường là vật cản/khối đẩy thuần Sokoban
- Bị đẩy 1 ô nếu ô sau trống/đi được
- Chặn đường đi bộ, chặn push, chặn tunnel
- Không bao giờ là tunnel route, không thể xuyên qua
- Dùng trong level để:
  - Chặn vị trí đứng push
  - Buộc player dọn đường trước
  - Tạo dependency/order trong solution

### 2.5 Tunnel Box

Tunnel box là object đẩy được như box thường, nhưng nếu được nối đúng hướng thì cũng trở thành đường đi. MVP có 3 loại:

#### Box ngang

- Box tunnel thẳng theo trục trái/phải
- Player trên sàn, đi vào `5` theo trái/phải:
  - Ô tiếp theo sau `5` là pipe/connector đúng hướng hoặc goal `3` thì player bước vào pipe, tốn 1 move
  - Nếu không thì đẩy `5` như box thường
- Đi vào từ trên/dưới thì không kích hoạt tunnel, chỉ đẩy

#### Box dọc

- Box tunnel thẳng theo trục lên/xuống
- Player trên sàn, đi vào `6` theo lên/xuống:
  - Ô tiếp theo sau `6` là pipe/connector đúng hướng hoặc goal `3` thì player bước vào pipe, tốn 1 move
  - Nếu không thì đẩy `6` như box thường
- Đi vào từ trái/phải thì không kích hoạt tunnel, chỉ đẩy

#### Connector

- Là box tunnel đa hướng
- Bị đẩy như box thường khi player đi vào từ sàn
- Không bao giờ là tunnel entry point: player không được bắt đầu xuyên từ `7`
- Chỉ hoạt động khi player đã bắt đầu route từ `5` hoặc `6`
- Khi đang ở trong tunnel route, connector nhận mọi hướng vào và cho đi thẳng hoặc rẽ sang mọi hướng hợp lệ
- Dùng để:
  - Nối route ngang và dọc
  - Cho route đi thẳng qua giữa
  - Được đẩy vào khe để hoàn thành route còn thiếu

### 2.6 Tunnel Traversal

Traversal là di chuyển **từng ô**, mỗi ô tốn 1 move. Player không teleport qua cả chain.

**Entry (từ sàn vào pipe):**
- Player trên sàn, đi vào `5` theo ngang hoặc `6` theo dọc
- Điều kiện: ô tiếp theo sau pipe là pipe/connector đúng hướng hoặc goal `3`
- Đủ điều kiện thì player bước vào pipe (đứng trên pipe), tốn 1 move
- Không đủ thì đẩy pipe như box thường
- `7` (connector) không bao giờ là entry point

**Inside (đang đứng trên pipe/connector):**
- Mỗi move di chuyển 1 ô theo hướng input
- Ô tiếp theo là pipe/connector đúng hướng thì bước qua, tốn 1 move
- Ô tiếp theo là sàn `0` hoặc goal `3` (không có object) thì bước ra, tốn 1 move
- Ô tiếp theo là tường/box/object sai hướng thì không di chuyển

**Win:** player bước lên ô goal `3` thì thắng level

**Ví dụ:** `2 0 5 0 3`
```
move 1 →: đi bộ sang c1           → 0 2 5 0 3
move 2 →: đẩy 5 sang c3           → 0 0 2 5 3
           (ô sau 5 là floor → đẩy, không phải tunnel)
move 3 →: bước vào 5              → 0 0 0 [P trên 5] 3
           (ô sau 5 là goal → entry OK)
move 4 →: bước ra goal → win
```

### 2.7 Pipe Visual Feedback

- Pipe/connector nằm trong route hợp lệ thì giảm opacity (trong suốt), player nhìn thấy đường xuyên
- Push pipe ra khỏi route thì khôi phục opacity ban đầu (opaque)
- Pipe trong route vẫn push được — push sẽ phá route và visual revert
- Route check chạy sau mỗi move (dynamic)

### 2.8 Game Rules

- **Win condition:** player đến ô goal `3`
- **Lose condition:** không có lose state — puzzle game, sai thì undo/reset
- **Undo:** unlimited, lùi từng bước
- **Reset:** về trạng thái đầu level, không giới hạn

### 2.9 Edge Cases

| Case | Kết quả |
|------|---------|
| Đẩy pipe/connector đang nối tunnel | Tunnel đứt, visual revert |
| Player đang đứng trên pipe, pipe có bị đẩy không? | Không — chỉ player đẩy, không có ngoại lực |
| Connector nhận vào và đi ra cùng trục | Hợp lệ — connector hoạt động như đoạn nối thẳng |

### 2.10 Mechanic đã cắt khỏi scope

| Mechanic | Lý do cắt |
|----------|-----------|
| Color gate (ống màu + đổi màu player) | Thời gian không đủ |
| Enemy (quái tuần tra, trốn trong ống) | Thời gian không đủ, cần AI pathfinding |
| Ô xoay (rotate tile) | Không cần — connector đã giải quyết đổi hướng |
| Directional corners | Connector đa hướng đã đủ phức tạp, corner thêm vào không cần thiết |
| Key/Door | Không liên quan tới ý chính "pipe vừa là vật cản vừa là đường đi", dễ làm scope loãng |

---

## 3. Level Design

> Tất cả level cố định, designer đặt sẵn. Không random/procedural.
> Scope: **14 level**, phục vụ portfolio/intern build.

### 3.1 Design Rules

- **Goal luôn trong tường hoặc vùng không đi bộ trực tiếp được** — player phải vào goal bằng pipe/tunnel route
- **Tunnel entry phải là ống thẳng** — player chỉ bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc
- **Connector không vào trực tiếp từ sàn** — chỉ hoạt động khi route đã bắt đầu từ `5` hoặc `6`
- **Connector route tối thiểu 3 ô** — entry pipe, connector, exit pipe/goal
- **Tunnel phải là bridge/access tool** — route phải bắc cầu qua tường/khoảng bị chặn hoặc đưa player tới vị trí push mới
- **Không text tutorial** — layout phải tự dạy mechanic

### 3.2 Mechanic Progression

| Chapter | Level | Chủ đề | Dạy gì |
|---------|-------|--------|--------|
| 1 | 1-6 | Straight Pipes Foundation | Push pipe vào goal, horizontal/vertical, đứng đúng phía, box obstacle |
| 2 | 7-11 | Straight Tunnels | Tunnel là bridge/access tool, giúp tiếp cận vùng hoặc hướng push mới |
| 3 | 12-14 | Connector Tunnels | Connector bẻ hướng route, đôi khi phải đẩy connector để tự tạo đường |

Core progression:

1. Player học pipe như **object để đẩy**
2. Player học pipe như **đường để đi xuyên**
3. Player học pipe/connector như **route phải tạo hoặc căn đúng**

### 3.3 Chapter Structure

| Vai trò | Đặc điểm |
|---------|----------|
| Learn | 1 concept mới, 1 path chính, ít nhiễu |
| Practice | Thêm positioning hoặc object cản |
| Test | Combo mechanic cũ + mới, có thể có trap/dead-end đọc được |
| Boss | Route dài hơn, cần plan trước 2-3 bước, không introduce luật mới |

Tăng khó bằng:
- dependency/order giữa box, pipe, connector
- vị trí đứng để push
- route access đưa player tới mặt sau object
- yêu cầu tự tạo endpoint/tunnel trước khi win

### 3.4 Map Tightness

Mỗi ô sàn nên có lý do tồn tại:
- Là vị trí player cần đứng để push
- Là đường quay lại/reposition có chủ đích
- Là ô cho box/pipe/connector đi qua trong solution
- Là losing option/trap đọc được
- Là khoảng trống cần thiết để level dễ đọc

Nếu một ô sàn không ảnh hưởng solution, không tạo lựa chọn, không làm layout dễ đọc hơn thì đổi thành tường.

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

Mỗi chapter đầu có dip nhẹ để đưa mechanic mới vào. Sau đó tăng bằng combination, không bằng luật mới bị giấu.

### 3.6 Level Layouts

> Legend: 0 sàn, 1 tường, 2 player, 3 goal, 4 box, 5 box ngang, 6 box dọc, 7 connector
> Steps là số input di chuyển, tính cả walk, push, enter pipe, traverse pipe.

---

#### Chapter 1: Straight Pipes Foundation (Level 1-6)

**Level 1 — Horizontal intro**

Dạy: pipe đơn lẻ bị đẩy như box; pipe chạm goal thì trở thành đường để xuyên vào goal.

```
1 1 1 1 1
1 2 5 0 3
1 1 1 1 1
```

- Grid: 5×3
- Steps: 3
- Solution: →, →, →
- Flow: push pipe ngang sang phải 1 ô, bước vào pipe, bước ra goal.

**Level 2 — Vertical intro**

Dạy: vertical pipe dùng cùng luật với horizontal pipe, chỉ đổi trục lên/xuống.

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
- Flow: push pipe dọc lên 1 ô, bước vào pipe, bước lên goal.

**Level 3 — Align with pipe**

Dạy: player phải đứng cùng trục với pipe trước khi push.

```
1 1 1 1 1 1
1 0 5 0 0 3
1 2 0 1 1 1
1 1 1 1 1 1
```

- Grid: 6×4
- Steps: 5
- Solution: ↑, →, →, →, →
- Flow: bước lên cùng trục pipe, push pipe sang phải 2 lần, bước vào pipe, bước ra goal.

**Level 4 — Behind the pipe**

Dạy: muốn đẩy pipe về phía goal bên trái, player phải đi vòng sang phía phải của pipe rồi push ngược lại.

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
- Flow: đi vòng qua hành lang phải, đứng bên phải pipe, push pipe sang trái 3 lần tới sát goal, bước vào pipe, bước ra goal.

**Level 5 — Box obstacle**

Dạy: box thường không phải route; box là thứ cần dọn để mở vị trí push pipe.

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
- Flow: đi qua hành lang trái lên trên, push box xuống, vị trí cũ box thành chỗ đứng push pipe vào sát goal, bước vào pipe, bước ra goal.

**Level 6 — Straight pipe boss**

Dạy: mini-boss Chapter 1. Horizontal + vertical + box cùng xuất hiện; dọn đúng thứ tự.

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
  - Đi xuống dưới horizontal pipe, push lên để mở chỗ đứng
  - Push box sang phải để dọn cột goal
  - Đi vòng xuống dưới vertical pipe, push lên sát goal
  - Bước vào pipe, bước lên goal

---

#### Chapter 2: Straight Tunnels (Level 7-11)

**Level 7 — Tunnel intro**

Dạy: tunnel bắc qua tường để đưa player tới phía sau pipe rồi push ngược về goal.

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
  - Push pipe ở row 3 sang phải 1 ô, tạo thành `5 5` tunnel
  - Bước vào tunnel, traverse qua, bước ra sàn bên phải
  - Đi lên row 1 qua hành lang phải
  - Push pipe ở row 1 sang trái 2 lần tới sát goal
  - Bước vào pipe, bước ra goal

**Level 8 — Multi-axis bridge**

Dạy: tunnel route dọc + ngang trong một lần chơi.

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
  - Push `6` lên 1 ô, tạo thành `6 6` tunnel dọc
  - Bước vào tunnel dọc, traverse qua, bước ra sàn row 1
  - Push `5` sang phải 1 ô, tạo thành `5 5` tunnel ngang sát goal
  - Bước vào tunnel ngang, traverse qua, bước ra goal

---

**Level 9 — Align vertical pipes**

Dạy: đẩy pipe dọc vào thẳng hàng với pipe dọc khác để tạo bridge, rồi dùng bridge đó lên top lane xuyên pipe ngang vào goal.

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
- Flow: đẩy `6` thứ hai sang trái vào thẳng hàng với `6` đầu, tạo tunnel dọc, xuyên lên row 1, push pipe ngang sát goal, xuyên vào goal.

**Level 10 — Straight tunnel + box**

Dạy: dùng tunnel để xuyên sang vùng khác, dọn box rồi đẩy pipe vào sát goal.

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
- Flow: đẩy pipe xuống tạo tunnel ngang ở row 7, xuyên qua hành lang phải lên trên, dọn box sang trái, đẩy pipe vào sát goal, xuyên vào goal.

**Level 11 — Straight tunnel boss**

Dạy: Ch.2 boss. Dọn box, căn pipe dọc thành bridge, dùng tunnel xuyên sang nửa phải, đẩy pipe cuối vào lane goal rồi xuyên.

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
  - Dọn 2 box ra khỏi đường, căn pipe dọc vào cùng cột tạo tunnel dọc
  - Xuyên tunnel dọc lên row 1, đi ngang sang nửa phải
  - Đẩy pipe ngang ra, đẩy pipe dọc xuống sát goal
  - Xuyên pipe dọc vào goal

---

#### Chapter 3: Connector Tunnels (Level 12-14)

**Level 12 — Connector bridge**

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
- Concept: connector nằm trong route di chuyển, bắc qua vùng bị chặn

**Level 13 — Reverse bend**

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
- Concept: vào bằng pipe dọc, qua connector, rẽ ra pipe ngang, vào goal

**Level 14 — Connect to move**

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
- Concept: đẩy connector vào khe để tạo route, rồi dùng route đó để di chuyển tới goal

---

### 3.7 Teach-Through-Play

| Mechanic | Level đầu setup thế nào |
|----------|------------------------|
| Push + xuyên | L1: pipe ngang giữa player và goal-in-wall |
| Vertical pipe | L2: tường chặn, pipe dọc là lối duy nhất |
| Align with pipe | L3: player lệch khỏi trục pipe |
| Sokoban positioning | L4: phải đi vòng ra phía sau pipe |
| Box obstacle | L5: box chặn vị trí push rất rõ |
| Straight tunnel | L7: tunnel bắc qua tường, mọi đường khác bị chặn |
| Tunnel as access | L7-L11: tunnel đưa player tới phía push mới |
| Connector | L12: connector là một đoạn trong route di chuyển |
| Build connector route | L14: đẩy connector vào khe để tạo route |

### 3.8 Boss / Checkpoint Levels

| Level | Type | Combo mechanic |
|-------|------|----------------|
| 6 | Ch.1 boss | Horizontal + vertical + box positioning |
| 11 | Ch.2 boss | Straight tunnel + push side access + box/order |
| 14 | MVP final | Connector placement + route creation + existing pipe/tunnel rules |

### 3.9 Step Targets

| Level | Chapter | Steps | Vai trò |
|-------|---------|-------|---------|
| 1 | Straight Pipes | 3 | Learn horizontal |
| 2 | Straight Pipes | 3 | Learn vertical |
| 3 | Straight Pipes | 5 | Align with pipe |
| 4 | Straight Pipes | 8 | Đi vòng ra phía sau pipe |
| 5 | Straight Pipes | 9 | Box obstacle |
| 6 | Straight Pipes | 13 | Ch.1 boss |
| 7 | Straight Tunnels | 13 | Tunnel to push side |
| 8 | Straight Tunnels | 10 | Multi-axis bridge |
| 9 | Straight Tunnels | 22 | Align vertical pipes |
| 10 | Straight Tunnels | 41 | Tunnel + box/access |
| 11 | Straight Tunnels | 38 | Ch.2 boss |
| 12 | Connector | 36 | Connector bridge/access |
| 13 | Connector | 36 | Connector route reading |
| 14 | Connector | 66 | Connect to move / MVP final |

---

## 4. UX & Flow

### 4.1 Game Flow

```
Main Menu -- Level Select -- Gameplay -- Win Panel -- Level Select
                                |
                           Pause Menu -- Resume / Reset / Level Select
```

### 4.2 Screens

| Màn hình | Nội dung |
|----------|----------|
| Main Menu | Logo Soko Pipe, nút Play, nút Credits |
| Level Select | Grid 14 level, chưa unlock thì khoá, đã clear thì có tick |
| Gameplay | Grid + HUD |
| Win Panel | "Level Complete", số bước, nút Next Level |
| Pause Menu | Resume, Reset, Back to Level Select |

### 4.3 HUD

- Level number (góc trên trái)
- Move count (góc trên phải)
- Undo button
- Reset button
- Pause/Menu button

### 4.4 Unlock Logic

- Level 1 mở sẵn
- Clear level N thì unlock level N+1
- Không star rating, không optimal step bonus

### 4.5 Input

- Desktop: arrow keys hoặc WASD
- Mobile/iPad: swipe 4 hướng
- Mỗi input tính 1 bước di chuyển

### 4.6 Camera

Isometric cố định. Không zoom/pan/rotate. Grid 5x5-7x7 fit 1 màn hình.

### 4.7 Feedback

| Hành động | Feedback |
|-----------|----------|
| Đẩy box/pipe | Animation slide 1 ô |
| Xuyên tunnel | Player di chuyển qua pipe |
| Đẩy không được | Không di chuyển, nhẹ shake |
| Pipe nối thành tunnel | Visual nối liền, giảm opacity |
| Win | Particle effect + sound |
| Undo | Animation lùi nhanh |

---

## 5. Technical

### 5.1 Stack

- Three.js (render 3D mesh)
- TypeScript hoặc vanilla JS
- Grid logic dùng 2D array

### 5.2 Level Data Format

| Giá trị | Object |
|---------|--------|
| 0 | Sàn trống |
| 1 | Tường |
| 2 | Player |
| 3 | Goal |
| 4 | Box thường |
| 5 | Box ngang |
| 6 | Box dọc |
| 7 | Connector |

```js
const level1 = [
  [1, 1, 1, 1, 1],
  [1, 2, 5, 0, 3],
  [1, 1, 1, 1, 1],
]
```

### 5.3 Core Systems

| System | Mô tả |
|--------|-------|
| Grid | Parse level array, render mesh |
| Input | Arrow keys / WASD / swipe thành direction |
| Move | Validate, push logic, tunnel pass-through |
| Tunnel check | Từ ô player, follow hướng pipe đến khi ra sàn trống hoặc bị chặn |
| Undo | Stack of grid states, pop on undo |
| Win check | Player position === goal position |
| Level manager | Load level, reset, next level, unlock |

### 5.4 Build Order

1. Grid render + player move (30 phút)
2. Push logic (30 phút)
3. Tunnel pass-through (30 phút)
4. Undo + reset (15 phút)
5. Level manager + 14 level data (45 phút)
6. UI: menu, level select, win panel (30 phút)
7. Polish: animation, mesh, sound (30 phút)

Tổng: ~4 tiếng
