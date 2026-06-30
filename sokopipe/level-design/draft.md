# Phase 3: Level Design — Draft

> Trọng tâm của GDD. Tất cả level cố định, designer đặt sẵn. Không random/procedural.

## Design Rules

- **Goal luôn trong tường** — player không đi bộ tới goal được
- **Tunnel entry phải là ống thẳng** — player chỉ bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc
- **Connector/corner không vào trực tiếp từ sàn** — chúng chỉ hoạt động khi nằm trong một route đã bắt đầu từ ống thẳng
- **Connector là box connector đặc biệt** — chấp nhận mọi hướng vào/ra, cho cả đi thẳng và rẽ hướng
- **Directional corner là mức chơi chính về sau** — corner giống connector bị khóa theo hướng cụ thể
- **Connector route tối thiểu 3 ô** — entry pipe → connector → exit pipe/goal
- **Goal nhận route thông hướng** — hợp lệ `5→3`, `6→3`, hoặc route qua connector/corner nếu đã bắt đầu từ 5/6
- **Straight pipe gồm cả ngang và dọc** — 5/6 là cùng một family, không cần tách thành 2 chapter
- **Tunnel phải là bridge** — pipe route phải bắc cầu qua tường/khoảng bị chặn; không đặt tunnel trên hành lang trống nếu `00` cũng đi được
- **Grid size linh động** — mỗi level có kích thước và hình thù riêng, không ép vuông
- **Không text tutorial** — layout phải tự dạy mechanic

## 3.1 Mechanic Progression

| Chapter | Level | Chủ đề | Dạy gì |
|---------|-------|--------|--------|
| 1 | 1-6 | Straight Pipes Foundation | Push pipe vào goal, horizontal/vertical, đứng đúng phía, box obstacle |
| 2 | 7-11 | Straight Tunnels | 55/66 là shortcut, tunnel giúp tiếp cận vùng/hướng push mới |
| 3 | 12-16 | Connector Tunnels | Connector đa hướng, đổi dọc↔ngang theo cách dễ đọc |
| 4 | 17-21 | Directional Corners | Corner đặc thù, L-shape/Z-shape, đọc hướng vào/ra |
| 5 | 22-25 | Build + Mastery | Đẩy pipe để hoàn thành route, kết hợp toàn bộ mechanic |

Horizontal pipe và vertical pipe chỉ khác hướng traverse/push, không đủ để làm 2 chapter riêng. Chapter 1 vì vậy dài hơn để player hiểu trọn bộ straight pipe trước khi game đưa khái niệm tunnel. Connector là bước trung gian tự nhiên hơn corner: nó cho phép route đi thẳng hoặc đổi hướng tự do, rồi Ch.4 mới biến corner thành bài toán chính bằng cách khóa hướng nối.

## 3.2 Cấu trúc Chapter

Không ép mỗi chapter đúng 3 level. Chapter dài/ngắn theo lượng concept cần dạy.

| Vai trò | Đặc điểm |
|---------|----------|
| Learn | 1 concept mới, 1 path chính, không trap |
| Practice | Thêm positioning, thêm lựa chọn sai nhưng dễ hiểu |
| Test | Combo mechanic cũ + mới, có thể có dead-end/trap rõ ràng |
| Boss | Route dài hơn, cần plan trước 2-3 bước, nhưng không introduce mechanic mới |

Trong một chapter, độ khó leo bằng solution dài hơn, nhiều object hơn, ít không gian xoay sở hơn, hoặc cần dùng mechanic theo cách mới. Không tăng khó bằng cách giấu luật.

## 3.2.1 Map Tightness

Sokoban map không nên có nhiều sàn trống để player đi tự do. Mỗi ô sàn nên có lý do tồn tại:

- Là vị trí player cần đứng để push
- Là đường quay lại/reposition có chủ đích
- Là ô cho box/pipe đi qua trong solution
- Là losing option/trap đọc được
- Là khoảng trống cần thiết để level dễ đọc hoặc nhìn đẹp hơn

Nếu một ô sàn không ảnh hưởng solution, không tạo lựa chọn, không làm layout dễ đọc hơn, nên đổi thành tường. Nếu một box/pipe không bao giờ cần di chuyển, cân nhắc đổi nó thành tường hoặc biến nó thành một phần bắt buộc của solution.

Quy trình sharpen map:

1. Thiết kế puzzle rộng để tìm idea chính.
2. Tìm intended solution và số steps.
3. Xóa/tường hóa các vùng sàn không dùng.
4. Chặn đường đi vòng làm mất ý nghĩa positioning.
5. Kiểm tra lại có solution phụ ngắn hơn hoặc bỏ qua mechanic không.
6. Chỉ giữ floor thừa nếu nó tạo trap có chủ đích hoặc làm map dễ đọc hơn.

Với Soko Pipe, tight map càng quan trọng vì pipe vừa là box vừa là tunnel. Nếu sàn quá mở, player chỉ đang đi vòng trong phòng rộng rồi đẩy pipe vào goal; mechanic không tạo áp lực.

## 3.3 Difficulty Curve

```
Difficulty
  ▲
  │                         ╱‾‾‾╲        ╱‾‾‾‾
  │                 ╱‾‾╲   ╱     ╲      ╱
  │          ╱‾‾╲  ╱    ╲ ╱       ╲    ╱
  │    ╱‾‾╲ ╱    ╲╱      ╲         ╲  ╱
  │___╱    ╲      dip      dip       ╲╱ dip
  └────────────────────────────────────────────► Level
    1-6     7-11     12-16      17-21     22-25
    Ch.1    Ch.2     Ch.3       Ch.4      Ch.5
```

Curve là dạng cầu thang có "dip" nhẹ ở đầu chapter. Mỗi chapter đầu tiên hạ áp lực để dạy concept mới, sau đó leo lại cao hơn chapter trước.

Vai trò tunnel cần tăng dần:

| Stage | Tunnel là gì | Dùng ở đâu |
|-------|--------------|------------|
| 1 | Bridge/shortcut qua chỗ bị chặn | Ch.2 đầu |
| 2 | Access tool | Ch.2 giữa/cuối |
| 3 | Direction changer dễ | Ch.3 |
| 4 | Direction constraint | Ch.4 |
| 5 | Planning graph | Ch.5 |

## 3.4 Chi tiết 25 Level

### Chapter 1: Straight Pipes Foundation (Level 1-6)

Mục tiêu: dạy toàn bộ nền tảng pipe thẳng. Player phải hiểu goal-in-wall, push pipe, xuyên pipe, horizontal/vertical, và đứng đúng phía để push.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 1 | Horizontal intro | Pipe ngang giữa player và goal. Push thẳng pipe vào goal rồi xuyên qua |
| 2 | Vertical intro | Pipe dọc là cùng luật nhưng hướng khác. Tường ngang chặn, vertical pipe là lời giải |
| 3 | Align with pipe | Player bắt đầu lệch khỏi trục pipe, phải dịch vị trí trước khi push |
| 4 | Behind the pipe | Pipe cần đẩy ngược về phía goal, phải đi vòng ra phía sau pipe |
| 5 | Box obstacle | Box chặn vị trí push, phải dọn box trước rồi mới đẩy pipe |
| 6 | Straight pipe boss | Horizontal + vertical + box, solution cần 2-3 bước chuẩn bị |

### Chapter 2: Straight Tunnels (Level 7-11)

Mục tiêu: chuyển pipe từ "object để đẩy" thành "đường bắc cầu". Tunnel thẳng lúc đầu có thể đơn giản, nhưng phải vượt qua chỗ mà `00` không thay thế được.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 7 | Tunnel to push side | Tunnel bắc qua tường để đứng sau pipe rồi push ngược về goal |
| 8 | Multi-axis bridge route | Route dọc rồi ngang, cho thấy tunnel route có thể nối nhiều đoạn thẳng |
| 9 | Align vertical pipes | Đẩy pipe dọc thứ hai vào thẳng hàng để hoàn thành bridge dọc |
| 10 | Multiple bridge routes | Có 2 tunnel route, route đúng/sai thay đổi khả năng access |
| 11 | Straight tunnel boss | Tunnel-as-bridge + box/order + final push |

### Chapter 3: Connector Tunnels (Level 12-16)

Mục tiêu: dạy khái niệm connector dễ. Connector nhận mọi hướng và có thể cho đi thẳng hoặc rẽ, nên player chỉ cần hiểu "route có thể được ghép linh hoạt" trước khi bị ép đọc từng corner cụ thể.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 12 | Connector intro | Route 3 ô: straight pipe → connector → goal/exit, không vào connector trực tiếp |
| 13 | H→V bend | Connector đổi route ngang sang dọc bằng setup 3 pipe cells |
| 14 | V→H bend | Cùng luật nhưng đảo hướng, giúp player hiểu connector omni-direction |
| 15 | Connector access | Connector route đưa player tới đúng phía để push object |
| 16 | Connector boss | Nhiều connector route, một route đúng một route sai/dead-end nhẹ |

### Chapter 4: Directional Corners (Level 17-21)

Mục tiêu: thay connector dễ bằng corner đặc thù. Player đã hiểu đổi hướng ở Ch.3; giờ phải đọc chính xác corner nào nhận hướng nào và đẩy/đặt nó đúng chiều.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 17 | Corner intro | Một corner thay connector trong route L-shape, layout ép hướng đúng |
| 18 | Direction reading | Hai corner nhìn gần giống nhau nhưng chỉ một cái nhận đúng hướng vào |
| 19 | Z-tunnel | Hai corner tạo route ngang→dọc→ngang hoặc dọc→ngang→dọc |
| 20 | Corner access | Corner route đưa player tới đúng phía để push object |
| 21 | Corner boss | Corner + straight tunnel + box, có dead-end nếu đọc sai hướng |

### Chapter 5: Build + Mastery (Level 22-25)

Mục tiêu: connector/corner không còn chỉ là thứ có sẵn. Player phải đẩy pipe/connector/corner vào vị trí để hoàn thành route, rồi dùng route đó để giải puzzle.

| Level | Concept | Mô tả |
|-------|---------|-------|
| 22 | Missing segment | Tunnel gần hoàn chỉnh, thiếu 1 straight/connector; push vào là route mở |
| 23 | Complete then traverse | Sau khi hoàn thành tunnel, phải quay lại và dùng tunnel đó để tới goal |
| 24 | Order matters | Push sai thứ tự làm pipe/box kẹt; trap rõ, không mơ hồ |
| 25 | Final boss | All mechanics: straight pipe, connector, directional corner, box, build route |

## 3.5 Teach-through-play

Không text tutorial. Level đầu của mỗi mechanic phải ép player làm đúng hành động trong layout sạch, ít nhiễu.

| Mechanic | Level đầu setup thế nào |
|----------|------------------------|
| Push + xuyên | L1: pipe ngang giữa player và goal-in-wall |
| Vertical pipe | L2: tường ngang chặn, pipe dọc là lối duy nhất |
| Align with pipe | L3: player lệch khỏi trục pipe, cần dịch vị trí trước khi push |
| Sokoban positioning | L4: pipe cần đẩy ngược về phía goal, phải đi vòng ra phía sau |
| Box obstacle | L5: box chặn vị trí push rất rõ |
| Straight tunnel | L7: tunnel sẵn trong tường, mọi đường khác bị chặn |
| Tunnel as access | L8: chỉ qua tunnel mới đứng đúng phía để push |
| Connector | L12: route 3 ô straight→connector→exit/goal, không vào connector trực tiếp |
| Connector bend | L13: connector đổi ngang↔dọc, không cần đọc loại corner |
| Corner tunnel | L17: thay connector bằng corner đặc thù trong setup đã quen |
| Z-tunnel | L19: 2 corner nối nhau, không có push phức tạp |
| Build tunnel | L22: route thiếu đúng 1 segment, pipe cần đẩy nằm ngay gần đó |

## 3.6 Boss Level

| Level | Boss type | Combo mechanic |
|-------|-----------|----------------|
| 6 | Ch.1 boss | Horizontal + vertical + box positioning |
| 11 | Ch.2 boss | Straight tunnel + push side access + box |
| 16 | Ch.3 boss | Connector route + access puzzle + dead-end nhẹ |
| 21 | Ch.4 boss | Directional corner + route reading + push positioning |
| 25 | Final boss | All mechanics, build route, multiple clear traps |

Boss level không được dạy luật mới. Nếu boss cần một trick chưa xuất hiện trước đó, trick đó phải có level practice riêng trước boss.

## 3.7 Trap Guidelines

- Learn level: không trap
- Practice level: được có lựa chọn sai, nhưng recover được
- Test/boss level: được có dead-end, nhưng nguyên nhân phải đọc được từ layout
- Trap tốt: player hiểu "mình đẩy sai thứ tự" hoặc "mình vào tunnel sai hướng"
- Trap tệ: player kẹt vì không thấy một luật ngầm hoặc vì map quá chật không báo trước

Trap nên dùng để kiểm tra planning, không dùng để phạt exploration ở level đầu của mechanic.

## 3.8 Step Targets

`Steps` là số input di chuyển trong intended solution, tính cả move, push, và xuyên tunnel. Layout thật trong `levels.md` phải ghi exact steps; bảng này là target curve để thiết kế level sau.

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
| 10 | Straight Tunnels | 6 | Multiple tunnel choice |
| 11 | Straight Tunnels | 9 | Ch.2 boss |
| 12 | Connector | 4-5 | Learn connector |
| 13 | Connector | 6-8 | H→V bend |
| 14 | Connector | 7-9 | V→H bend |
| 15 | Connector | 10-12 | Connector access |
| 16 | Connector | 13-16 | Ch.3 boss |
| 17 | Directional Corners | 5-7 | Learn corner |
| 18 | Directional Corners | 8-10 | Direction reading |
| 19 | Directional Corners | 10-13 | Z-tunnel |
| 20 | Directional Corners | 12-15 | Corner access |
| 21 | Directional Corners | 16-20 | Ch.4 boss |
| 22 | Build + Mastery | 10-13 | Missing segment |
| 23 | Build + Mastery | 13-16 | Complete then traverse |
| 24 | Build + Mastery | 16-20 | Order matters |
| 25 | Build + Mastery | 20-26 | Final boss |
