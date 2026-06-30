# Phase 2: Gameplay Design — Draft

## 2.1 Mechanics

### Push (core — giữ nguyên từ Sokoban)
- Player di chuyển 4 hướng (lên/xuống/trái/phải)
- Đi vào ô có box → đẩy box 1 ô theo hướng player đi
- Box chạm tường hoặc box khác → không đẩy được
- Không kéo, không đẩy 2 box cùng lúc

### Tunnel (mechanic mới — core của Soko Pipe)
- Ống đơn lẻ (không nối gì) = obstacle, đẩy như box thường
- 2+ ống cùng trục trong một route → tạo tunnel route; ô trống giữa các pipe là landing, pipe là đoạn bắc cầu qua chỗ không đi bộ thường được
- Tunnel route phải có tác dụng bắc cầu qua tường/khoảng bị chặn; nếu đặt pipe trên hành lang trống tương đương `00` thì level design sai
- Player chỉ được **bắt đầu vào tunnel từ ống thẳng** (`5` theo ngang, `6` theo dọc)
- Connector là box connector đặc biệt: nhận hướng vào bất kỳ và cho ra hướng bất kỳ nếu có pipe/goal nối tiếp
- Connector cho phép cả đi thẳng và rẽ hướng; directional corner về sau mới là connector bị khóa theo hướng cụ thể
- Route qua connector phải có tối thiểu 3 ô liên quan: entry pipe → connector → exit pipe/goal
- Không được đi trực tiếp từ sàn vào connector/corner; chúng chỉ hoạt động khi player đã ở trong tunnel route
- Goal có thể nối với ống thẳng, connector, hoặc corner nếu route thông hướng tới goal
- Ví dụ hợp lệ: player vào `5`, route đi `5→connector→6→goal`
- Sai hướng / bị box chặn / bị tường chặn → player bị chặn, không xuyên
- UI: ống nối thành tunnel → render thành 1 đường ống liền

## 2.2 Game Objects

| Object | Ký hiệu | Visual (mesh) | Behavior |
|--------|---------|---------------|----------|
| Player | P | nhân vật nhỏ | di chuyển 4 hướng, đẩy box, xuyên tunnel |
| Box thường | X | cube đặc, xám | bị đẩy, chặn đường, không xuyên |
| Ống ngang | - | cylinder rỗng nằm ngang | bị đẩy, xuyên khi đi trái/phải |
| Ống dọc | \| | cylinder rỗng đứng dọc | bị đẩy, xuyên khi đi lên/xuống |
| Connector | + | khớp nối đa hướng | bị đẩy, không vào trực tiếp từ sàn, cho đi thẳng/rẽ mọi hướng trong tunnel route |
| Ống góc ┘ | ┘ | ống cong góc vuông | bị đẩy, xuyên: đi phải→lên, đi xuống→trái |
| Ống góc └ | └ | ống cong góc vuông | bị đẩy, xuyên: đi trái→lên, đi xuống→phải |
| Ống góc ┐ | ┐ | ống cong góc vuông | bị đẩy, xuyên: đi phải→xuống, đi lên→trái |
| Ống góc ┌ | ┌ | ống cong góc vuông | bị đẩy, xuyên: đi trái→xuống, đi lên→phải |
| Source | 1 | tile highlight xanh | điểm xuất phát |
| Goal | 2 | tile highlight vàng | player đến đây → win |
| Tường | W | cube đặc, tối | không đi qua, không đẩy |
| Sàn trống | . | flat tile | đi qua tự do |

## 2.3 Game Rules

- **Win condition:** player đến ô goal (2)
- **Lose condition:** không có lose state — puzzle game, sai thì undo/reset
- **Undo:** unlimited, lùi từng bước
- **Reset:** về trạng thái đầu level, không giới hạn

## 2.4 Edge Cases

| Case | Kết quả |
|------|---------|
| Đẩy box vào tường | Không đẩy được, player đứng yên |
| Đẩy box vào box khác | Không đẩy được |
| Xuyên ống, ô kế tiếp là tường/box | Không xuyên được, player bị chặn |
| Xuyên ống, ô kế tiếp là ống thông | Xuyên ống 1, dừng trong ống 1, bước tiếp xuyên ống 2 |
| Đẩy ống vào ống khác | Không đẩy được (giống push box vào box) |
| Đẩy ống đang nối tunnel | Tunnel bị đứt, ống tách ra |
| Player đứng trong tunnel, ống bị đẩy bởi gì? | Không xảy ra — chỉ player đẩy, không có ngoại lực |
| Straight + connector + straight/goal | Thông mọi hướng, miễn route bắt đầu từ straight pipe và có tối thiểu 3 ô |
| Connector nhận vào và đi ra cùng trục | Hợp lệ; connector có thể hoạt động như đoạn nối thẳng |
| Player từ sàn đi trực tiếp vào connector | Không xuyên, connector bị đẩy như box nếu ô sau hợp lệ |
| Corner + ống thẳng liền nhau | Thông nếu exit direction match: VD ┐ exit xuống + ống dọc bên dưới → tunnel |
| Player từ sàn đi trực tiếp vào corner | Không xuyên, corner bị đẩy như box nếu ô sau hợp lệ |
| Tunnel route kết thúc bằng corner nối goal | Hợp lệ nếu player đã vào route từ ống thẳng và corner exit hướng vào goal |

## 2.5 Mechanic đã cắt khỏi scope

| Mechanic | Lý do cắt |
|----------|-----------|
| Color gate (ống màu + đổi màu player) | Thời gian không đủ |
| Enemy (quái tuần tra, trốn trong ống) | Thời gian không đủ, cần AI pathfinding |
| Ô xoay (rotate tile) | Không cần — corner pipes đã giải quyết đổi hướng |
