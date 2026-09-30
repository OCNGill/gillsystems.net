AI-ERA V2 MOCKUP — EVIDENCE PACK FOR EBERT
===========================================

FILE: C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\ai-era-v2.html
LAN URL: https://gillsystems.net/ai-era-v2.html (served by Caddy from working tree)

STATIC GATES (all passed):
- node --check: PASS (JS syntax clean, 1 inline script block, no external CDN)
- Symbol resolution: 26 defined, 26 referenced, 0 missing, 0 unused
- Crew roster: 20 agents (canonical AGENT.md count), 0 duplicates
- Emoji purge: 0 emoji found in source
- Leak scan: 0 internal paths / private IPs / .hermes / AppData references
- External deps: only styles.css + era-pages.css (local)
- Stat counts: "20" agents, "4" nodes, "192K" context, "0" cloud bills — all match verified reality

ICON SET (26 hand-authored single-stroke SVG symbols, marine/instrument/hardware motif):
  ic-helm                → Hermes (Commander)            [ship's wheel]
  ic-lectern             → Theo (Theologian)              [open book/lectern]
  ic-drafting-compass    → Adam (Agent Architect)         [dividers]
  ic-blueprint           → Architect (Sys Architecture)   [blueprint sheet]
  ic-chevrons            → Coder (Meta-Engineer)          [angle brackets]
  ic-device              → Geordi (Android)               [mobile + signal arcs]
  ic-magnifier           → Liara (Research)               [loupe over chart line]
  ic-flow-lanes          → Orchestrator (Coordination)    [sequenced work lanes + nodes]
  ic-shield-keyhole      → Sentinel (Security)            [shield + keyhole]
  ic-radar               → EDI (Network Oversight)        [radar dish + sweep]
  ic-likert              → Ebert (Critic)                 [7-tick scale + pointer]
  ic-stethoscope         → Medic (Debug)                  [stethoscope]
  ic-flask               → Sandbox (QA)                   [Erlenmeyer flask]
  ic-quill               → Scribe (Docs)                  [quill pen]
  ic-handheld            → Major Gaben (SteamOS)          [gamepad/handheld]
  ic-bugle               → Herald (Income)                [maritime horn]
  ic-envelope            → Courier (Fast-Light Transfer)  [dispatch envelope]
  ic-lighthouse          → Lamp (Monitoring)              [lighthouse + beam]
  ic-spyglass            → Scout (Search)                 [telescope]
  ic-caliper             → Spark (Quick Edits)            [vernier caliper]
  ic-laptop              → Node: Laptop (gateway/ops)     [laptop chassis]
  ic-tower               → Node: Main (brain)             [full-tower case]
  ic-stb                 → Node: HTPC (media)             [set-top box]
  ic-deck                → Node: Steam Deck               [handheld with sticks]
  ic-stack               → Section: Sovereign Stack       [layered plates]
  ic-helm-section        → Section: The Fleet            [anchor/helm]
  ic-chip-device         → Chip: Private Android App
  ic-chip-clock          → Chip: Cron
  ic-chip-ledger         → Chip: Documentation
  ic-chip-nets           → Chip: 4 Nodes

CREW ORDER (Command → Super → Specialist → Fast-Light):
1. Hermes     — Commander — reports to Stephen Gill
2. Theo       — Super     — Theologian / Apologist
3. Adam       — Regular   — Agent Design Master
4. Architect  — Super     — System Architecture
5. Coder      — Super     — Primary Coding / Meta-Engineer
6. Geordi     — Super     — Android Development
7. Liara      — Super     — Research & Intelligence
8. Orchestrator — Super   — Workflow Coordination
9. Sentinel   — Regular   — Fleet Security
10. EDI       — Regular   — Network & Inference Oversight
11. Ebert     — Regular   — Zero Trust Critic
12. Medic     — Regular   — Debug & Incident Response
13. Sandbox   — Regular   — Android QA & Testing
14. Scribe    — Regular   — Documentation / 7D Phase
15. Major Gaben — Regular — SteamOS & Steam Deck
16. Herald    — Regular   — Income Generation / Recruiting
17. Courier   — Fast-Light — File Transfer
18. Lamp      — Fast-Light — Monitoring
19. Scout     — Fast-Light — Web Search
20. Spark     — Fast-Light — Quick Edits

INTERACTION MODEL:
- Agent rail: 20 `<button role="tab">` cards in a CSS grid (responsive: 4/3/2/1 columns)
- Detail panel: sticky right (desktop) / below rail (mobile), `role="tabpanel"`
- Hover/focus → preview synopsis; Click/Space/Enter → pin (aria-selected=true)
- Filter chips: All / Command / Super / Specialist / Fast-Light (radio buttons, keyboard nav)
- Keyboard: Arrow Left/Right moves between tabs; Home/End; Escape unpins
- Focus ring: 3px var(--accent) offset 2px on every interactive element
- Reduced-motion respected: transitions disabled
- 2-3 sentence full synopsis per agent (from canonical AGENT.md summaries)

ANIMATION SECTION HONESTY:
- Embeds fleet_animation_v6.html (Conceptual Mesh Visualization)
- Caption explicitly notes: "thread and seat counts shown inside the mesh reflect that build's snapshot; the canonical roster is the 20 agents listed above"
- No contradiction created between iframe (19 threads) and page (20 agents)

RUBRIC REFERENCE:
- Weights: Visual Craft 25, Truthfulness 20, Clarity 20, Technical 15, Interaction 10, Brand Fit 5, First Impression 5
- Minimum weighted total: 6.2
- Any axis at 1.0 = auto ITERATE
- Categorical emoji = Brand Fit penalty; AI cliché icons = Brand Fit penalty; internal leaks = Truthfulness penalty

TASK FOR EBERT:
Score this page against zero_trust_likert_rubric.md. Return:
  {scores:{visual_craft, truthfulness, clarity, technical, interaction, brand_fit, first_impression: 1-7 each},
   weighted_total: 0.0-7.0, verdict: "PASS"|"FAIL"|"ITERATE",
   axis_notes: {axis: "specific justification"},
   specific_deltas: ["actionable fix 1", "actionable fix 2", ...]}
Be exacting. No generosity.