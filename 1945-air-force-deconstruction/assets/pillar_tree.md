1945_AirForce_Game_Deconstruction
├── 00_PRODUCT_CONTEXT
│   ├── 0.1_game_summary # 1945 là game gì, fantasy chính, cảm giác chơi cốt lõi
│   ├── 0.2_market_context # Genre, platform, audience, business model, số liệu nổi bật
│   └── 0.3_design_thesis # Vì sao game sống lâu: simple core + deep meta + liveops/F2P

├── 01_CORE_LOOP
│   ├── 1.1_core_loop # Play stage → earn reward → upgrade → harder content
│   ├── 1.2_session_flow # Vào game → chơi 1-3 trận → claim reward → upgrade → dừng hoặc tiếp
│   ├── 1.3_game_modes # Campaign, Daily Missions, Boss Fight, Co-op, Clan, Events
│   └── 1.4_pvp_competitive # Eliminate, Last Stand: matchmaking, ranking, reward structure

├── 02_CORE_MECHANICS
│   ├── 2.1_controls_combat_feel # Drag movement, auto-fire, dodge, hitbox, collision feel
│   ├── 2.2_damage_hp_model # Damage calc, HP system, win/loss state, death feel
│   ├── 2.3_bullet_patterns # Kiểu đạn player/enemy, pattern cơ bản, density scaling
│   └── 2.4_powerups_pickups # Shield, magnet, nuclear, damage boost: spawn, duration, rhythm

├── 03_CONTENT
│   ├── 3.1_aircraft # Main unit: role, weapon pattern, stats, feel khác biệt
│   ├── 3.2_wingman # Support fire: coverage, damage pattern, bổ sung aircraft
│   ├── 3.3_device # Utility/burst: passive/active effect, cooldown, support role
│   ├── 3.4_unit_relationship # Aircraft + Wingman + Device tạo build/loadout ra sao
│   ├── 3.5_enemy_roles # Grunt/elite/special/boss và vai trò áp lực trong level
│   ├── 3.6_wave_stage_pacing # Wave structure, nhịp căng-nghỉ, pre-boss, boss climax
│   ├── 3.7_boss_design # Pattern, phase, telegraph, safe space, learning curve
│   └── 3.8_cosmetics # Skins, trails, effects: cosmetic-only hay có stat? Nguồn unlock

├── 04_PROGRESSION
│   ├── 4.1_upgrade_system # Level, star, evolution: loại nâng cấp, resource cần, power curve
│   ├── 4.2_player_growth # Account rank, unlock features, gate/chặn progression
│   └── 4.3_difficulty_scaling # Độ khó tăng thế nào, relationship với power growth

├── 05_ECONOMY
│   ├── 5.1_currencies # Gold (soft), gems (hard), modules, fuel/dog tags
│   ├── 5.2_sources_sinks # Nguồn kiếm (battle/quest/ad/login) → nơi tiêu (upgrade/gacha/unlock)
│   └── 5.3_earn_spend_pacing # Nhịp kiếm-tiêu, bottleneck tự nhiên, grind feel

├── 06_MONETIZATION
│   ├── 6.1_ad_system # Rewarded ads, interstitial, banner: khi nào hiện, UX friction
│   ├── 6.2_iap_gacha # IAP packs, gacha/containers, starter offer, whale packs
│   ├── 6.3_vip_webshop # VIP ladder, webshop, long-term spender retention
│   └── 6.4_choke_points_fairness # Điểm nghẽn grind/paywall, F2P fair hay bị ép

├── 07_RETENTION_LIVEOPS
│   ├── 7.1_daily_weekly_hooks # Daily missions, login rewards, streak, weekly events
│   ├── 7.2_event_system # Event rotation, limited-time content, FOMO mechanics
│   ├── 7.3_clan_social # Clan system, Squadron Challenges, United We Stand co-op
│   ├── 7.4_notifications_reengagement # Push notifications, comeback gifts, winback flow
│   └── 7.5_long_term_goals # Collection completion, rare unlocks, endgame meta targets

├── 08_UX
│   ├── 8.1_dashboard_flow # Home/dashboard, squadron panel, shop, upgrade entry points
│   ├── 8.2_battle_result_flow # Home → Play → Battle → Result → Upgrade → Next
│   ├── 8.3_in_match_readability # HUD, bullet clarity, effect clutter, death fairness
│   ├── 8.4_game_feel_feedback # Audio cues, hit/kill effects, screen shake, juice
│   └── 8.5_onboarding # FTUE, system unlock pacing, tutorial vs overwhelm

└── 09_SYNTHESIS
    ├── 9.1_key_strengths # 3-5 insight mạnh nhất về loop, mechanics, economy, retention
    ├── 9.2_key_weaknesses # 3-5 vấn đề: readability, complexity, paywall, UX debt
    ├── 9.3_improvement_proposals # Observation → Problem → Proposal → Risk
    └── 9.4_cv_bullets # 3-5 bullet ngắn đưa vào CV/portfolio
