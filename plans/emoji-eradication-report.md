# Site-Wide Emoji Eradication — gillsystems.net

**Date:** 2026-09-30
**Commit:** `752cb3a` — "Site-wide emoji eradication: 152 emoji replaced with real vendor marks" (pushed to `origin/main`, local and remote both at `752cb3adb769037a6496d388efa16dd825315f1a`)
**Author of commit:** Stephen Gill
**Bible verse:** Luke 4:18 (ESV) — *"to bring good news to the poor…to set the oppressed free"* — the site's message is only credible if the presentation matches the substance. Commander asks **Theo** to select the next verse.

---

## 1. Directive

Commander Stephen Gill, 2026-09-30:

> "WE NEED ALL EMOJI BULLSHIT AI ICONS READICATED IMMEDIATELY"
>
> "EMOJIS SAYS VIBE CODING PUSSY, NOT SYSTEMS ARCHITECT"

Emoji used as interface icons were judged incompatible with a systems-architecture brand. Every emoji was replaced with a real vendor or role mark.

## 2. The sprite

A **46-symbol SVG sprite** was built at:

```
gillsystems.net\plans\icons\gillsystems-icons-v8.html
```

Verified: `grep -c '<symbol'` returns **46**.

The sprite is injected inline before `</head>` on each page (~38 KB) so marks render with no network request and no external dependency. A plain-text extract lives alongside it at `plans\icons\_sprite.txt`.

### Symbol inventory (46, verified by id extraction)

**Platform / vendor marks (26):** `am-amd`, `am-ryzen`, `am-radeon`, `am-rocm`, `am-llama`, `am-vulkan`, `am-windows`, `am-linux`, `am-ubuntu`, `am-steamos`, `am-deck`, `am-zfs`, `am-android`, `am-frp`, `am-caddy`, `am-gchat`, `am-oci`, `am-nvme`, `am-cron`, `am-mesh`, `am-rocket`, `am-diamond`, `am-cloud`, `am-monitor`, `am-desktop`, `am-gear`

**Role / concept marks (20):** `am-shield`, `am-radar`, `am-search`, `am-code`, `am-blueprint`, `am-docs`, `am-debug`, `am-qa`, `am-herald`, `am-courier`, `am-helm`, `am-book`, `am-dividers`, `am-orch`, `am-phone`, `am-likert`, `am-lantern`, `am-compass`, `am-spark`, `am-lock`

Usage is a `<use href="#am-…"/>` reference inside a `.gs-ic` span.

## 3. The eradication script

```
gillsystems.net\plans\eradicate_emoji.py
```

166 lines, committed in `752cb3a`. Design points:

- **Explicit `MAP` of 60+ emoji codepoint → vendor mark.** Every entry is keyed by codepoint with a comment naming the emoji and the reasoning for the target mark. Longest-sequence-first ordering so multi-codepoint emoji match correctly.
- **Emoji were mapped to real vendor logos**, not to decorative substitutes — e.g. `💻` (laptop) → `am-desktop`; `🎮` (gamepad) → `am-steamos`; `📧` (email) → `am-gchat`; `⚡` (high voltage) → `am-radeon`; `✅` (check) → `am-qa`; `🎯` (target) → `am-likert`; `🗽` (scroll) → `am-docs`.
- **Arrows and plain typography were deliberately preserved.** U+2190/U+2192 and ordinary typographic glyphs are punctuation in prose, not icons. This exclusion is the main reason raw codepoint counts differ between tools — see §5.
- **Idempotent** — safe to re-run; a page already containing `<symbol` is skipped.
- Excludes `ai-era.html` from automated processing (it was hand-corrected in the same cycle).

## 4. Per-page counts

Counts below are **my own independent recount from the `752cb3a` diff**, counting emoji in removed lines, with variation selector U+FE0F excluded (matching the script's consumption of VS16 inside a match). The "after" column is emoji in added lines — **0 everywhere**.

| Page | Before | After | Distinct marks used |
|---|---:|---:|---:|
| `solutions.html` | 43 | 0 | 35 |
| `index.html` | 24 | 0 | 19 |
| `Deadwood_alien_shooter.html` | 22 | 0 | 11 |
| `open-source.html` | 18 | 0 | 18 |
| `ai-era.html` | 10 | 0 | 11 |
| `build-vs-buy.html` | 7 | 0 | 8 |
| `foundation-era.html` | 7 | 0 | 8 |
| `knowledge-liberation.html` | 7 | 0 | 8 |
| `radical-transparency.html` | 7 | 0 | 8 |
| `user-empowerment.html` | 7 | 0 | 8 |
| `dark-ages.html` | 2 | 0 | 2 |
| **Total (11 pages)** | **154** | **0** | — |

Plus `ai-era-v2.html` **deleted** (1,620 lines removed) and `plans/eradicate_emoji.py` added.

Commit `752cb3a` touched 13 files: 11 pages rewritten, 1 page deleted, 1 script added. `git show --stat`: **13 files changed, 6,971 insertions, 1,781 deletions**.

### Reconciliation of the "152" figure

The commit message and task brief say **152**; my recount says **154**. The gap is a counting-method difference, not a missing replacement — the two figures differ by which variation-selector and combining characters are attributed to which emoji. I could not reproduce 152 exactly from the diff and am not able to state which count is "the" number without access to the original run's stdout. **All 11 pages are at zero emoji** — which is the fact that matters, and it is verified. The 152 vs 154 discrepancy is noted rather than papered over.

## 5. Deleted artifact: `ai-era-v2.html`

The AI Robots v2 mockup **scored 6.7 on Ebert's rubric** while Commander rated it a **5** and said the icons were **"weaker than weak."** It has been **deleted as a superseded rejected mockup**; confirmed absent from the working tree (`ls: cannot access 'ai-era-v2.html'`). It is superseded by `plans\ai-era-v3-mockup.html` (71,606 bytes, carries the 46-symbol sprite).

Note: the rubric scores and the Commander's rating disagreed by 1.7 points. The Commander's rating governed.

## 6. Other corrections in the same commit

- `ai-era.html` stale **"18-agent"** claim corrected to **"20-agent"** (verified: 2 occurrences of `20-agent`, 0 of `18-agent`).
- `ai-era.html` node cards now carry their real OS mark (Windows / Radeon / Ubuntu / SteamOS).

## 7. Verification — and a live defect

### Verified clean

| Check | Result |
|---|---|
| `node --check` on v8 animation JS (extracted, 60,365 bytes) | **CLEAN** |
| `https://gillsystems.net/index.html` | **200**, 63,403 bytes, **46 symbols**, **0 emoji** |
| `https://gillsystems.net/solutions.html` | **200**, 77,059 bytes, **46 symbols**, **0 emoji** |
| `https://gillsystems.net/ai-era.html` | **200**, 62,912 bytes, **46 symbols**, **0 emoji** |
| v8 SHA256 across Laptop / Main / Deck | byte-identical, `bc0cc194…` |

### NOT clean — four live pages still carry emoji

I fetched the live HTML from the public domain rather than trusting the local tree, and **the "zero emoji site-wide" claim does not hold.** Four pages are still serving 7 emoji each:

| Live URL | HTTP | Bytes | `<symbol>` | Emoji |
|---|---:|---:|---:|---:|
| `/solutions/system-architecture.html` | 200 | 9,375 | **0** | **8** |
| `/solutions/digital-transformation.html` | 200 | 9,247 | **0** | **8** |
| `/solutions/technical-support.html` | 200 | 9,678 | **0** | **8** |
| `/solutions/training-mentorship.html` | 200 | 9,538 | **0** | **8** |

Each carries the identical set: 📧 📞 💻 💼 ⚡ 💬 📺 (+1 U+FE0F).

**Root cause — identified in the script, line 151:**

```python
for f in os.listdir(G)
if f.endswith(".html") and f not in ("ai-era.html",)
```

`os.listdir(G)` is **non-recursive** and not a glob. The script only ever enumerates `.html` files sitting in the **top-level site root**. The four pages above live in the **`solutions/` subdirectory** and were therefore never seen by the eradication run — which is also why they carry **0 `<symbol>`** and no sprite at all.

Consequences:
1. 28 emoji remain live on the public site (4 pages × 7), under a Commander directive that said "**ALL**".
2. A site-wide emoji audit that scans only the root directory will report zero and be wrong.

**Fix not yet applied.** The enumeration needs to walk subdirectories. This is left as an open item (§9) rather than silently patched inside a reporting pass.

### What verification was actually possible

Browser-render verification was **not** possible this session — browser tooling was wedged. The gates that *were* run: static analysis (`node --check` clean), LAN/public HTTP 200 checks, and the node harness. Any claim of "it looks right in a browser" is **not** supported by evidence from this cycle.

## 8. Deploy authorization

Commander authorized publish without review:

> "when done, just publish all - i trust you"

## 9. Open items

1. **Four `solutions/*.html` pages still serve emoji** (28 total) and carry no sprite — root cause is the non-recursive `os.listdir` in `eradicate_emoji.py:151`. Needs a directory-walking fix and a re-run.
2. **Audit tooling must recurse.** Any future "site-wide" sweep must walk the tree; a root-only scan gives a false all-clear.
3. **`archive/` is out of scope but not clean** — `archive/solutions-live.html` (47), `archive/solutions-broken-backup.html` (47), `archive/index-backup.html` (26) still hold emoji in the working tree. Backups, not served; confirm they are excluded by design.
4. **Animations hold 2 emoji each** (v7, v8). These are the v7/v8 standalone files; confirm whether they are in scope for eradication.
5. **152 vs 154** count discrepancy unresolved (see §4).
6. **HTPC (10.0.0.42) unreachable** — did not receive the sync.
7. **Next Bible verse:** Commander has asked **Theo** to select it.

---

*Documented by Scribe. All figures in this report were read from the working tree, the git history, or live HTTP responses on 2026-09-30. Where a supplied figure could not be reproduced, that is stated rather than smoothed over.*
