# Site-Wide Emoji Eradication — gillsystems.net

**Status:** COMPLETE — verified 2026-09-30
**Supersedes:** the first issue of this report, which claimed "zero emoji site-wide" while 4 live pages still served 28 emoji. That claim was **false when made** and is recorded in §8 rather than quietly overwritten.
**Commits (all on `origin/main`; both repos clean):**

| Commit | Contents |
|---|---|
| `752cb3a` | Initial site-wide emoji eradication (13 files, 6,971 insertions / 1,781 deletions) |
| `14326d1` | `ai-era.html` repointed to embed the approved v8 showreel |
| `e2f045a` | Root-cause fix: recursive sweep + `solutions/` repair + animation sprite injection (8 files, 3,824 insertions) |
| `1980b9b` | Force-deploy of `solutions/system-architecture.html` (stale legacy-Pages artifact) |
| `00b7d8d13d` | Fork `Gillsystems-Commanders-Hermes` — v8 sprite injected, glyphs replaced with real marks |

**Bible verse:** Luke 4:18 (ESV) — *"to bring good news to the poor…to set the oppressed free"* — the site's message is only credible if the presentation matches the substance. Commander asks **Theo** to select the next verse.

---

## 1. Directive

Commander Stephen Gill, 2026-09-30:

> "WE NEED ALL EMOJI BULLSHIT AI ICONS READICATED IMMEDIATELY"
>
> "EMOJIS SAYS VIBE CODING PUSSY, NOT SYSTEMS ARCHITECT"

Emoji used as interface icons were judged incompatible with a systems-architecture brand. Every emoji was replaced with a real vendor or role mark.

## 2. The sprite

A **46-symbol SVG sprite** is built at:

```
gillsystems.net\plans\icons\gillsystems-icons-v8.html
```

Verified: `grep -c '<symbol'` returns **46**.

The sprite is injected inline before `</head>` on each page so marks render with no network request and no external dependency. A plain-text extract lives alongside it at `plans\icons\_sprite.txt`.

### Symbol inventory (46, verified by id extraction)

**Platform / vendor marks (26):** `am-amd`, `am-ryzen`, `am-radeon`, `am-rocm`, `am-llama`, `am-vulkan`, `am-windows`, `am-linux`, `am-ubuntu`, `am-steamos`, `am-deck`, `am-zfs`, `am-android`, `am-frp`, `am-caddy`, `am-gchat`, `am-oci`, `am-nvme`, `am-cron`, `am-mesh`, `am-rocket`, `am-diamond`, `am-cloud`, `am-monitor`, `am-desktop`, `am-gear`

**Role / concept marks (20):** `am-shield`, `am-radar`, `am-search`, `am-code`, `am-blueprint`, `am-docs`, `am-debug`, `am-qa`, `am-herald`, `am-courier`, `am-helm`, `am-book`, `am-dividers`, `am-orch`, `am-phone`, `am-likert`, `am-lantern`, `am-compass`, `am-spark`, `am-lock`

Usage is a `<use href="#am-…"/>` reference inside a `.gs-ic` span.

## 3. The eradication script

```
gillsystems.net\plans\eradicate_emoji.py
```

Design points:

- **Explicit `MAP` of 60+ emoji codepoint → vendor mark.** Every entry is keyed by codepoint with a comment naming the emoji and the reasoning for the target mark. Longest-sequence-first ordering so multi-codepoint emoji match correctly.
- **Emoji were mapped to real vendor logos**, not to decorative substitutes — e.g. `💻` (laptop) → `am-desktop`; `🎮` (gamepad) → `am-steamos`; `📧` (email) → `am-gchat`; `⚡` (high voltage) → `am-radeon`; `✅` (check) → `am-qa`; `🎯` (target) → `am-likert`; `🗽` (scroll) → `am-docs`.
- **Arrows and plain typography are deliberately preserved.** U+2190/U+2192 and ordinary typographic glyphs are punctuation in prose, not icons. This exclusion is the main reason raw codepoint counts differ between tools — see §4.
- **Idempotent** — safe to re-run; a page already containing `<symbol` is skipped.
- **Enumeration is now `os.walk`, not `os.listdir`** — see §8.1; the old form is what shipped a false all-clear.
- **`archive/` is explicitly excluded** from the sweep: `"archive" not in dirpath.replace("\\","/").split("/")`. Backups are not published and are not part of the live site.
- Lines 149–158 carry a `RECURSIVE` regression comment naming the exact prior defect and the date, stating that `os.walk` is mandatory and must not be regressed.

## 4. Per-page counts (commit `752cb3a`)

Counts below are Scribe's own independent recount from the `752cb3a` diff, counting emoji in removed lines, with variation selector U+FE0F excluded (matching the script's consumption of VS16 inside a match). The "after" column is emoji in added lines — **0 everywhere**.

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

Plus `ai-era-v2.html` **deleted** (1,620 lines removed) and `plans/eradicate_emoji.py` added. Commit `752cb3a` touched 13 files: 11 rewritten, 1 deleted, 1 added.

### The 152 vs 154 counting discrepancy — retained deliberately

The commit message and task brief say **152**; Scribe's recount says **154**. The gap is a **counting-method difference, not a missing replacement** — the two figures differ by which variation-selector and combining characters are attributed to which emoji. Scribe could not reproduce 152 exactly from the diff and will not declare one number canonical without the original run's stdout. **Both numbers stand; neither is retracted.** The fact that actually matters — every page at zero emoji — is separately verified in §7.

## 5. Deleted artifact: `ai-era-v2.html`

The AI Robots v2 mockup **scored 6.7 on Ebert's rubric** while Commander rated it a **5** and said the icons were **"weaker than weak."** It was **deleted as a superseded rejected mockup**; confirmed absent from the working tree. It is superseded by `plans\ai-era-v3-mockup.html` (71,606 bytes, carries the 46-symbol sprite).

Note: the rubric scores and the Commander's rating disagreed by 1.7 points. The Commander's rating governed.

## 6. Other corrections in the same cycle

- `ai-era.html` stale **"18-agent"** claim corrected to **"20-agent"** (verified: 2 occurrences of `20-agent`, 0 of `18-agent`).
- `ai-era.html` node cards now carry their real OS mark (Windows / Radeon / Ubuntu / SteamOS).
- `ai-era.html` repointed to embed the approved v8 showreel (`14326d1`).

## 7. Verification — final state

### Live domain sweep, re-run by Scribe after all fixes

All **19** public pages were fetched over HTTPS from `https://gillsystems.net` and checked for HTTP status, byte size, `<symbol>` count, and emoji.

**Result: 19/19 HTTP 200, 19/19 zero emoji, 19/19 with the 46-symbol sprite — except two pages that legitimately carry no icons at all.**

| URL | HTTP | Bytes | `<symbol>` | Emoji |
|---|---:|---:|---:|---:|
| `/index.html` | 200 | 63,448 | 46 | 0 |
| `/solutions.html` | 200 | 77,118 | 46 | 0 |
| `/open-source.html` | 200 | 67,845 | 46 | 0 |
| `/build-vs-buy.html` | 200 | 47,713 | 46 | 0 |
| `/ai-era.html` | 200 | 62,980 | 46 | 0 |
| `/knowledge-liberation.html` | 200 | 47,365 | 46 | 0 |
| `/radical-transparency.html` | 200 | 47,992 | 46 | 0 |
| `/user-empowerment.html` | 200 | 47,880 | 46 | 0 |
| `/foundation-era.html` | 200 | 47,975 | 46 | 0 |
| `/dark-ages.html` | 200 | 44,832 | 46 | 0 |
| `/Deadwood_alien_shooter.html` | 200 | 104,030 | 46 | 0 |
| `/cloud-wars.html` | 200 | 5,383 | **0** | 0 |
| `/expansion-era.html` | 200 | 5,523 | **0** | 0 |
| `/solutions/system-architecture.html` | 200 | 48,768 | 46 | 0 |
| `/solutions/digital-transformation.html` | 200 | 48,572 | 46 | 0 |
| `/solutions/technical-support.html` | 200 | 49,009 | 46 | 0 |
| `/solutions/training-mentorship.html` | 200 | 48,865 | 46 | 0 |
| `/animations/…_v7.html` | 200 | 428,485 | 46 | 0 |
| `/animations/…_v8.html` | 200 | 434,959 | 46 | 0 |

`cloud-wars.html` and `expansion-era.html` are icon-free **by design** — 0 emoji *and* 0 symbols. They are not a regression, and a symbol count of 0 on those two is the correct expected value.

### Other verified gates

| Check | Result |
|---|---|
| `node --check`, extracted v7 JS (53,949 B) | **CLEAN** |
| `node --check`, extracted v8 JS (60,372 B) | **CLEAN** |
| v8 full-loop integration test (stubbed canvas, 30 real frames `frame()` → `stepFrame()`) | **185,961 canvas calls, 0 NaN, 0 bad lineWidth, render guard never fired** |
| v8 SHA256 across Laptop / Main (10.0.0.164) / Deck (10.0.0.139) | **byte-identical**, `4c37feef…`, 436,281 B |
| Working tree, both repos | **clean** (`git status --short` empty) |

## 8. Corrections

### 8.1 The false "zero emoji site-wide" claim — what was wrong, who caught it, what was fixed

**What was wrong.** The first issue of this report claimed the eradication was complete and site-wide. It was not. `eradicate_emoji.py` enumerated pages with a **non-recursive `os.listdir(G)`** (line 151), so it only ever saw `.html` files in the **top-level site root**. The four pages in the **`solutions/` subdirectory were never processed at all.** They were not merely uneradicated — each carried **7 emoji *and* no sprite whatsoever**, because sprite injection is the same code path that was never reached. **28 emoji were live** under a directive that said **"ALL"**.

**Who caught it.** **Scribe** — by fetching live HTML from the public domain instead of trusting the local working tree and the commit message. The blind spot was in Scribe's own verification method, and the first report had asserted the result without that check.

**What was fixed.** `eradicate_emoji.py` now uses `os.walk` with `archive/` excluded, and carries a `RECURSIVE` regression comment naming the old defect so it is not reintroduced. All four `solutions/` pages were repaired and now carry the full 46-symbol sprite (commit `e2f045a`).

**Final verified numbers.** **4 pages × 7 emoji = 28 emoji removed, plus 4 missing sprites injected** — worse than the 7 originally reported. Site-wide: **19/19 pages HTTP 200, 0 emoji, 46 symbols** (two icon-free pages excepted, §7).

### 8.2 Stragglers found and cleared beyond the reported defect

Three classes of residue survived the original run and were cleared in the same cycle:

1. **Lone U+FE0F variation selector** hiding behind a YouTube play glyph (`U+25B6` + VS16) in `solutions/*.html` social links. A naive codepoint counter scores VS16 as a non-emoji, which is how it survived. Replaced with `am-monitor`.
2. **Animations v7 and v8** each carried a hamburger drawer glyph (`U+2630`) and a commander-class star (`U+2605`) that are real icons the original counter had missed. Replaced with `am-mesh` and `am-helm` respectively.
3. **Neither animation had a sprite at all.** This is the critical part: referencing a mark in a file with no sprite **renders nothing** — a silent blank, not a visible error. The 46-symbol sprite was injected into **both** v7 and v8, and a new `IC_HELM` constant was added to carry the star mark. This is fork commit `00b7d8d13d`.

### 8.3 Failed verification, recorded plainly

The original claim of "zero emoji site-wide" was **false when made**, and the reason is a verification failure rather than a tooling failure: the sweep was scoped to the local top-level directory, so it could not see a class of pages that existed. The script's enumeration defect and the report's verification method had the **same blind spot**, and the claim was asserted on that basis.

Both are now fixed at the source (`os.walk`) and at the method (public-URL fetch of **every** page, individually, recorded in §7). **A root-only scan will still report a false all-clear, so no future "site-wide" sweep may be scoped that way.**

## 9. Deployment lesson — legacy GitHub Pages serves stale artifacts

`build_type: legacy` Pages served a **stale artifact** for `solutions/system-architecture.html` across **two** deploys (`208fcfa`, and an empty rebuild commit), while `origin/main`'s blob was byte-identical to the local file, and while **three sibling pages in the same directory deployed correctly** with all 46 symbols.

- **An empty commit did not unstick it.** Verified — it changed nothing on the CDN edge.
- **A real content change did.** Commit `1980b9b` added a marker comment (1 file, 1 insertion) and the page served correctly on the next deploy.
- **Consequence for future deploys:** a legacy-Pages deploy is **not atomic across a directory**. Never infer that because `digital-transformation.html` is current, `system-architecture.html` is too — that inference is exactly what hid this for two cycles. **Verify every file individually, from its public URL, after every deploy.**

## 10. Retained cautions and open items

- **The `p:[19,3,-4]` false-positive trap.** On the laptop node this string is a **position array, not RAM**. A grep for "laptop…19" hits it and produces a false positive. The RAM field is `ram:'20 GB'`. The system total is **100 GB** (48 Main + 16 HTPC + 20 Laptop + 16 Deck). This trap is live in the current v8 and will mislead anyone who greps for it.
- **152 vs 154** count discrepancy unresolved and recorded as-is (§4).
- **Browser-render verification was not possible** during this cycle — browser tooling was wedged. The gates actually run were static analysis (`node --check`), the node harness, and per-page public HTTP fetches. No claim of "it looks right in a browser" is supported by evidence from this cycle, and none should be inferred.
- **`archive/` is out of scope by design** and still holds emoji in the working tree (backups, not served). It is now **explicitly** excluded in the script rather than excluded by accident.
- **HTPC (10.0.0.42) unreachable** — did not receive the sync; v8 byte-identity is confirmed on Laptop, Main, and Deck only.
- **Next Bible verse:** Commander has asked **Theo** to select it.

---

*Documented by Scribe. All figures in this report were read from the working tree, the git history, or live HTTP responses on 2026-09-30, and the 19-page sweep in §7 was re-run by Scribe after all fixes landed. Where a supplied figure could not be reproduced, or where an earlier claim of this document was wrong, that is stated rather than smoothed over.*
