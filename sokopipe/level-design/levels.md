# Soko Pipe — Level Layouts

> Legend: 0=sàn, 1=tường, 2=player, 3=goal, 4=box, 5=ống ngang, 6=ống dọc, 7=connector đa hướng

> Movement: pipe đơn lẻ = đẩy như box. Pipe nối pipe đúng hướng = tunnel, player xuyên qua.
> Tunnel entry: player chỉ bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc.
> Connector không vào trực tiếp từ sàn; chỉ hoạt động bên trong route đã bắt đầu từ 5/6.
> Connector cho phép đi thẳng hoặc rẽ tự do.
> Connector route tối thiểu 3 ô: entry pipe → connector → exit pipe/goal.
> Out of scope: directional corner, key/door, color gate, enemy.

> Difficulty metric: `Steps` = số input di chuyển trong intended solution, tính cả move, push, và xuyên tunnel.

---

## Chapter 1: Straight Pipes Foundation (Level 1-6)

Mục tiêu: dạy nền tảng pipe thẳng trước khi vào tunnel. Player học theo thứ tự:

1. Đẩy pipe vào goal
2. Horizontal/vertical là cùng một luật, khác hướng
3. Đứng đúng trục để push
4. Đi vòng ra phía sau pipe
5. Dọn box để mở vị trí push
6. Kết hợp horizontal + vertical + box

### Level 1 — Horizontal intro

Dạy: pipe đơn lẻ bị đẩy như box; pipe chạm goal thì trở thành đường để xuyên vào goal.

```
1 1 1 1 1
1 2 5 0 3
1 1 1 1 1
```

- Grid: 5×3
- Steps: 2
- Solution: →, →
- Flow: push pipe ngang sang phải 1 ô, rồi xuyên pipe vào goal.

### Level 2 — Vertical intro

Dạy: vertical pipe dùng cùng luật với horizontal pipe, chỉ đổi trục lên/xuống.

```
1 3 1
1 0 1
1 6 1
1 2 1
1 1 1
```

- Grid: 3×5
- Steps: 2
- Solution: ↑, ↑
- Flow: push pipe dọc lên 1 ô, rồi xuyên pipe lên goal.

### Level 3 — Align with pipe

Dạy: player phải đứng cùng trục với pipe trước khi push. Đây chỉ là offset nhẹ, chưa phải đi vòng phức tạp.

```
1 1 1 1 1 1
1 0 5 0 0 3
1 2 0 1 1 1
1 1 1 1 1 1
```

- Grid: 6×4
- Steps: 4
- Solution: ↑, →, →, →
- Flow: player bắt đầu dưới ô đứng push, chỉ cần bước lên để cùng trục với pipe trước khi push.

### Level 4 — Behind the pipe

Dạy: muốn đẩy pipe về phía goal bên trái, player phải đi vòng sang phía phải của pipe rồi push ngược lại.

```
1 1 1 1 1 1 1
3 0 0 0 5 0 1
1 1 1 1 1 0 1
1 1 1 1 2 0 1
1 1 1 1 1 1 1
```

- Grid: 7×5
- Steps: 7
- Solution: →, ↑, ↑, ←, ←, ←, ←
- Flow: player phải đi qua hành lang phải để đứng bên phải pipe, push pipe sang trái tới goal.

### Level 5 — Box obstacle

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
- Steps: 8
- Solution: ↑, ↑, ↑, →, →, ↓, →, →
- Flow: đi qua hành lang trái để đứng trên box, push box xuống; vị trí cũ của box trở thành chỗ đứng để push pipe vào goal.

### Level 6 — Straight pipe boss

Dạy: mini-boss của Chapter 1. Horizontal pipe, box, vertical pipe cùng xuất hiện; player phải dọn đúng thứ tự để tạo route vào goal.

```
1 1 1 1 3 1 1
1 1 1 0 0 1 1
1 2 1 5 4 0 1
1 0 0 0 6 1 1
1 1 1 0 0 1 1
1 1 1 1 1 1 1
```

- Grid: 7×6
- Steps: 12
- Solution: ↓, →, →, ↑, →, ←, ↓, ↓, →, ↑, ↑, ↑
- Flow:
  - Đi xuống dưới horizontal pipe, push horizontal pipe lên để mở chỗ đứng.
  - Push box sang phải để dọn cột goal.
  - Đi vòng xuống dưới vertical pipe, push vertical pipe lên sát goal.
  - Xuyên vertical pipe vào goal.
- Core idea: không có mechanic mới, chỉ kiểm tra positioning + thứ tự push.

---

## Chapter 2: Straight Tunnels (Level 7-11)

Mục tiêu: dạy tunnel thẳng trước khi có connector. Player học rằng nhiều pipe thẳng cùng trục có thể tạo route bắc cầu qua tường/khoảng bị chặn, không chỉ là object để push.

### Level 7 — Tunnel intro

Dạy: tunnel không chỉ đưa tới goal; nó bắc qua tường để đưa player tới phía sau pipe rồi push ngược về goal.

```
1 1 1 1 1 1 1 1
3 0 0 5 0 0 0 1
1 1 1 1 1 1 0 1
1 2 0 5 0 5 0 1
1 1 1 1 1 1 1 1
```

- Grid: 8×5
- Steps: 10
- Solution: →, →, →, ↑, ↑, ←, ←, ←, ←, ←
- Flow: dùng tunnel dưới `5 0 5` để bắc qua tường sang hành lang phải, đi lên đứng sau pipe trên, push pipe về trái rồi xuyên vào goal.

### Level 8 — Straight tunnel practice

Dạy: tunnel route có thể nối nhiều đoạn thẳng. Level này cho player thấy cả vertical route và horizontal route trong một lần chơi.

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
- Steps: 7
- Solution: ↑, ↑, ↑, ↑, →, →, →
- Flow: xuyên route dọc `6 0 6`, sau đó xuyên route ngang `5 0 5` rồi vào goal.

### Level 9 — Align vertical pipes

Dạy: phải đẩy cái `6` thứ hai vào thẳng hàng với cái `6` đầu để tạo bridge dọc, rồi mới đi lên được top lane.

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
- Steps: 15
- Solution: ↑, →, →, →, ↑, ←, ←, ↓, ←, ↑, ↑, →, →, →, →s
- Flow:
  - Đi tới bên phải cái `6` thứ hai.
  - Push `6` sang trái 2 lần để nó thẳng hàng với `6` đầu.
  - Dùng bridge dọc mới tạo để lên top lane, rồi xuyên pipe ngang vào goal.

### Level 10 — straight tunnel with normal box

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

### Level 11 — Straight tunnel boss

Dạy: boss của Chapter 2. Player phải dọn 2 box để mở đúng hành lang push, căn pipe dọc thành bridge, dùng tunnel ngang để sang nửa phải, rồi đẩy pipe cuối từ dưới lên vào lane goal trước khi xuyên.

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

- Grid: 11×8
- Steps: 31
- Solution: ↑, →, ↑, ↓, →, →, ↑, ←, ←, ↓, ←, ↑, ↑, ↑, ↑, →, →, →, →, →, ↓, ↓, →, →, ↑, ←, ←, ↑, →, →, →
- Flow:
  - Push box bên trái lên để mở ô đích cho pipe dọc.
  - Đi vòng sang phải, push box bên phải lên để mở ô đứng bên phải pipe dọc.
  - Đẩy pipe dọc sang trái 2 lần để nó thẳng hàng với pipe dọc phía trên.
  - Quay xuống cột trái, dùng bridge dọc mới tạo để lên top lane.
  - Dùng tunnel ngang `5 0 5` để sang nửa phải top lane, rồi đi vòng xuống dưới pipe cuối.
  - Push pipe cuối lên vào ô sát goal.
  - Quay lại bên trái pipe vừa đặt, xuyên pipe ngang để vào goal.
- Core idea: kiểm tra lại toàn bộ Chapter 2: tunnel là access tool, pipe phải được căn đúng hàng, box/order quyết định cả ô đứng lẫn ô đích, và endpoint goal phải do player tự tạo trước khi win.

## Chapter 3: Connector Tunnels (Level 12-14)

Mục tiêu: nối tiếp Chapter 2 bằng các tunnel route có bẻ hướng. Connector không cần một level showcase riêng; nó xuất hiện như một đoạn trong route di chuyển, rồi dần trở thành thứ player phải đặt đúng chỗ để mở đường.

### Level 12 — Connector bridge

Dạy: connector là một đoạn trong route di chuyển, không phải object tutorial đứng riêng. Level này nhẹ hơn Level 11 nhưng vẫn dùng connector để bắc qua vùng bị chặn.

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

### Level 13 — Reverse bend

Dạy: cùng một connector nhưng đảo hướng route: vào bằng pipe dọc, ra bằng pipe ngang.

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

- Grid: 6×6
- Steps: 6
- Solution: →, ↑, ↑, ↑, ←, ←
- Flow: đi lên vào `6`, qua connector, rẽ trái qua `5`, rồi vào goal.
- Core idea: connector là omni-direction; H→V và V→H là cùng một luật.

### Level 14 — Connect to move

Dạy: đôi khi route chưa có sẵn. Player phải đẩy connector vào khe để tạo route, rồi mới dùng route đó để di chuyển tới goal.

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
