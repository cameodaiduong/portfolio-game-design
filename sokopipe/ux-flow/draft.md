# Phase 4: UX & Flow — Draft

## 4.1 Game Flow

```
Main Menu → Level Select → Gameplay → Win Panel → Level Select
                              ↓
                          Pause Menu → Resume / Reset / Level Select
```

## 4.2 Màn hình

| Màn hình | Nội dung |
|----------|----------|
| Main Menu | Logo Soko Pipe, nút Play, nút Credits |
| Level Select | Grid 15 level, chưa unlock = khoá, đã clear = tick |
| Gameplay | Grid + HUD |
| Win Panel | "Level Complete", số bước, nút Next Level |
| Pause Menu | Resume, Reset, Back to Level Select |

## 4.3 HUD (in-game)

- Level number (góc trên trái)
- Move count (góc trên phải)
- Undo button
- Reset button
- Pause/Menu button

## 4.4 Unlock Logic

- Level 1 mở sẵn
- Clear level N → unlock level N+1
- Không star rating, không optimal step bonus

## 4.5 Input

- Desktop: arrow keys hoặc WASD
- Mobile/iPad: swipe 4 hướng
- Mỗi input = 1 bước di chuyển

## 4.6 Camera

Isometric cố định. Không zoom/pan/rotate. Grid 5x5-7x7 fit 1 màn hình.

## 4.7 Feedback

| Hành động | Feedback |
|-----------|----------|
| Đẩy box/ống | Animation slide 1 ô |
| Xuyên tunnel | Player di chuyển qua ống |
| Đẩy không được | Không di chuyển, nhẹ shake |
| Ống nối thành tunnel | Visual nối liền |
| Win | Particle effect + sound |
| Undo | Animation lùi nhanh |
