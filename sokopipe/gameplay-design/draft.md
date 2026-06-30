# Phase 2: Gameplay Design — Draft

## 2.1 Mechanics

Scope hiện tại: **14 level**, tập trung vào 3 lớp mechanic:

1. Sokoban push cơ bản
2. Tunnel box thẳng: ngang/dọc
3. Tunnel box connector: bẻ hướng và tự tạo route

Không có directional corner, key/door, color gate, enemy, rotate tile trong bản portfolio/MVP.

### Tile/Object ID

| ID | Tên | Nhóm | Tương tác chính |
|----|-----|------|-----------------|
| `0` | Sàn trống | Tile | Player đi bộ qua được |
| `1` | Tường | Tile | Chặn di chuyển, chặn push, chặn tunnel |
| `2` | Player | Actor | Di chuyển 4 hướng, push object, xuyên tunnel |
| `3` | Goal | Tile endpoint | Player tới đây thì win |
| `4` | Box thường | Push object | Bị đẩy, chặn đường, không xuyên |
| `5` | Ống ngang | Tunnel box | Bị đẩy; entry/traverse tunnel theo trái-phải |
| `6` | Ống dọc | Tunnel box | Bị đẩy; entry/traverse tunnel theo lên-xuống |
| `7` | Connector | Tunnel box | Bị đẩy; nối/rẽ route sau khi route bắt đầu từ `5/6` |

### Push Core
- Player di chuyển 4 hướng (lên/xuống/trái/phải)
- Bản chất game vẫn là Sokoban: phần lớn puzzle đến từ việc đứng đúng phía và đẩy object đúng thứ tự
- Object đẩy được gồm: box thường `4`, ống ngang `5`, ống dọc `6`, connector `7`
- Đi từ sàn vào object đẩy được → nếu object không kích hoạt tunnel traversal thì cố gắng đẩy object 1 ô theo hướng player đi
- Với `5/6`, tunnel traversal được ưu tiên hơn push khi hướng vào và route phía trước hợp lệ
- Object chạm tường hoặc object khác → không đẩy được
- Không kéo, không đẩy 2 box cùng lúc
- Sau khi đẩy thành công, player đứng vào ô cũ của object

### Box Thường `4`
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

#### Ống ngang `5`
- Là box tunnel thẳng theo trục trái/phải
- Nếu đứng trên sàn và đi vào `5` theo trái/phải:
  - Nếu phía trước tạo được tunnel route hợp lệ → player xuyên theo route
  - Nếu không có route hợp lệ → `5` bị đẩy như box thường nếu ô sau hợp lệ
- Chỉ cho traversal theo ngang; đi vào từ trên/dưới không tạo tunnel ngang
- Khi đơn lẻ hoặc chưa nối đúng hướng, nó chủ yếu là object để push
- Có thể nối trực tiếp với goal theo ngang: `5 → 3`

#### Ống dọc `6`
- Là box tunnel thẳng theo trục lên/xuống
- Nếu đứng trên sàn và đi vào `6` theo lên/xuống:
  - Nếu phía trước tạo được tunnel route hợp lệ → player xuyên theo route
  - Nếu không có route hợp lệ → `6` bị đẩy như box thường nếu ô sau hợp lệ
- Chỉ cho traversal theo dọc; đi vào từ trái/phải không tạo tunnel dọc
- Khi đơn lẻ hoặc chưa nối đúng hướng, nó chủ yếu là object để push
- Có thể nối trực tiếp với goal theo dọc: `6 → 3`

#### Connector `7`
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
- Player chỉ được bắt đầu xuyên từ `5` theo ngang hoặc `6` theo dọc
- Route hợp lệ có thể là:
  - `5 → 3`
  - `6 → 3`
  - `5 → ... → 5/7/3`
  - `6 → ... → 6/7/3`
  - `5/6 → 7 → 5/6/3`
- Route qua connector phải có tối thiểu 3 ô liên quan: entry pipe → connector → exit pipe/goal
- Nếu route sai hướng, bị box/tường/object chặn, hoặc không có exit hợp lệ → player không xuyên; nếu đang đi từ sàn vào object đó thì xử lý như push
- Tunnel route trong level design phải có tác dụng bắc cầu/access; không đặt pipe trên hành lang trống nếu đi bộ thường cũng giải được
- Goal `3` là endpoint để player tới, không phải box target chính; puzzle nên đặt pipe/connector sát hoặc thông route tới goal, rồi player xuyên vào goal
- UI: ống nối thành tunnel → render thành 1 đường ống liền

## 2.2 Game Objects

| Object | Ký hiệu | Visual (mesh) | Behavior |
|--------|---------|---------------|----------|
| Sàn trống | `0` | flat tile | đi bộ qua được |
| Tường | `1` | cube đặc, tối | không đi qua, không đẩy |
| Player | `2` | nhân vật nhỏ | di chuyển 4 hướng, đẩy object, xuyên tunnel |
| Goal | `3` | tile highlight vàng | player tới đây → win |
| Box thường | `4` | cube đặc, xám | bị đẩy, chặn đường, không xuyên |
| Ống ngang | `5` | cylinder rỗng nằm ngang | box tunnel ngang; push được; entry/traverse trái-phải |
| Ống dọc | `6` | cylinder rỗng đứng dọc | box tunnel dọc; push được; entry/traverse lên-xuống |
| Connector | `7` | khớp nối đa hướng | box tunnel connector; push được; chỉ hoạt động bên trong route đã bắt đầu từ `5/6` |

## 2.3 Game Rules

- **Win condition:** player đến ô goal `3`
- **Lose condition:** không có lose state — puzzle game, sai thì undo/reset
- **Undo:** unlimited, lùi từng bước
- **Reset:** về trạng thái đầu level, không giới hạn

## 2.4 Edge Cases

| Case | Kết quả |
|------|---------|
| Đẩy box vào tường | Không đẩy được, player đứng yên |
| Đẩy box vào box khác | Không đẩy được |
| Đi vào `5` ngang nhưng không có route hợp lệ | Thử push `5` như box thường |
| Đi vào `6` dọc nhưng không có route hợp lệ | Thử push `6` như box thường |
| Đi vào `5` từ trên/dưới | Không kích hoạt tunnel ngang; xử lý như push nếu ô sau hợp lệ |
| Đi vào `6` từ trái/phải | Không kích hoạt tunnel dọc; xử lý như push nếu ô sau hợp lệ |
| Đi từ sàn vào `7` | Không xuyên; push connector nếu ô sau hợp lệ |
| Xuyên tunnel, ô kế tiếp là tường/box/object sai hướng | Không xuyên được, player bị chặn |
| Xuyên tunnel, ô kế tiếp là pipe/connector thông hướng | Player di chuyển tiếp theo route/input hợp lệ |
| Đẩy ống/connector vào object khác | Không đẩy được |
| Đẩy ống/connector đang nối tunnel | Tunnel bị đứt hoặc đổi route ngay sau khi object đổi vị trí |
| Player đứng trong tunnel, ống bị đẩy bởi gì? | Không xảy ra — chỉ player đẩy, không có ngoại lực |
| Straight + connector + straight/goal | Thông mọi hướng, miễn route bắt đầu từ `5/6` và có tối thiểu 3 ô |
| Connector nhận vào và đi ra cùng trục | Hợp lệ; connector có thể hoạt động như đoạn nối thẳng |

## 2.5 Mechanic đã cắt khỏi scope

| Mechanic | Lý do cắt |
|----------|-----------|
| Color gate (ống màu + đổi màu player) | Thời gian không đủ |
| Enemy (quái tuần tra, trốn trong ống) | Thời gian không đủ, cần AI pathfinding |
| Ô xoay (rotate tile) | Không cần — connector đã giải quyết đổi hướng |
| Directional corners (┘└┐┌) | Connector đa hướng đủ depth, corner thêm complexity không cần thiết |
| Key/Door | Không phục vụ core thesis "pipe vừa là vật cản vừa là đường đi"; dễ làm scope loãng |
