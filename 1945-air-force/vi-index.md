# 1945 Air Force - Design Deconstruction

## 1. Executive Summary

1945 Air Force là một game mobile vertical shoot 'em up: người chơi điều khiển máy bay bằng thao tác kéo/chạm, game tự động bắn, người chơi tập trung vào né đạn, vượt wave, đánh boss và nhận thưởng sau mỗi trận.

<img src="../1945-air-force-deconstruction/assets/ux/dashboard.jpeg" alt="Dashboard chính: Quick Play, squadron/loadout, event và offer cùng nằm trên hub" width="500">

Luận điểm chính của bản deconstruction này:

> 1945 Air Force tồn tại lâu nhờ tập trung mở rộng chiều sâu progression/meta như nâng cấp, sưu tập, gear, event và economy, trong khi vẫn giữ trải nghiệm combat arcade quen thuộc, dễ hiểu và dễ quay lại.

Combat của game đơn giản:

- Kéo máy bay để né.
- Auto-fire liên tục.
- Màn chơi ngắn.
- Đạn, nổ, loot và boss tạo cảm giác arcade mạnh.

Nhưng thứ giữ người chơi lại nằm ở phần meta:

- Nhiều unit để sở hữu và đầu tư: Aircraft, Wingman, Device, Co-pilot, Pilot.
- Nhiều trục tăng power: upgrade, promote, tier merge, gear, engine, certificate.
- Nhiều tài nguyên: Gold, Gems, Modules, Wrenches, Chips, Beer, Towels, Fuel, event currency.
- Nhiều routine quay lại: daily gift, daily mission, event, PvP, clan, collection.
- Nhiều điểm monetization: rewarded ads, interstitial ads, revive, IAP pack, VIP, battle pass, gacha, limited offer.

Bản deconstruction này phân tích cách 1945 Air Force tổ chức các hệ thống như máy bay, gear, event, VIP, economy và monetization thành một vòng lặp liên tục: người chơi vào combat, nhận reward, dùng reward để nâng cấp, gặp nhu cầu tài nguyên mới, rồi được dẫn sang farm, event, ad, gacha hoặc shop trước khi quay lại combat mạnh hơn.

```mermaid
flowchart LR
    A[Battle] --> B[Reward]
    B --> C[Upgrade / Optimize Loadout]
    C --> D[Power Gap]
    D --> E[Resource Need]
    E --> F[Farm / Ads / Event / Gacha / Shop]
    F --> G[Power Gain]
    G --> H[Harder Content]
    H --> I[New Goals]
    I --> A

    classDef node fill:#f3f4f6,stroke:#6b7280,color:#111827,stroke-width:1.5px,font-size:18px;
    class A,B,C,D,E,F,G,H,I node;
    linkStyle default stroke:#6b7280,stroke-width:2px;
```

Đây là operating model của 1945 Air Force.

## 2. Core Operating Model

1945 Air Force vận hành theo core loop:

```mermaid
flowchart LR
    A[Play Level] --> B[Earn Rewards]
    B --> C[Upgrade / Optimize<br/>Loadout]
    C --> D[Unlock Harder Content]
    D --> A

    classDef node fill:#f3f4f6,stroke:#6b7280,color:#111827,stroke-width:1.5px,font-size:18px;
    class A,B,C,D node;
    linkStyle default stroke:#6b7280,stroke-width:2px;
```

Với người chơi, loop này diễn ra rất nhanh: mở game, bấm vào màn chơi, kéo máy bay để né đạn, xem máy bay tự bắn, kết thúc trận và nhận phần thưởng. Một session có thể chỉ kéo dài vài phút nhưng vẫn tạo cảm giác có tiến triển, vì sau trận người chơi thường có thêm tài nguyên để nâng cấp hoặc tiến gần hơn tới mục tiêu tiếp theo.

Điểm quan trọng là game không bắt người chơi học quá nhiều trước khi thấy vui. Họ chỉ cần hiểu một hành động chính: di chuyển máy bay để sống sót. Phần tấn công đã được auto-fire xử lý, nên độ khó tập trung vào việc đọc đạn, tìm khoảng trống an toàn và né đúng thời điểm.

Ở mức meta, loop này sâu hơn:

```text
Combat Result
-> Gold / Gems / Modules / Materials
-> Aircraft / Wingman / Device / Gear / Engine upgrade
-> Power tăng
-> Mission khó hơn / difficulty cao hơn / boss khó hơn
-> Resource requirement mới
```

Reward luôn được gắn với một nhu cầu đầu tư tiếp theo. Nếu người chơi có Gold, họ có thể upgrade. Nếu thiếu Modules, họ phải đi campaign, event hoặc shop. Nếu thiếu Wrenches, họ phải farm daily, tournament hoặc event. Nếu muốn gear tốt hơn, họ bị kéo vào Gear Machine/gacha.

Nói cách khác, mỗi màn chơi là một bước nhỏ: tích lũy thêm resource, nâng thêm một chút power, tiến gần hơn tới content khó hơn.

Operating model có 4 lớp:

| Lớp                    | Vai trò                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| Core combat            | Tạo fun tức thời và nguồn reward                                  |
| Meta progression       | Tạo mục tiêu ngắn, trung và dài hạn                               |
| Economy routing        | Quyết định người chơi phải làm gì khi thiếu resource              |
| LiveOps / monetization | Biến nhu cầu tiến bộ thành thói quen quay lại và trigger chi tiền |

Combat tạo reward, reward tạo nhu cầu upgrade, nhu cầu upgrade giữ người chơi quay lại và mở ra điểm chi tiền. Toàn bộ game xoay quanh vòng này.

## 3. Systems Breakdown

### 3.1 Core Combat System

Core combat của 1945 Air Force gồm 5 thành phần chính:

- One-thumb movement: người chơi kéo hoặc chạm để di chuyển máy bay.
- Auto-fire: game tự động bắn, người chơi không cần giữ nút fire.
- Active skills: aircraft skill và device skill, người chơi bấm kích hoạt giữa trận. Loại skill sẽ phụ thuộc loadout đang sử dụng.
- Bullet dodge: thử thách chính là đọc đạn, né đạn, nắm hitbox.
- Wave/boss structure: level gồm wave địch, power-up và boss có pattern.

<img src="../1945-air-force-deconstruction/assets/gameplay_battle.jpeg" alt="In-battle HUD: HP, timer, device skill, aircraft/wingman và bullet pattern" width="500">

Auto-fire giảm execution burden trên mobile. Màn hình cảm ứng nhỏ, nếu vừa phải bắn vừa phải né, control sẽ nặng. 1945 Air Force cắt bớt nút bắn để người chơi tập trung vào positioning.

Skill expression đến từ dodge và timing: hitbox nhỏ hơn sprite, bullet pattern ngày càng dày, boss có phase và telegraph.

<img src="../1945-air-force-deconstruction/assets/hitbox_example.png" alt="Hitbox nhỏ hơn sprite: cánh có thể lướt qua đạn, phần thân mới là vùng nguy hiểm chính" width="500">

Core combat đóng vai trò engine tạo reward. Mỗi lần người chơi chơi một màn, game có cơ hội:

- Trả reward.
- Kích hoạt ad/revive.
- Đẩy người chơi về upgrade.
- Tạo cảm giác thiếu một chút nữa là qua, dẫn tới nhu cầu tăng power.

Rủi ro của combat là readability. Khi bullet, player shot, explosion, loot và background chồng lên nhau, người chơi có thể chết mà không hiểu vì sao. Với shmup, điều này rất nguy hiểm: khó thì chấp nhận được, nhưng không đọc được thì dễ bị cảm giác bất công.

### 3.2 Loadout / Content System

1945 Air Force có nhiều loại đối tượng để người chơi sở hữu và build:

- Aircraft: unit chính người chơi điều khiển.
- Wingman: hỗ trợ bắn, mở rộng damage footprint.
- Device: hỗ trợ utility/burst trong battle.
- Co-pilot: nhân vật hỗ trợ stat và skill.
- Pilot: nhân vật chính có gear riêng.

<img src="assets/loadout/full-loadout.png" alt="Full loadout: aircraft, wingman, device, co-pilot và pilot cùng xuất hiện trên một màn hình" width="500">

Mỗi loại unit là một **investment surface** — thêm một nơi để người chơi đổ resource vào.

Aircraft có nhiều lớp đầu tư:

- Star/upgrade.
- Gear slot.
- Engine.
- Certificate.
- Skin có stat bonus.

<img src="../1945-air-force-deconstruction/assets/aircraft/aircraft-infomation.png" alt="Aircraft detail: star, stats, gear slots, engine và certificate trên một unit" width="500">

Wingman và Device cũng có gear/engine riêng. Pilot lại có body gear và multiplier stat riêng. Kết quả là người chơi gần như luôn có một thứ gì đó để nâng cấp, tối ưu, thay thế, merge hoặc farm.

<img src="../1945-air-force-deconstruction/assets/wingman/wingman-information.png" alt="Wingman screen: support unit có gear/engine riêng, mở thêm một bề mặt đầu tư ngoài aircraft" width="500">

<img src="../1945-air-force-deconstruction/assets/device/device-information.png" alt="Device screen: utility/burst support cũng có progression riêng" width="500">

Vai trò của Loadout System:

| Vai trò              | Tác dụng                                                |
| -------------------- | ------------------------------------------------------- |
| Collection           | Tạo mục tiêu sở hữu nhiều aircraft, wingman, device     |
| Build depth          | Người chơi phải chọn unit, damage type, gear, synergy   |
| Resource sink        | Mỗi unit mở thêm nơi tiêu Gold, Modules, Wrenches, Gems |
| Long-term retention  | Người chơi khó cảm thấy "xong hết"                      |
| Monetization surface | Pack, gacha, event reward, VIP advantage có đất để bán  |

Điểm mạnh của cách thiết kế này là combat core không cần thay đổi quá nhiều, nhưng game vẫn có cảm giác sâu hơn theo thời gian. Điểm yếu là complexity tăng rất nhanh. Nếu mở quá nhiều hệ thống sớm, người mới sẽ thấy dashboard và loadout như một ma trận.

### 3.3 Progression System

Progression của 1945 Air Force không nằm trên một trục duy nhất. Game chia power growth thành nhiều lớp:

- Upgrade bằng Gold.
- Promote bằng Modules.
- Tier Merge bằng unit max star + Gems.
- Gear upgrade bằng Wrenches/Gems và merge rarity.
- Engine upgrade bằng Wrenches + Engine Batteries.
- Pilot gear bằng Towels/Gems.
- Certificate bằng chuỗi mission riêng.

<img src="../1945-air-force-deconstruction/assets/gear-upgrade/upgrade-main-gun.png" alt="Gear upgrade: nâng cấp Main Gun bằng resource, một trong nhiều đường tăng power" width="500">

Thiết kế này giải quyết một vấn đề lớn của F2P: nếu chỉ có một đường upgrade, người chơi sẽ nhanh chạm trần. 1945 Air Force tạo nhiều đường upgrade để khi một đường bị chậm lại, người chơi vẫn còn đường khác để theo.

Ví dụ:

```text
Hết Gold -> farm Campaign/Daily
Thiếu Modules -> Campaign/Event/Shop
Thiếu Gear -> Gear Machine hoặc Event
Thiếu Wrenches -> Daily/Tournament/Event
Cần Tier mới -> cần 2 unit max star + Gems
Cần stat nâng cao -> Gear/Engine/Certificate
```

Game luôn tạo ra next goal:

- Mục tiêu ngắn hạn: nâng thêm 1 level, thêm 1 star, clear level tiếp theo.
- Mục tiêu trung hạn: unlock gear slot, promote unit, hoàn thành daily shop.
- Mục tiêu dài hạn: merge lên tier cao, max gear rarity, làm certificate, sưu tập unit/skin.

Điểm mạnh: người chơi luôn có việc để làm.

Điểm yếu: nếu resource cost tăng quá nhanh, progression wall dễ bị cảm nhận như paywall. Người chơi không còn thấy mình cần chơi tốt hơn, mà thấy mình bị bắt farm hoặc mua.

<img src="../1945-air-force-deconstruction/assets/engine-upgrade/upgrade-engine.png" alt="Engine upgrade: thêm một trục power dùng material riêng và cạnh tranh với gear" width="500">

<img src="../1945-air-force-deconstruction/assets/certificate/basic-certificate.png" alt="Certificate: chuỗi mục tiêu theo aircraft, biến breadth of play thành power lâu dài" width="500">

### 3.4 Economy System

Economy của 1945 Air Force gồm nhiều currency và material:

- Gold: soft currency cho upgrade.
- Gems: hard currency cho revive, merge, elite gear, gacha, skip, shop.
- Modules: promote unit.
- Wrenches: gear/engine upgrade.
- Engine Batteries: engine upgrade, scarce/event-gated.
- Chips: Gear Machine/gacha.
- Beer: pity/material từ failed spin hoặc disassemble.
- Towels: pilot gear upgrade.
- Medals: PvP/tournament shop.
- Fuel/Dog Tags: gate attempt/session.
- Event currency: dùng trong event shop, hết giá trị sau event.

Economy **route behavior**: khi thiếu resource, game dẫn người chơi sang hành vi khác.

Ví dụ:

```text
Thiếu Gold -> replay/farm Campaign, Daily, ad crate
Thiếu Modules -> Campaign difficulty, Event, Module shop
Thiếu Wrenches -> Daily Mission, Tournament, Event
Thiếu Gear -> Gear Machine, Chips, Beer shop
Thiếu Gems -> campaign reward, ad, IAP
Thiếu Event item -> chơi event/campaign trong thời gian event
```

Battle tạo resource. Resource tiêu vào progression. Khi resource thiếu, game mở ra daily/event/shop/ad/gacha. Economy biến nhu cầu mạnh hơn thành lý do quay lại hoặc chi tiền.

<img src="../1945-air-force-deconstruction/assets/campaign/campaign-rewards.png" alt="Campaign reward: battle result trả Gold, Gem, Honor Point và Modules để đổ vào progression" width="500">

Điểm mạnh của economy là mỗi resource có vai trò riêng, giúp game điều tiết progression tốt. Điểm yếu là cognitive load: người chơi mới có thể không biết Chips, Beer, Wrenches, Batteries, Modules khác nhau thế nào và nên farm cái nào trước.

### 3.5 Retention / LiveOps System

#### Session flow

Một session điển hình: mở app → check daily hooks → chọn mode → chơi 1-3 trận → claim reward → upgrade nếu đủ resource → tiếp hoặc thoát. Session ngắn (vài phút) nhưng có closure sau mỗi trận.

#### Daily / Weekly hooks

| Hook | Cơ chế | Vai trò |
| ---- | ------ | ------- |
| Daily Gift | Cycle 7 ngày, lặp 4 tuần. VIP double reward. Day 7 cho aircraft | Login incentive |
| Daily Missions | 4 mode (Bombardment, Protect, Stealth, Assault), attempt giới hạn. Mỗi mode có currency riêng → shop | Farm resource có chọn lọc |
| Free Ad Crates | 3 tier × 3 lượt, reset định kỳ. Bonus chest ở 80 ad views | Ad engagement hàng ngày |

<img src="../1945-air-force-deconstruction/assets/retention/daily-gift.png" alt="Daily Gift: login reward tạo lý do quay lại theo chu kỳ" width="500">

#### Game modes và vai trò retention

| Mode | Vai trò |
| ---- | ------- |
| Campaign | Progression chính, 900+ levels × 3 difficulty |
| Daily Missions | Farm targeted resource |
| Boss Fights | Skill check, damage test |
| PvP (Eliminate) | Competitive tension |
| Last Stand | Survival/endurance |
| Co-op (United We Stand) | Social |
| Clan/Squadron Challenges | Clan retention, exclusive rewards |
| Events | FOMO, exclusive rewards |

Tất cả modes dùng chung combat core, chỉ đổi mục tiêu và reward wrapper.

#### Event system

| Event type | Duration | Cơ chế |
| ---------- | -------- | ------ |
| Seasonal/Holiday | ~2 tuần | Event currency drop trong Campaign → exchange shop (crates, modules, skins, gear) |
| Special Event | 1-3 ngày | Complete missions → collect medals → milestone rewards |
| New Pilot Event | 7 ngày | Onboarding quest chain cho người mới, milestone rewards |

<img src="../1945-air-force-deconstruction/assets/retention/event-independence-day.png" alt="Seasonal event: event currency + timer + exchange shop tạo FOMO và mục tiêu ngắn hạn" width="500">

Event currency riêng per event, không tích trữ được → phải chơi trong thời gian event. Exclusive rewards ở milestone cao tạo FOMO.

#### Unlock pacing

Game gate system theo Career Rank để không overwhelm người mới:

| Unlock | Requirement |
| ------ | ----------- |
| Wingman slot | Campaign Mission 2 (free P47) |
| Device slot | Campaign Mission 8 |
| PvP (Eliminate) | Airman 2 |
| Sea Battlefield | Master Sergeant |
| Clan | Higher ranks |

Fun đến trước, complexity mở sau. Wingman mở sớm (mission 2) để show squad-building, nhưng Device đợi tới mission 8 — đủ thời gian hiểu upgrade/promote trên một unit trước khi thêm unit thứ ba.

#### Retention 3 tầng

| Tầng | Cơ chế | Ví dụ |
| ---- | ------ | ----- |
| Short-term | Battle ngắn, reward rõ, upgrade gần | Control đơn giản, stage ngắn, bắn/nổ/loot liên tục |
| Mid-term | Power gate + daily routine | Campaign khó hơn, daily missions cho targeted resource, gear/engine farm |
| Long-term | Mục tiêu khó hoàn thành | 60+ aircraft, tier merge T2/T3/T4, certificate, event-exclusive skins, clan/PvP |

1945 Air Force chạy kiểu infinite treadmill: khi một trục progression gần max, game còn trục khác — aircraft → wingman → device → gear → engine → pilot gear → certificate → skin/event.

#### Re-engagement

Push notification khi energy đầy, event start/end, daily reset. Session end hiện next reward để kéo người chơi quay lại.

#### Rủi ro

- Dashboard clutter: quá nhiều event, badge, offer, shop, mission → người mới quá tải.
- Metagame phình to: nếu người chơi không thấy next best action, retention hook biến thành confusion.

### 3.6 Monetization System

1945 Air Force dùng hybrid monetization:

#### Ad system

| Ad type | Khi nào | Lựa chọn | Mục đích |
| ------- | ------- | --------- | -------- |
| Rewarded video | Sau trận (double reward), sau chết (revive), daily free gems, free crates | Opt-in | Biến desire state thành ad view |
| Interstitial | Sau hoàn thành Campaign map | Bắt buộc, skip sau delay | Baseline ad revenue |

Mua bất kỳ IAP nào (kể cả $0.99) giảm hoặc bỏ interstitial → lần mua đầu là QoL upgrade, không chỉ power boost.

Revive: chết giữa trận → 2 option: Gems hoặc xem ad (max 5 ad/ngày). Conversion cao vì người chơi đã đổ thời gian vào run đó.

<img src="../1945-air-force-deconstruction/assets/monetization/free.png" alt="Free tab: rewarded ads được đóng gói thành crate/reward loop" width="500">

Free tab trong shop: 3 crate tier × 3 lượt mỗi tier. Rewards: Gold (tới 3,000), Gems/Wrenches/Modules (tới 15). Bonus chest ở 80 total ad views.

#### IAP

| IAP type | Target | Price |
| -------- | ------ | ----- |
| Battle Pass Premium | Active player | \$14.98 |
| Battle Pass Premium Plus | Active player | \$19.98 |
| Battle Pass Ultra | Heavy spender | \$39.98 |
| Battle Pass Ultra Plus | Heavy spender | \$49.98 |
| Gem Packs | Any | \$0.98 – \$149.98 |
| Limited Offers | Active player | Varies (FOMO) |

#### Popup offers

Star upgrade (ví dụ 3 star → 10 star bằng Gems), promotion mua aircraft, nâng cấp giá rẻ cho tài khoản mới. Xuất hiện khi mở game, sau mỗi trận, khi vào menu — lặp lại liên tục.

#### Gacha / Gear Machine

Gear Machine gắn gacha với power thay vì chỉ cosmetic. Chips tạo pull, gear tạo stat, Beer làm pity để failed pull vẫn có giá trị. Kể cả không trúng, người chơi vẫn tích lũy Beer để đổi gear trong Mileage Shop.

#### VIP

Cumulative lifetime spending — không phải subscription. Mỗi $1 ≈ 10 VIP Points. VIP level permanent, không reset. Scale tới VIP 50 (5,000,000+ points).

Privileges cộng dồn: permanent damage + fuel increase, bonus daily gold, thêm daily mission attempts, shop resets, equipment backup slots.

<img src="../1945-air-force-deconstruction/assets/monetization/vip.png" alt="VIP privilege: lifetime spending ladder biến chi tiêu thành power và resource advantage dài hạn" width="500">

#### Monetization trigger theo desire state

| Player state | Trigger |
| ------------ | ------- |
| Chết giữa trận | Revive bằng ad hoặc Gems |
| Thiếu resource | Pack, ad crate, daily grind |
| Muốn gear tốt | Gear Machine/gacha |
| Muốn tiến nhanh | VIP, battle pass, IAP |
| Sợ lỡ event reward | Limited offer/event pack |
| Khó chịu vì pop-up ads | Mua lần đầu để giảm/bỏ interstitial |
| Vừa xong trận / mở game | Popup offer star upgrade, promotion pack |

#### Progression speed theo spending tier

| Tier | Tác động |
| ---- | -------- |
| F2P | Daily cap, ad-gated rewards, không stat bonus. Chậm nhất |
| Light spender | Bỏ interstitial + Battle Pass + low VIP |
| Heavy spender | VIP stat bonus + thêm daily attempts + premium resources. Advantage compound: stat cao → clear khó hơn → reward tốt hơn → upgrade nhanh hơn |

Game bán tốc độ, convenience, attempt và advantage — không khóa content sau paywall.

#### Rủi ro

- Spending advantage cộng dồn quá mạnh → PvP/leaderboard bị cảm nhận là pay-to-win.
- Popup offer xuất hiện quá thường xuyên → người chơi không muốn mua vẫn bị ép nhìn liên tục, gây khó chịu.

## 4. System Connection Map

Phần này cho thấy các system ở mục 3 tương tác với nhau thế nào — system nào trigger system nào, và người chơi bị dẫn đi đâu tại mỗi điểm.

```mermaid
flowchart TD
    Combat["① Combat"] -->|Gold, Gems, Modules| Economy["② Economy"]
    Economy -->|Resources| Progression["③ Progression"]
    Progression -->|Power tăng| Combat
    Progression -->|Thiếu resource| Routing["④ Farm / Event / Ad / Shop"]
    Routing -->|Resource| Economy
    LiveOps["⑤ LiveOps"] -->|Event currency, FOMO| Routing
    Monetization["⑥ Monetization"] -->|VIP, IAP| Progression
    Monetization -->|Revive| Combat
    Progression -->|Speed wall| Monetization

    classDef node fill:#f3f4f6,stroke:#6b7280,color:#111827,stroke-width:1.5px,font-size:18px;
    class Combat,Economy,Progression,Routing,LiveOps,Monetization node;
    linkStyle default stroke:#6b7280,stroke-width:2px;
```

### 4.1 Combat → Economy

Mỗi lần chơi một màn, game trả resource cụ thể:

| Mode | Resource output |
| ---- | --------------- |
| Campaign | Gold, Gems, Honor Points, Modules (type theo difficulty: Easy → Aircraft, Medium → Wingman, Hard → Device) |
| Daily Missions | Mission currency riêng → đổi trong shop của mode đó (Wrenches, Modules, Chips, Gold, Gems) |
| Events | Event currency riêng → exchange shop (skins, aircraft, Modules, Gems, gear) |
| PvP/Tournament | Medals → Medal Shop (Wrenches, materials) |
| Clan | Contribution Crates (Engine Batteries, materials) |

Difficulty cao hơn trả nhiều hơn: Medium ×1.4, Hard ×1.75 so với Easy. Map cuối mỗi chapter (boss map) trả Gems gấp 4× map thường.

### 4.2 Economy → Progression

Mỗi resource đẩy người chơi vào một đường upgrade khác:

| Resource | Đổ vào đâu |
| -------- | ---------- |
| Gold | Upgrade unit (ATK/HP) |
| Modules | Promote (lên star) |
| Wrenches | Gear upgrade + Engine upgrade (cạnh tranh cùng resource) |
| Engine Batteries | Engine upgrade (scarce, event-gated) |
| Chips | Gear Machine / gacha |
| Towels | Pilot gear upgrade |
| Gems | Tier merge, elite gear, gacha, revive |
| Beer | Mileage Shop (pity từ failed gacha spin hoặc disassemble gear) |

Điểm quan trọng: Wrenches bị chia giữa Gear và Engine. Gear cho nhiều power hơn per Wrench nên thường được ưu tiên trước. Engine là target late-game sau khi Gear đã max.

### 4.3 Progression → Combat + Routing

Power tăng → clear difficulty cao hơn → reward per run cao hơn → upgrade nhanh hơn → clear khó hơn nữa. Vòng này tự tăng tốc cho đến khi chạm upgrade wall.

Upgrade cost tăng mạnh tại mỗi tier transition:

| Transition | First upgrade cost | So với Tier 1 |
| ---------- | ------------------ | ------------- |
| Tier 1 | 100 Gold | — |
| Tier 2 | 12,350 Gold | ×123 |
| Tier 3 | 29,700 Gold | ×297 |
| Tier 4 | 229,464 Gold | ×2,295 |

Khi Gold income từ Campaign không đuổi kịp cost, người chơi bị đẩy sang:

- Farm Daily Missions (targeted resource qua shop).
- Chơi Event (highest-value source, exclusive rewards).
- Xem rewarded ads (Gold, Gems, materials).
- Mua IAP/VIP (tăng tốc).

### 4.4 LiveOps → Routing

Events tạo currency riêng, không tích trữ được qua event khác → phải chơi trong thời gian event. Exclusive rewards (skins, aircraft) ở milestone cao tạo FOMO. Daily hooks (Daily Gift 7-day cycle, Daily Missions reset 8h, Free Ad Crates) tạo checklist hàng ngày.

### 4.5 Monetization → Progression (compound advantage)

| Spending tier | Tác động |
| ------------- | -------- |
| F2P | Daily cap, ad-gated rewards, không stat bonus |
| Light spender | Bỏ interstitial ads + Battle Pass + low VIP |
| Heavy spender | VIP stat bonus + thêm daily attempts + premium resources. Mỗi advantage cộng dồn: stat cao hơn → clear khó hơn → reward tốt hơn → upgrade nhanh hơn |

VIP là spending ladder (lifetime, không reset). Mỗi $1 ≈ 10 VIP Points. VIP cao cho thêm damage, fuel, daily attempts, shop resets — tất cả compound lên nhau.

## 5. Game Flow / Player Journey

Phần này đi theo hành trình thực tế của người chơi qua các màn hình — từ dashboard vào trận, từ trận về upgrade, từ upgrade ra tìm resource.

### 5.1 Battle Flow

<img src="assets/game-flow/1-dashboard.png" alt="Dashboard: Quick Play ở giữa dưới, squadron grid, IAP offers bên trái, events bên phải" width="500">

Dashboard là hub trung tâm. Quick Play là nút nổi bật nhất — hướng người chơi vào trận đấu.

<img src="assets/game-flow/2-quick-play-pre-battle.png" alt="Pre-battle: chọn difficulty, preview reward, chọn aircraft, fuel cost" width="500">

Pre-battle: chọn difficulty, xem reward preview, chọn aircraft. Fuel cost hiển thị trước khi bấm Play.

<img src="assets/game-flow/3-in-battle.png" alt="In-battle: HP bar, timer, device skill, aircraft/wingman, bullet pattern" width="500">

In-battle: HP bar trên cùng, timer, device skill buttons. Auto-fire giữ màn hình gọn — người chơi tập trung né.

<img src="assets/game-flow/4-result.png" alt="Result screen: reward earned sau trận" width="500">

Result: hiển thị reward nhận được (Gold, Gems, Modules, stars).

<img src="assets/game-flow/5-rank-offer.png" alt="Rank Up Offer: popup star upgrade ngay sau trận" width="500">

Ngay sau result, popup Rank Up Offer xuất hiện — đề nghị upgrade star bằng Gems. Đây là monetization trigger gắn vào thời điểm người chơi vừa xong trận.

Quay về Dashboard. Một battle session từ bấm Quick Play đến quay về mất vài phút.

### 5.2 Progression Flow

<img src="assets/game-flow/6-dashboard-after.png" alt="Dashboard: mũi tên trỏ vào squadron grid để vào progression" width="500">

Từ Dashboard bấm vào squadron grid.

<img src="assets/game-flow/7-squadron-aircraft.png" alt="Squadron: chọn aircraft từ danh sách" width="500">

Chọn aircraft từ danh sách.

<img src="assets/game-flow/8-detail-aircraft.png" alt="Aircraft detail: stats, star, gear/engine slots" width="500">

Aircraft detail: xem stats, star level, gear slots, engine.

<img src="assets/game-flow/9-aircraft-custom-gear.png" alt="Aircraft Gear: 7 slots (4 offensive, 3 defensive), nhiều slot còn trống/locked" width="500">

Gear screen: 7 slots (4 offensive trên, 3 defensive dưới). Slots trống → cần gear.

<img src="assets/game-flow/10-gear-machine.png" alt="Gear Machine: slot machine gacha, 3 loại chip, spin để lấy gear" width="500">

Không có gear → vào Gear Machine (gacha). Dùng Chips để spin, nhận gear hoặc Beer (pity).

<img src="assets/game-flow/11-got-gear.png" alt="Nhận gear từ Gear Machine" width="500">

Nhận gear từ spin.

<img src="assets/game-flow/12-aircraft-use-gear-and-upgrade.png" alt="Equip gear vào aircraft và upgrade" width="500">

Equip gear vào aircraft.

<img src="assets/game-flow/13-aircraft-upgrade-gear.png" alt="Upgrade gear: dùng Wrenches để nâng star" width="500">

Upgrade gear bằng Wrenches.

<img src="assets/game-flow/14-used-gear.png" alt="Gear đã equip và upgrade xong" width="500">

Gear equipped và upgraded — power tăng, quay lại combat mạnh hơn.

### 5.3 Resource Routing Flow

Khi thiếu resource để upgrade, game dẫn người chơi tới source:

<img src="assets/game-flow/15-dashboard.png" alt="Dashboard: bấm Mission để tìm resource" width="500">

Từ Dashboard vào Mission.

<img src="assets/game-flow/16-mission-campaign.png" alt="Campaign mission select" width="500">

Chọn Campaign mission để farm.

<img src="assets/game-flow/17-check-protect-mission-store.png" alt="Protect Mission Store: mua Wrenches bằng mission currency" width="500">

Check Daily Mission Shop — mua Wrenches bằng mission currency. Targeted farming: người chơi chọn resource cần mua.

<img src="assets/game-flow/18-has-wrenches.png" alt="Đã có Wrenches" width="500">

Có Wrenches → quay về upgrade gear.

<img src="assets/game-flow/19-play-mission.png" alt="Chơi mission để farm" width="500">

Hoặc chơi mission trực tiếp để earn thêm.

<img src="assets/game-flow/20-dashboard-open-event.png" alt="Dashboard: mở Event để farm resource khác" width="500">

Ngoài Daily Mission, Event cũng là source — mở Event từ Dashboard.

<img src="assets/game-flow/21-exchange.png" alt="Event Exchange Shop: đổi event currency lấy reward" width="500">

Event Exchange Shop: đổi event currency lấy modules, gear, skins.

### 5.4 Monetization Flow

<img src="assets/game-flow/22-death.png" alt="Death: Emergency Repair popup — xem ad hoặc trả 10 Gems để revive" width="500">

Chết giữa trận → Emergency Repair: xem ad (No Ads left = hết lượt) hoặc trả 10 Gems.

<img src="assets/game-flow/23-want-to-pay.png" alt="Dashboard với IAP offers bên trái: Starter Pack, Event, Premium Pack, Supply Pack, Equipment, Sale Gift Pack, Growth Bundle" width="500">

Dashboard luôn hiển thị IAP offers bên trái: Starter Pack, Premium Pack, Supply Pack, Equipment, Growth Bundle. Popup offers cũng xuất hiện khi mở game hoặc xong trận.

<img src="assets/game-flow/24-paypack.png" alt="Pay pack detail" width="500">

Chi tiết một pack IAP.

### 5.5 Pilot Equipment

<img src="assets/game-flow/25-pilot-equipment.png" alt="Pilot Equipment: body gear slots cho pilot" width="500">

Pilot có hệ gear riêng biệt — body equipment (helmet, gloves, shoes, backpack...).

<img src="assets/game-flow/26-pilot-lucky-wheel.png" alt="Lucky Wheel: gacha vòng quay pilot gear, spin x1 hoặc x10" width="500">

Pilot gear lấy từ Lucky Wheel — gacha vòng quay, spin x1 hoặc x10. Cần Ticket để quay.

<img src="assets/game-flow/27-ticket.png" alt="Ticket: 125 Gems (x1) hoặc 1000 Gems (x10)" width="500">

Ticket mua bằng Gems: 125 Gems/ticket, hoặc 1000 Gems cho 10 tickets (giảm 20%).

<img src="assets/game-flow/28-pilot-gear-detail.png" alt="Pilot gear detail: stats và upgrade path" width="500">

Pilot gear cho multiplier stats (double/triple damage chance) không có ở hệ thống khác. Upgrade bằng Towels + Gems.

### Nhận xét

- Điểm mạnh: Quick Play → battle chỉ 2 tap. Session ngắn có closure rõ (result screen + reward).
- Điểm yếu: late-game dashboard có quá nhiều nút, badge, offer và system entry point. Popup offers xuất hiện liên tục gây clutter.
- Chưa cover: PvP, Clan, Sea Battlefield/Battleship — các flow late-game cần rank cao hơn để unlock.

## 6. Strengths & Weaknesses

### Strengths

**1. Simple input, strong accessibility**

Auto-fire và one-thumb movement làm game dễ vào. Người chơi mới có thể hiểu combat trong vài giây, nhưng vẫn có skill qua dodge, hitbox và boss pattern.

**2. Combat core được tái sử dụng tốt**

Campaign, daily, event, boss, PvP/competitive đều có thể dùng cùng nền combat. Game không cần tạo gameplay mới cho mỗi mode, chỉ cần đổi mục tiêu và reward wrapper.

**3. Nhiều investment surfaces**

Aircraft, Wingman, Device, Pilot, Gear, Engine, Certificate tạo ra nhiều nơi tiêu resource. Điều này giúp reward sau battle có ý nghĩa lâu dài.

**4. Retention nhiều tầng**

Game có short-term reward, mid-term daily/progression, long-term collection/tier/event. Nhiều tầng này giúp người chơi có lý do quay lại ở các mốc engagement khác nhau.

**5. Monetization bám vào desire state**

Revive, resource shortage, event FOMO, VIP speed-up, ad removal đều gắn với nhu cầu rõ của người chơi.

### Weaknesses / Risks

**1. Complexity overload**

Quá nhiều unit, gear, engine, currency, event và shop có thể làm người mới bị ngợp.

**2. Combat readability**

Bullet, explosion, pickup, player shot và boss VFX có thể làm mất rõ hitbox hoặc lethal threat.

**3. Paywall perception**

Nếu progression cost tăng nhanh hơn earn rate quá nhiều, người chơi dễ cảm thấy bị ép mua thay vì được thử thách.

**4. Currency confusion**

Nhiều resource có vai trò gần nhau nhưng source/sink khác nhau. Nếu UI không chỉ rõ kiếm ở đâu, người chơi sẽ lạc.

**5. Stat cosmetics / VIP advantage**

Cosmetic có stat bonus và VIP cộng dồn power có thể làm competitive fairness yếu đi.

## 7. Transferable Lessons

**Lesson 1: Core action đơn giản, meta sâu**

Combat 1945 Air Force chỉ cần 1 ngón kéo + auto-fire. Người chơi hiểu game trong vài giây. Phần giữ chân nằm ở meta: upgrade, gear, tier, collection, event. Core đơn giản = barrier thấp. Meta sâu = lý do ở lại.

**Lesson 2: Unit = investment surface**

Mỗi loại unit (Aircraft, Wingman, Device, Pilot) là một nơi đổ resource riêng. Thêm unit type = thêm mục tiêu upgrade, thêm lý do farm, thêm điểm monetization. 1945 Air Force có 5 loại unit × nhiều trục nâng cấp = người chơi gần như không bao giờ hết việc.

**Lesson 3: Mỗi resource route một hành vi**

Gold → upgrade. Modules → promote. Wrenches → gear. Chips → gacha. Beer → pity shop. Towels → pilot gear. Mỗi resource thiếu = một đường đi khác nhau (campaign, daily, event, shop). Thiết kế resource là thiết kế hành vi người chơi.

**Lesson 4: Tái sử dụng combat core cho LiveOps**

Campaign, daily mission, event, tournament, PvP đều dùng cùng nền combat — đổi reward wrapper, timer và mục tiêu. Không cần gameplay mới cho mỗi mode. Chi phí sản xuất content thấp, output cao.

**Lesson 5: Monetization gắn vào thời điểm người chơi muốn**

Chết → revive offer. Thiếu resource → pack/gacha. Xong trận → rank up offer. Event sắp hết → FOMO push. Offer hiệu quả khi nó giải quyết nhu cầu đang có, không phải khi nó được đẩy random.

**Lesson 6: Mở complexity theo nhịp**

1945 Air Force gate system sau Career Rank: Wingman mở mission 2, Device mission 8, PvP Airman 2, Clan/Battleship rank cao hơn. Mỗi system có thời gian để người chơi học trước khi system tiếp xuất hiện. Mở hết cùng lúc = dashboard noise.

**Lesson 7: Pity system giảm frustration gacha**

Gear Machine cho Beer khi spin không trúng → đổi gear cụ thể trong Mileage Shop. Event có milestone reward → chơi đủ sẽ nhận thưởng dù RNG xấu. Gacha không có floor thì người chơi cảm thấy bị lừa.

**Lesson 8: Session ngắn, closure rõ**

Một trận kéo dài vài phút. Kết thúc luôn có result screen + reward. Người chơi thấy tiến triển dù chỉ chơi 5 phút. Phù hợp mobile: mở lên, chơi, nhận thưởng, tắt.

## 8. Appendix / Evidence Plan

Folder `1945-air-force-deconstruction` được dùng làm reference/evidence bank. Khi biến bản này thành portfolio hoàn chỉnh, cần gắn mỗi insight với screenshot, bảng số liệu hoặc observation cụ thể.

Evidence nên bổ sung:

| Cần chứng minh                | Evidence nên có                                           |
| ----------------------------- | --------------------------------------------------------- |
| Battle core dễ vào            | Screenshot/video early battle, control, HUD               |
| Readability risk              | Screenshot late/busy battle hoặc boss                     |
| Loadout là investment surface | Aircraft/Wingman/Device screen, gear/engine/certificate   |
| Progression wall              | Bảng cost vs reward, upgrade/promote requirement          |
| Economy routing               | Screenshot missing resource/source/shop                   |
| Retention loop                | Daily gift, daily mission, event shop, timer              |
| Monetization trigger          | Revive prompt, shop, VIP, free ad crate, battle pass      |
| Game flow                     | Flowchart dashboard -> battle -> result -> upgrade/source |

Bảng/phụ lục nên có:

- Core loop diagram.
- System connection map.
- Currency source/sink table.
- Upgrade cost sample.
- IAP/ad placement table.
- Daily/event task table.
- Strength/weakness evidence table.

Mục tiêu là mỗi kết luận trong deconstruction đều có evidence đi kèm, không nhận định suông.
