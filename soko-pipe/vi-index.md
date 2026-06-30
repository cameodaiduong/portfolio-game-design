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

### 2.1 Game Objects

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

### 2.2 Mechanics

Scope hiện tại: **14 level**, tập trung vào 3 lớp mechanic:

1. Sokoban push cơ bản
2. Tunnel box thẳng: ngang/dọc
3. Tunnel box connector: bẻ hướng và tự tạo route

Core mechanic: **một số box vừa là vật cản để đẩy, vừa có thể trở thành đường đi nếu được nối đúng hướng**. Player phải vừa đẩy box vừa căn tunnel box tạo route dẫn tới goal.

- **Box thường (`4`)**: chỉ là vật cản. Player đẩy để mở đường hoặc tạo vị trí đứng push, không bao giờ đi xuyên qua được.
- **Box ngang (`5`) / box dọc (`6`)**: bình thường vẫn bị đẩy như box. Khi được nối đúng hướng với pipe khác hoặc goal, player có thể bước vào và đi xuyên từng ô qua tunnel.
- **Connector (`7`)**: là khớp nối route. Connector không cho player đi vào trực tiếp từ sàn, nhưng khi player đã ở trong tunnel thì nó cho route rẽ hướng hoặc nối ngang/dọc.
- **Goal (`3`)**: không phải điểm đi bộ trực tiếp. Goal thường nằm sau tường/vùng bị chặn, buộc player phải tạo tunnel route để đi vào.

Vì vậy mỗi level có 2 lớp bài toán cùng lúc:

1. **Push puzzle**: đứng đúng phía, đẩy đúng object, đúng thứ tự.
2. **Route puzzle**: sau khi đẩy xong, tunnel phải nối thành đường hợp lệ để player đi qua.

Không có directional corner, key/door, color gate, enemy, rotate tile trong bản portfolio/MVP.

### 2.3 Push Core

- Player di chuyển 4 hướng (lên/xuống/trái/phải)
- Bản chất game vẫn là Sokoban: phần lớn puzzle đến từ việc đứng đúng phía và đẩy object đúng thứ tự
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

- Box tunnel thẳng theo trục trái/phải.
- Khi `5` nối theo chiều ngang với `5`, `7`, hoặc `3`, nó tạo thành pipe ngang hợp lệ.
- Các pattern hợp lệ cơ bản:
  - `5-5`: 2 box ngang nối thành tunnel ngang.
  - `5-3`: box ngang nối trực tiếp vào goal.
  - `5-7`: box ngang nối vào connector để route có thể tiếp tục/rẽ hướng.
- Player đi vào pipe ngang từ trái hoặc phải, di chuyển qua từng ô.
- Chưa nối hợp lệ thì không xuyên được, chỉ đẩy.

#### Box dọc

- Box tunnel thẳng theo trục lên/xuống.
- Khi `6` nối theo chiều dọc với `6`, `7`, hoặc `3`, nó tạo thành pipe dọc hợp lệ.
- Các pattern hợp lệ cơ bản:
  - `6-6`: 2 box dọc nối thành tunnel dọc.
  - `6-3`: box dọc nối trực tiếp vào goal.
  - `6-7`: box dọc nối vào connector để route có thể tiếp tục/rẽ hướng.
- Player đi vào pipe dọc từ trên hoặc dưới, di chuyển qua từng ô.
- Chưa nối hợp lệ thì không xuyên được, chỉ đẩy.

#### Connector

- Là box tunnel đa hướng
- Bị đẩy như box thường khi player đi vào từ sàn
- Không bao giờ là tunnel entry point: player không được bắt đầu xuyên từ `7`
- Chỉ hoạt động khi nối với 2 đầu tunnel hợp lệ
- Ví dụ hợp lệ: `6-7-3`, `5-7-5`, `6-7-5`
- `5-7` hoặc `6-7` một phía chưa đủ để tạo pipe
- Khi route hợp lệ, player có thể đi xuyên qua connector để đi thẳng hoặc rẽ hướng
- Dùng để:
  - Nối route ngang và dọc
  - Cho route đi thẳng qua giữa
  - Được đẩy vào khe để hoàn thành route còn thiếu

### 2.6 Tunnel Traversal

Traversal là di chuyển **từng ô**, mỗi ô tốn 1 move. Player không teleport qua cả chain.

**Entry (từ sàn vào pipe):**
- Player trên sàn, đi vào `5` theo ngang hoặc `6` theo dọc
- Điều kiện: pipe đó đang thuộc route hợp lệ, ví dụ `5-3`, `5-5`, `6-7-3`
- Đủ điều kiện thì player bước vào pipe và đứng trên cùng ô với pipe, tốn 1 move
- Không đủ thì đẩy pipe như box thường
- `7` (connector) không bao giờ là entry point

**Inside (đang đứng trên pipe/connector):**
- Mỗi move di chuyển 1 ô theo hướng input
- Ô tiếp theo là pipe/connector đúng hướng thì bước qua, tốn 1 move
- Ô tiếp theo là sàn `0` hoặc goal `3` (không có object) thì bước ra, tốn 1 move
- Ô tiếp theo là tường/box/object sai hướng thì không di chuyển

**Win:** player bước lên ô goal `3` thì thắng level

**Ví dụ:** `P 0 5 0 3`
```
move 1 →: đi bộ sang c1           → 0 P 5 0 3
move 2 →: đẩy 5 sang c3           → 0 0 P 5 3
           (ô sau 5 là floor → đẩy, không phải tunnel)
move 3 →: bước vào pipe 5         → 0 0 0 [5+P] 3
           (5 đang nối với goal thành pattern 5-3, nên player đứng trên cùng ô với 5)
move 4 →: đi từ pipe sang goal    → 0 0 0 5 P → win
```

### 2.7 Pipe Visual Feedback

- Pipe/connector nằm trong route hợp lệ thì giảm opacity (trong suốt), player nhìn thấy đường xuyên
- Push pipe ra khỏi route thì khôi phục opacity ban đầu (opaque)
- Pipe trong route vẫn push được — push sẽ phá route và visual revert
- Route check chạy sau mỗi move (dynamic)

### 2.8 Game Rules

- **Win condition:** player đến ô goal `3` thông qua tunnel box
- **Lose condition:** không có lose state — puzzle game, sai thì undo/reset
- **Undo:** unlimited, lùi từng bước
- **Reset:** về trạng thái đầu level, không giới hạn

### 2.9 Edge Cases

| Case | Kết quả |
|------|---------|
| `5-7` hoặc `6-7` một phía | Chưa tính là pipe hợp lệ; connector cần nối đủ 2 đầu |
| Player đi vào connector `7` từ sàn | Không được; connector không phải entry point |
| Pipe đã nối thành route | Vẫn có thể bị đẩy nếu player tiếp cận như object push |
| Player đang trong pipe nhưng đi sai hướng route | Không di chuyển |
| Goal `3` đứng cạnh sàn thường | Không thắng bằng đi bộ trực tiếp; goal phải vào bằng pipe route |
| Tunnel dài nhiều ô | Không teleport; mỗi ô đi qua tốn 1 step |
| Connector nhận vào và đi ra cùng trục | Hợp lệ; connector có thể hoạt động như đoạn nối thẳng |

### 2.10 Future Expansion / Out of MVP Scope

Chưa đưa vào MVP. Có thể mở rộng sau.

| Mechanic | Hướng mở rộng | Lý do chưa đưa vào MVP |
|----------|---------------|-------------------------|
| Color gate | Pipe/player có màu, chỉ đi qua route đúng màu | Thêm state mới, dễ làm lệch trọng tâm khỏi pipe-push core |
| Enemy | Enemy tuần tra, player dùng tunnel để né hoặc đổi vị trí | Cần AI/pathfinding riêng, phù hợp phase sau |
| Ô xoay (rotate tile) | Player xoay hướng pipe hoặc connector để đổi route | Connector hiện đã đủ giải quyết bài toán rẽ hướng trong MVP |
| Directional corners | Pipe góc cố định như `└`, `┐` để tạo route có hướng cụ thể | Tăng số object cần học; connector đa hướng đang đủ rõ cho 14 level hiện tại |
| Key/Door | Mở khóa vùng hoặc endpoint mới | Không phục vụ trực tiếp ý chính: box vừa là vật cản vừa là đường đi |

---

## 3. Level Design

> Tất cả level cố định, designer đặt sẵn. Không random/procedural.
> Scope: **14 level**, phục vụ portfolio/intern build.

### 3.1 Design Rules

- **Goal luôn trong tường hoặc vùng không đi bộ trực tiếp được** — player phải vào goal bằng pipe/tunnel route
- **Tunnel entry phải là ống thẳng** — player chỉ bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc
- **Connector không vào trực tiếp từ sàn** — chỉ hoạt động khi route đã bắt đầu từ `5` hoặc `6`
- **Connector phải nối đủ 2 đầu hợp lệ** — ví dụ `6-7-3`, `5-7-5`, `6-7-5`; một đầu `5-7` hoặc `6-7` chưa đủ
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

Chi tiết progression theo level:

| Level | Mechanic focus | Mục tiêu thiết kế |
|-------|----------------|-------------------|
| 1 | Horizontal pipe + goal | Dạy pipe có thể bị đẩy vào goal để tạo đường thắng |
| 2 | Vertical pipe | Giữ cùng luật, chỉ đổi trục để player hiểu `5` và `6` là cùng hệ mechanic |
| 3 | Align before push | Buộc player đứng cùng trục trước khi đẩy pipe |
| 4 | Push from behind | Dạy đi vòng để đứng đúng phía object |
| 5 | Normal box obstacle | Box thường chặn vị trí push, không phải route |
| 6 | Straight pipe boss | Kết hợp horizontal, vertical, box và thứ tự dọn đường |
| 7 | First straight tunnel | Dạy tunnel là bridge/access, không chỉ là endpoint vào goal |
| 8 | Multi-axis tunnel | Dùng tunnel dọc để mở đường tới tunnel ngang |
| 9 | Align tunnel pieces | Căn 2 pipe cùng trục để tạo bridge |
| 10 | Tunnel + box dependency | Dùng tunnel để tới vùng mới rồi dọn box/push pipe |
| 11 | Straight tunnel boss | Kiểm tra đọc route, access side, box order và push positioning |
| 12 | Connector as route piece | Connector nằm trong route, không phải entry point |
| 13 | Connector turn | Connector đổi hướng route, player phải đọc đường rẽ |
| 14 | Build connector route | Final test: đẩy connector vào đúng vị trí để tự tạo đường di chuyển |

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

Dạy: connector là đoạn route, không phải entry point.

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
- Flow:
  - Dọn box để mở không gian reposition
  - Căn pipe dọc và connector thành route hợp lệ
  - Dùng route đã tạo để đi qua vùng bị tường chặn và tiếp cận goal

**Level 13 — Reverse bend**

Dạy: connector đổi hướng route, player phải đọc đường rẽ.

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
- Concept: dùng pipe dọc làm entry, qua connector để đổi hướng route và tiếp cận goal
- Flow:
  - Dọn box để mở đường đi quanh khu trung tâm
  - Căn pipe dọc với connector để tạo route có điểm rẽ
  - Đi xuyên route qua connector, sau đó reposition để vào goal bằng route hợp lệ

**Level 14 — Connect to move**

Dạy: final test. Player phải đẩy connector vào đúng vị trí để tự tạo route.

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
- Flow:
  - Dọn box và pipe để mở vị trí push
  - Đưa connector vào vị trí nối giữa các tunnel box
  - Dùng route vừa tạo để sang vùng mới, tiếp tục reposition pipe
  - Tạo route cuối dẫn tới goal

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

## 4. UX & Flow

### 4.1 Game Flow

```
Open Prototype -- Gameplay -- Level Complete Popup -- Auto Next Level
                      |                    |
                  Level Select          Export Steps
                      |
                 Reset / Undo
```

Prototype mở thẳng vào gameplay, không qua menu.

### 4.2 Screens

| Màn hình | Nội dung |
|----------|----------|
| Gameplay | 3D grid, level hiện tại, move count, control panel |
| Level Select | Danh sách 14 level để test nhanh, cho phép nhảy level trong prototype |
| Level Complete Popup | Thông báo clear level, số bước, countdown tự qua màn sau |
| Export Steps | Xuất danh sách input theo thứ tự để dùng lại trong GDD/solution |

### 4.3 HUD

- Level number
- Move count
- Move history / thứ tự input đã đi
- Undo button
- Reset button
- Export steps button
- Level select / next level control
- Mobile D-pad: lên, xuống, trái, phải

### 4.4 Unlock Logic

- Portfolio prototype ưu tiên test nhanh nên có thể chọn trực tiếp 14 level
- Khi clear level N, game tự chuyển sang level N+1 sau 5 giây
- Không star rating, không optimal step bonus
- Move count dùng để ghi solution và đánh giá độ dài level, không dùng làm điểm số

### 4.5 Input

- Desktop: arrow keys hoặc WASD
- Mobile/iPad: D-pad 4 hướng trên UI
- Button UI: Undo, Reset, Export Steps
- Mỗi input tính 1 bước di chuyển
- Undo không tính thêm bước

### 4.6 Camera

Isometric cố định. Không zoom/pan/rotate. Camera tự fit theo kích thước level, responsive desktop/mobile.

### 4.7 Feedback

| Hành động | Feedback |
|-----------|----------|
| Đẩy box/pipe | Animation slide 1 ô |
| Xuyên tunnel | Player di chuyển từng ô qua pipe, không teleport |
| Đẩy không được | Không di chuyển, nhẹ shake |
| Pipe nối thành tunnel | Các box trong route đổi màu/nối liền để đọc được đường đi |
| Connector hợp lệ | Connector đổi visual cùng route với pipe |
| Goal chưa hợp lệ | Goal giữ màu cảnh báo/chưa active |
| Goal đã nối route | Goal đổi sang trạng thái active và nối vào tunnel |
| Win | Popup lớn, hiển thị số bước và countdown auto-next |
| Export steps | Copy/download chuỗi input solution |
| Undo | Lùi 1 state và cập nhật move history |

---

## 5. Technical

### 5.1 Stack

- Three.js (render 3D mesh)
- Vanilla JavaScript
- HTML/CSS cho HUD, popup, mobile control
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
| Level parser | Đọc 2D array, tách player position, goal position và object grid |
| Renderer | Render floor, wall, player, box, tunnel box, connector, goal bằng mesh 3D |
| Input | Map keyboard/D-pad button thành 4 hướng di chuyển |
| Move resolver | Xử lý walk, push object, block movement và tunnel traversal |
| Tunnel route check | Kiểm tra các cụm `5/6/7/3` có nối thành route hợp lệ không |
| Visual state | Đổi màu/nối visual cho pipe, connector, goal khi route hợp lệ |
| Undo/reset | Lưu state trước mỗi move hợp lệ, cho phép undo từng bước hoặc reset level |
| Move logging | Lưu thứ tự input để hiển thị move history và export solution |
| Level manager | Load 14 level, chuyển level, auto-next sau khi clear |
| Responsive UI | Layout desktop/mobile, D-pad cho màn hình cảm ứng |

### 5.4 Prototype Scope

- Playable trực tiếp trên browser, không cần backend
- 14 level cố định, không random/procedural
- Camera cố định để input luôn dễ hiểu
- Tập trung vào rule clarity, level readability, solution logging
- Không có save account, leaderboard, monetization, audio polish trong MVP
