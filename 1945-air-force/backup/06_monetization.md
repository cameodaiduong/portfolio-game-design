# 6. Monetization

Hybrid model — combines IAP + Rewarded Ads to monetize both paying and F2P players.

## 6.1 Ad System

| Ad type | When | Player choice | Purpose |
|---------|------|---------------|---------|
| Rewarded video | After battle (double rewards), after death (revive), daily free gems, open free crates | Opt-in | Convert desire state into ad view |
| Interstitial (pop-up) | After completing a Campaign map | Forced, skippable after delay | Baseline ad revenue, annoying by design |

**Interstitial removal**: Any real-money purchase (even $0.99) reduces or removes pop-up ads. This makes the first purchase feel like a QoL upgrade, not just a power boost — lowering the paywall entry barrier.

**Rewarded ads remain for all players** including VIP — opt-in and tied to specific rewards. VIP does not auto-claim rewarded ad bonuses.

**Revive**: On death, player gets 2 options — spend Gems or watch ad (max 5 ads/day). This is the highest-conversion ad placement: player is emotionally invested in the run and wants to continue.

<img src="assets/monetization/free.png" alt="Free tab — 3 crate tiers, each 3 ad views, rewards: gold up to 3000, gems/wrenches/modules up to 15, bonus chest at 80 ads" width="500">

**Free tab** in shop offers 3 crate tiers (green/blue/gold), each watchable 3/3 times per reset. Rewards: Gold (up to 3,000), Gems (up to 15), Wrenches (up to 15), Modules (up to 15). Bonus chest unlocks after 80 total ad views — long-term ad engagement incentive. Tabs also include Money, Container, and Module shops.

## 6.2 IAP & Gacha

| IAP type | Target | Price | Content |
|----------|--------|-------|---------|
| Battle Pass — Premium | Active player | $14.98 | Season rewards track |
| Battle Pass — Premium Plus | Active player | $19.98 | Enhanced season rewards |
| Battle Pass — Ultra | Heavy spender | $39.98 | Top-tier season rewards |
| Battle Pass — Ultra Plus | Heavy spender | $49.98 | Maximum season rewards |
| Gem Packs | Any spender | $0.99–$99.99 | Pure hard currency |
| Limited Offers | Active player | Varies | Event-tied, time-pressured (FOMO) |

### Gacha

Gear Machine (see 04, 4.1) is the primary gacha — Chips → spin → gear or Beer (pity). Gacha bridges monetization and progression: spending money gets gear that feeds directly into the upgrade system. Beer pity currency ensures even bad pulls have value.

## 6.3 VIP

**Cumulative lifetime spending** — not subscription. Every $1 spent ≈ 10 VIP Points. VIP level is permanent, never resets. Scales up to VIP 50 (5,000,000+ points).

<img src="assets/monetization/vip.png" alt="VIP 50 Privilege — All Damage and Fuel +50%, Daily Gift bonuses, +1 free play per daily mode, Shop Reset Module +5, Equipment Backup Slot" width="500">

Privileges are cumulative — higher VIP adds more bonuses on top. Includes: permanent damage + fuel increase, bonus daily gold, extra daily mission attempts, shop resets, equipment backup slots, and more.

VIP is a **spending ladder** — rewards past spending with permanent power. Extra daily mission attempts increase resource income, compounding advantage over F2P.

## 6.4 Choke Points & Fairness

Monetization attaches to natural desire states:

| Player state | Monetization trigger |
|-------------|---------------------|
| Died mid-run | Revive (ad or gems) |
| Hit upgrade wall | Resource pack / daily grind / ads |
| Want specific aircraft | Direct purchase / event grind / gacha |
| Annoyed by pop-up ads | First IAP removes them |
| Want faster daily progress | VIP (more attempts) / Battle Pass |
| Missing event rewards | Limited offer / harder grind (FOMO) |

### Progression Speed by Spending Tier

The game controls progression speed through layered resource gates. Spending doesn't unlock different content — it accelerates how fast players move through the same content.

| Tier | How it affects progression |
|------|--------------------------|
| **F2P** | Limited daily attempts, ad-gated rewards, no stat bonus. Slowest path — constrained by daily caps and resource income |
| **Light spender** | Removes UX friction (no pop-up ads) + small stat/resource boost from low VIP and Battle Pass |
| **Heavy spender** | VIP stat bonuses + extra daily attempts + premium resources. Each advantage compounds: stronger stats → clear harder difficulty sooner → higher rewards per run → faster upgrades |

**Key design insight**: Spending compounds — each advantage feeds into the next, widening the gap over time. But the game avoids hard paywalls (no content locked behind purchase), relying on **speed walls** — pay to progress faster, not to progress at all.
