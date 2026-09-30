# AI Robots Page v2 — Build Changelog

**Artifact:** `ai-era-v2.html` (1,620 lines, 78,366 bytes, self-contained)
**Live:** https://gillsystems.net/ai-era-v2.html
**Commit:** `edc2ff5` — *Ship v7 showreel, purge superseded v2/v6, add AI Robots v2 page* (2026-09-30 00:31 EDT)
**Repo state:** committed; **PUSH HELD** for Commander review (Standing Order 2)
**Author of record:** Scribe (Document phase, 7D-5)
**Related evidence:** `plans/ebert_evidence_pack.md`

> This file is a new record. No existing file was modified in producing it.

---

## Counts

| Metric | Value |
|---|---|
| Agents on the roster | 20 (canonical `AGENT.md` count) |
| Hand-authored SVG symbols defined | 26 |
| SVG symbols referenced | 26 |
| Missing / unused symbols | 0 / 0 |
| Emoji glyphs in source | 0 |
| Filter tiers | 5 (All, Command, Super, Specialist, Fast-Light) |
| External dependencies | `styles.css`, `era-pages.css` (both local) |
| Ebert weighted score | **6.7 / 7.0 — PASS** (gate: 6.2) |
| Animation embed | `animations/Gillsystems_Commander_Hermes_Animation_v7.html` |

---

## What Was Built

The AI Robots page v2 replaces the old v1 agent grid with a two-column page: a
**crew rail** of 20 agent cards on the left, and a sticky **detail panel** on the
right that renders the selected agent's full synopsis, role, reporting line, and
capability chips.

### Roster (20 agents, in render order)

The array is a single source of truth in-page: `CREW` in the page's one inline
script block drives both the rail and every count-bearing string. A count that
disagrees with `CREW` is a bug, not a copy decision.

| # | Agent | Class | Icon | Notes |
|---|---|---|---|---|
| 1 | Hermes | Command | `ic-helm` | Fleet Operational Commander; reports to Commander Stephen Gill |
| 2 | Theo | Super | `ic-book` | Theologian / Apologist |
| 3 | Adam | Specialist | `ic-dividers` | Agent Design Master |
| 4 | Architect | Super | `ic-blueprint` | System Architecture |
| 5 | Coder | Super | `ic-chevrons` | Primary Coding / Meta-Engineer |
| 6 | Geordi | Super | `ic-device` | Android Development |
| 7 | Liara | Super | `ic-magnifier` | Research & Intelligence |
| 8 | Orchestrator | Super | `ic-lanes` | Workflow Coordination |
| 9 | Sentinel | Specialist | `ic-shield` | Fleet Security |
| 10 | EDI | Specialist | `ic-radar` | Network & Inference Oversight |
| 11 | Ebert | Specialist | `ic-likert` | Zero Trust Critic |
| 12 | Medic | Specialist | `ic-stethoscope` | Debug & Incident Response |
| 13 | Sandbox | Specialist | `ic-flask` | Android QA & Testing |
| 14 | Scribe | Specialist | `ic-quill` | Documentation / 7D |
| 15 | Major Gaben | Specialist | `ic-handheld` | SteamOS & Steam Deck |
| 16 | Herald | Specialist | `ic-bugle` | Income Generation / Recruiting |
| 17 | Courier | Fast-Light | `ic-envelope` | File Transfer |
| 18 | Lamp | Fast-Light | `ic-lighthouse` | Monitoring |
| 19 | Scout | Fast-Light | `ic-spyglass` | Web Search |
| 20 | Spark | Fast-Light | `ic-caliper` | Quick Edits |

**Class distribution:** 1 Command · 6 Super · 9 Specialist · 4 Fast-Light = 20.
This matches the roster count corrected in `Agents/ROSTER.md` on 2026-09-29
(17 → 20, canonical `AGENT.md` count).

### Icon Set — 26 single-stroke SVG symbols, zero emoji

Every glyph is hand-authored inline `<symbol>` drawn on a shared 24×24 grid with
a single stroke weight and `stroke-linecap`/`stroke-linejoin` rounding. The
motif is marine, instrument, and hardware — chosen so nothing on the page reads
as generic AI stock. The source contains **zero emoji codepoints**; the
categorical-emoji penalty in the rubric does not apply.

- **20 crew icons** — one per agent (`ic-helm` … `ic-caliper`, listed above)
- **4 node icons** — `ic-laptop` (Laptop, gateway/ops), `ic-tower` (Main, the
  brain), `ic-stb` (HTPC, media), plus the Steam Deck's handheld
- **2 section icons** — `ic-stack` (Sovereign Stack), `ic-nets` (4 nodes)
- **1 chip icon** — `ic-clock` (cron)

> **Known documentation drift (recorded, not corrected here).** The evidence
> pack shipped with the build lists the earlier working names for eleven of
> these symbols (`ic-lectern`, `ic-drafting-compass`, `ic-flow-lanes`,
> `ic-shield-keyhole`, `ic-deck`, `ic-chip-device`, `ic-chip-ledger`) and does
> not list `ic-nets` or `ic-clock`. The shipped page's 26/26 resolve clean
> against the names in the table above; the evidence pack's naming is stale.
> The evidence pack also still names `fleet_animation_v6.html` as the embed
> target, which was correct when written and superseded in the same commit.

### Full synopsis on hover and click

Each `CREW` entry carries a 2–3 sentence `synopsis` drawn from that agent's
canonical `AGENT.md` summary, plus `role`, `reports`, `classLabel`, and
capability chips. Hover or focus **previews** the synopsis in the detail panel;
click pins the selection (`aria-selected="true"`) so the reader can move the
pointer away and keep reading. Nothing is truncated to a teaser.

### Accessibility

| Requirement | Implementation |
|---|---|
| Agent rail | 20 `<button role="tab">` in a CSS grid — 4 / 3 / 2 / 1 columns responsive |
| Detail panel | `role="tabpanel"`, sticky right on desktop, below rail on mobile |
| Roving tabindex | 12 `tabindex` assignments; only the active tab and the active filter are `0` |
| Filter control | `role="radiogroup"` with five `role="radio"` buttons, `aria-checked` maintained |
| Filter labels | `title` on each tier explains what the tier means |
| Keyboard | Arrow Left/Right move between tabs · Home/End jump to ends · Escape unpins |
| Focus ring | 3px accent ring at 2px offset on every interactive element |
| Motion | `prefers-reduced-motion` disables transitions |
| Decorative art | `aria-hidden="true"` on icon `<use>` references |

**Interaction gotcha worth remembering:** Arrow keys and Home/End are bound for
the tablist, but Space and Enter are **not** intercepted by script — activation
falls through to native `<button>` behaviour. A scripted handler for those keys
would have double-fired.

### Truthfulness

- Stat row reads **4 Nodes · 20 Named Agents · 192K Max Context · 0 Cloud
  Bills**, each matched to verified reality at build time.
- The v7 animation is embedded, and the caption beneath it states plainly that
  the mesh's internal thread and seat figures are that build's snapshot while
  **The Crew roster above is the canonical list of 20 named agents**. The page
  therefore does not silently contradict the numbers rendered inside its own
  iframe.

---

## Static Gate Results — All Pass

| Gate | Result |
|---|---|
| `node --check` | **PASS** — one inline script block, JS syntax clean, no external CDN |
| Symbol resolution | **PASS** — 26 defined, 26 referenced, 0 missing, 0 unused |
| Crew roster integrity | **PASS** — 20 agents, 0 duplicate ids, 0 duplicate names |
| Emoji purge | **PASS** — 0 emoji codepoints in source |
| Leak scan | **PASS** — 0 internal paths, 0 private IPs, 0 `.hermes` / `AppData` references |
| External dependencies | **PASS** — `styles.css` + `era-pages.css` only, both local |
| Stat truthfulness | **PASS** — "20 agents", "4 nodes", "192K context", "0 cloud bills" all match reality |
| Ebert Likert gate | **PASS** — 6.7 / 7.0 against a 6.2 minimum |

---

## Ebert Score and Deltas Applied

**Weighted total: 6.7 / 7.0 — PASS.** No axis scored 1.0, so no auto-ITERATE was
triggered. Rubric weights: Visual Craft 25 · Truthfulness 20 · Clarity 20 ·
Technical 15 · Interaction 10 · Brand Fit 5 · First Impression 5. Full rubric at
`Agents/Ebert/designs/zero_trust_likert_rubric.md`; scoring evidence handed to
Ebert at `plans/ebert_evidence_pack.md`.

Deltas returned by Ebert and carried into the shipped build:

| Delta | Disposition |
|---|---|
| Zero-emoji rule — strip all categorical emoji, replace with drawn SVG | **Applied** — 26 hand-authored single-stroke symbols replace every glyph |
| Count truthfulness — no page stat may disagree with the roster | **Applied** — `CREW` array is the single source of truth for rail *and* counts |
| Internal leak risk in a public-facing artifact | **Applied** — leak scan clean; local stylesheets only |
| Honest caption where an embedded visualization carries its own numbers | **Applied** — the "About the counts" note shipped with the v7 embed |
| Keyboard reachability of the agent rail | **Applied** — full tablist with roving tabindex, arrows, Home/End, Escape |
| Animate/crash-prone embed left as a dead 404 | **Resolved in the same commit** — v6 and v2 purged, both page embeds repointed to v7 |

---

## Related Work in the Same Window

Commit `edc2ff5` shipped three things as one unit under Commander Stephen
Gill's 2026-09-29 directive that only the most recent version is kept:

- **Added** `animations/Gillsystems_Commander_Hermes_Animation_v7.html` (390KB,
  self-contained 2D-canvas showreel, zero external deps, zero leaks)
- **Removed** `animations/fleet_animation_v2.html` (superseded, 20 Sep) and
  `animations/fleet_animation_v6.html` (superseded by v7)
- **Repointed** `ai-era.html` and `ai-era-v2.html` iframes from the deleted v6
  to v7 — v6 was purged first, which had left a 404 until the embeds were fixed
  in the same commit

Fleet-side consequences of the same directive (Herald registration, Ebert
publish, ROSTER 17 → 20) are recorded in
`Agents/Scribe/reports/2026-09-29-standup-orders-execution.md`.

---

## Verification Outstanding

- **Push is HELD.** Commit `edc2ff5` is local-only pending Commander review of
  the local file. Live URL above will not serve v2 until that hold is released.
- Ebert's per-axis scores and narrative `axis_notes` were returned in-session
  and are not persisted to `Ebert/memory/`; the weighted total and the delta
  list are the durable record. Recommend persisting the full scorecard on
  first next review.

---

## Verse

> *"Commit your work to the LORD, and your efforts will be established."*
> — **Proverbs 16:3 (ESV)**

**Rationale:** one sentence — this build is the discipline of making the work
count in the record before it can count for anything, which is exactly what the
v2 page and its changelog are for.

---

— Scribe, Keeper of the Fleet Record. *No version without documentation.*
