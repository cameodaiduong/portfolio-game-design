# Phase 3: Level Design — Draft

> Trọng tâm của GDD. Tất cả level cố định, designer đặt sẵn. Không random/procedural.
> Scope hiện tại: **14 level**, phục vụ portfolio/intern build. Không thiết kế thêm level ngoài danh sách này trong bản MVP.

## Design Rules

- **Goal luôn trong tường hoặc vùng không đi bộ trực tiếp được** — player phải vào goal bằng pipe/tunnel route.
- **Tunnel entry phải là ống thẳng** — player chỉ bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc.
- **Connector không vào trực tiếp từ sàn** — chỉ hoạt động khi route đã bắt đầu từ `5` hoặc `6`.
- **Connector là box connector đặc biệt** — chấp nhận mọi hướng vào/ra, cho cả đi thẳng và rẽ hướng, miễn có route hợp lệ.
- **Connector route tối thiểu 3 ô** — entry pipe → connector → exit pipe/goal.
- **Goal nhận route thông hướng** — hợp lệ `5→3`, `6→3`, hoặc route qua connector nếu đã bắt đầu từ `5`/`6`.
- **Straight pipe gồm cả ngang và dọc** — `5`/`6` là cùng một family, chỉ khác hướng traverse/push.
- **Tunnel phải là bridge/access tool** — route phải bắc cầu qua tường/khoảng bị chặn hoặc đưa player tới vị trí push mới.
- **Không text tutorial** — layout phải tự dạy mechanic.
- **Out of scope** — directional corner, key/door, color gate, enemy, rotate tile.

## 3.1 Mechanic Progression

| Chapter | Level | Chủ đề | Dạy gì |
|---------|-------|--------|--------|
| 1 | 1-6 | Straight Pipes Foundation | Push pipe vào goal, horizontal/vertical, đứng đúng phía, box obstacle |
| 2 | 7-11 | Straight Tunnels | Tunnel là bridge/access tool, giúp tiếp cận vùng hoặc hướng push mới |
| 3 | 12-14 | Connector Tunnels | Connector bẻ hướng route, đôi khi phải đẩy connector để tự tạo đường |

Core progression:

1. Player học pipe như **object để đẩy**.
2. Player học pipe như **đường để đi xuyên**.
3. Player học pipe/connector như **route phải tạo hoặc căn đúng**.

Không cần thêm chapter mới trong MVP. Connector đã đủ để chứng minh mechanic depth; thêm directional corner sẽ tăng implementation/playtest cost không cần thiết cho portfolio build.

## 3.2 Cấu Trúc Chapter

| Vai trò | Đặc điểm |
|---------|----------|
| Learn | 1 concept mới, 1 path chính, ít nhiễu |
| Practice | Thêm positioning hoặc object cản |
| Test | Combo mechanic cũ + mới, có thể có trap/dead-end đọc được |
| Boss | Route dài hơn, cần plan trước 2-3 bước, không introduce luật mới |

Không tăng khó bằng cách kéo corridor dài. Tăng khó bằng:

- dependency/order giữa box, pipe, connector
- vị trí đứng để push
- route access đưa player tới mặt sau object
- yêu cầu tự tạo endpoint/tunnel trước khi win

## 3.3 Map Tightness

Sokoban map không nên có nhiều sàn trống để player đi tự do. Mỗi ô sàn nên có lý do tồn tại:

- Là vị trí player cần đứng để push
- Là đường quay lại/reposition có chủ đích
- Là ô cho box/pipe/connector đi qua trong solution
- Là losing option/trap đọc được
- Là khoảng trống cần thiết để level dễ đọc

Nếu một ô sàn không ảnh hưởng solution, không tạo lựa chọn, không làm layout dễ đọc hơn, nên đổi thành tường.

Quy trình sharpen map:

1. Thiết kế puzzle rộng để tìm idea chính.
2. Tìm intended solution và số steps.
3. Xóa/tường hóa sàn không dùng.
4. Chặn đường đi vòng làm mất ý nghĩa positioning.
5. Kiểm tra solution phụ ngắn hơn hoặc bypass mechanic.
6. Chỉ giữ floor thừa nếu nó tạo trap có chủ đích hoặc giúp đọc layout.

## 3.4 Difficulty Curve

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

Mỗi chapter đầu có dip nhẹ để đưa mechanic mới vào. Sau đó độ khó tăng bằng combination, không bằng luật mới bị giấu.

Vai trò tunnel tăng dần:

| Stage | Tunnel là gì | Dùng ở đâu |
|-------|--------------|------------|
| 1 | Đường vào goal sau khi push pipe | Ch.1 |
| 2 | Bridge/shortcut qua chỗ bị chặn | Ch.2 đầu |
| 3 | Access tool để đứng đúng phía push | Ch.2 giữa/cuối |
| 4 | Route có thể bẻ hướng hoặc phải tự tạo | Ch.3 |

## 3.5 Chi Tiết 14 Level

### Chapter 1: Straight Pipes Foundation (Level 1-6)

Mục tiêu: dạy nền tảng pipe thẳng. Player hiểu goal-in-wall, push pipe, xuyên pipe, horizontal/vertical, và đứng đúng phía để push.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 1 | Horizontal intro | Pipe ngang giữa player và goal. Push thẳng pipe vào goal rồi xuyên qua |
| 2 | Vertical intro | Pipe dọc là cùng luật nhưng hướng khác |
| 3 | Align with pipe | Player bắt đầu lệch khỏi trục pipe, phải dịch vị trí trước khi push |
| 4 | Behind the pipe | Pipe cần đẩy ngược về phía goal, phải đi vòng ra phía sau |
| 5 | Box obstacle | Box chặn vị trí push, phải dọn box trước rồi mới đẩy pipe |
| 6 | Straight pipe boss | Horizontal + vertical + box, solution cần đúng thứ tự chuẩn bị |

### Chapter 2: Straight Tunnels (Level 7-11)

Mục tiêu: chuyển pipe từ "object để đẩy" thành "đường bắc cầu/access". Tunnel thẳng phải vượt qua chỗ mà đi bộ thường không thay thế được.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 7 | Tunnel to push side | Tunnel bắc qua tường để đứng sau pipe rồi push ngược về goal |
| 8 | Multi-axis bridge route | Route dọc rồi ngang, cho thấy tunnel có thể nối nhiều đoạn |
| 9 | Align vertical pipes | Đẩy pipe dọc thứ hai vào thẳng hàng để hoàn thành bridge |
| 10 | Straight tunnel + box | Box thay đổi khả năng access/push, không chỉ là vật cản |
| 11 | Straight tunnel boss | Tunnel-as-access + box/order + final push |

### Chapter 3: Connector Tunnels (Level 12-14)

Mục tiêu: nối tiếp Ch.2 bằng route có bẻ hướng. Connector không cần showcase riêng; nó xuất hiện như một phần của puzzle movement.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 12 | Connector bridge | Connector nằm trong route di chuyển/access, nhẹ hơn Ch.2 boss |
| 13 | Connector direction route | Dùng connector để đổi dọc↔ngang trong puzzle thật |
| 14 | Connect to move | Player phải đẩy connector vào vị trí để tạo route rồi mới dùng route đó |

## 3.6 Teach-Through-Play

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

## 3.7 Boss / Checkpoint Levels

| Level | Type | Combo mechanic |
|-------|------|----------------|
| 6 | Ch.1 boss | Horizontal + vertical + box positioning |
| 11 | Ch.2 boss | Straight tunnel + push side access + box/order |
| 14 | MVP final checkpoint | Connector placement + route creation + existing pipe/tunnel rules |

Level 14 là điểm dừng hợp lý cho portfolio MVP. Nếu sau này mở rộng, có thể thêm chapter mới, nhưng không nằm trong scope hiện tại.

## 3.8 Step Targets

`Steps` là số input di chuyển trong intended solution, tính cả move, push, và xuyên tunnel.

| Level | Chapter | Target steps | Vai trò |
|-------|---------|--------------|---------|
| 1 | Straight Pipes | 2 | Learn horizontal |
| 2 | Straight Pipes | 2 | Learn vertical |
| 3 | Straight Pipes | 4 | Align with pipe |
| 4 | Straight Pipes | 7 | Đi vòng ra phía sau pipe |
| 5 | Straight Pipes | 8 | Box obstacle |
| 6 | Straight Pipes | 12 | Ch.1 boss |
| 7 | Straight Tunnels | 10 | Tunnel to push side |
| 8 | Straight Tunnels | 7 | Multi-axis bridge route |
| 9 | Straight Tunnels | 15 | Align vertical pipes |
| 10 | Straight Tunnels | 10-16 | Tunnel + box/access |
| 11 | Straight Tunnels | 18-31 | Ch.2 boss |
| 12 | Connector | 10-18 | Connector bridge/access |
| 13 | Connector | 10-18 | Connector route reading |
| 14 | Connector | 18-30 | Connect to move / MVP final |
