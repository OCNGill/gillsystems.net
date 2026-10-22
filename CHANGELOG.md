# Changelog

All notable changes to this project.

---

## [1.2.3] - 2026-10-22

### Fixed
- **Deadwood_alien_shooter.html** — HUD icon markup was being assigned with `textContent` instead of `innerHTML` in the four places where the game swaps an icon at runtime (the `stealth-icon` element on the `HIDDEN` / `DETECTED!` branch of the stealth readout, and both branches of the `music-toggle` button). `textContent` escapes markup, so the served page printed the literal string `<svg class="gs-ic" …><use href="#am-shield"/></svg>` into the HUD and the music button instead of drawing the icon. The static markup in the page body was always correct — the emoji-eradication pass (`752cb3a`) rewrote the runtime setters and left the escaping bug behind, which is why the game rendered and played fine while the HUD looked broken. All four assignments now use `innerHTML`, so the sprite resolves through the existing `#am-steamos` / `#am-shield` / `#am-monitor` symbols.

### Verified
- Caught by independent zero-trust re-verification of production (isolated Chromium with explicit SwiftShader over raw CDP — the shared agent-browser GPU process has WebGL disabled entirely and cannot authoritatively test rendering), then confirmed on the patched local copy: `stealth-icon` and `music-toggle` now report a real child `<svg>` element (`children.length: 1`, `querySelector('svg')` truthy), `textContent` is empty instead of markup, and the raw-markup leak check returns `false`.
- The regression is a render-correctness fix only: game boot (`THREE` loaded, one canvas, WebGL context OK), start handler, wave state, combat, reload, death, and restart all still pass after the change.
- `plans/preship_gate.py` — all clean, exit 0.

### Verse
- *"The acceptable word is a word of truth." — Isaiah 8:20 (ESV)*
- Chosen because this defect was the difference between code that looked right and a HUD that told the truth to the player; a passing byte-check is not the same as a passing screen, and the Word that governs the work must also govern what the work displays.

## [1.2.2] - 2026-10-22

### Fixed
- **vendor/three.umd.js** — Added the vendored Three.js r157 build (1,271,276 B, byte-identical to `Gillsystems_games/vendor/three.umd.js`). The Deadwood alien-shooter page references `vendor/three.umd.js` for its WebGL renderer, but the deployment repository never carried the file, so the served page loaded the script tag against a 404 and the game module never booted — `THREE` was undefined, zero canvases were created, and the page rendered as a dead shell on gillsystems.net. The library is now vendored in-repo, so the site stays sovereign and offline-capable with no CDN dependency.
- **index.html** — Repointed the "The Commander Boomer Shooter" home-page game card from the non-existent in-site path `The_Commander_Boomer_Shooter` (HTTP 404) to the project's public repository, matching the treatment already used in `open-source.html`. The placeholder copy itself (title, status blurb, `IN DEVELOPMENT` badge) is unchanged and no fake screenshots were added — the UE build does not exist yet, so the card links to the build's source of truth instead of a dead page.

### Verified
- Live boot on `https://gillsystems.net/Deadwood_alien_shooter.html`: `THREE` loads, one canvas, WebGL context OK, zero console errors.
- Full gameplay loop driven against production through the game's own camera/aim/fire path: start → Hunter killed in 3 hits (42.5 dmg each, +200 score, "Hunter ELIMINATED" feed) → reload (`0` → `6 / 6`) → wave 1 → 2 (10 aliens, `WAVE 2` HUD) → death (`gameOver:true`, restart button visible) → restart (full state reset) → reload after restart (`6 / 6`).
- Live game HTML is byte-identical to the committed `HEAD:Deadwood_alien_shooter.html` blob (104,030 B, SHA256 `a681891b7ec06c1b`).
- `plans/preship_gate.py` — all clean, exit 0.

### Verse
- *"Your life is a lamp for my feet, and my doctrine is a light for your path." — Psalm 119:105 (ESV)*
- Chosen because the doctrine was never missing — the game code was complete and correct; what was missing was the lamp standing beside it. The light was in the room the whole time; the fix was to put the provision where the path actually walks.

## [1.2.0] - 2026-09-20

### Changed
- **ai-era.html** — Full rebuild of the AI-ROBOTS page: the Sovereign AI Stack (4-node heterogeneous AMD llama.cpp cluster) is now the hero, with a node-card grid (Laptop/Main/HTPC/Steam Deck), stats row (4 nodes, 18 agents, 192K context, 0 cloud bills), doctrine quotes, and the flagship open-source AI stack installer (Gillsystems-AMD-Radeon-llama-cpp-Update-AI-Stack) as the sellable product hook.
- **ai-era.js** — Retired the old hash-decode typing choreography; reduced to a footer-year script.
- **conductor/tracks.md, tracks.md** — AI-Era page rebuild tracked as Active Track 4.

### Removed
- ai-era.html references to era-boot.js / cta-component.js terminal animation (page is now static content-first); The-Commander-Agent premier card replaced by the current fleet roster section.

### Verse
- *"Put your outdoor work in order and get your fields ready; after that, build your house." — Proverbs 24:27 (ESV)*
- Chosen because this rebuild is exactly that order of operations: the income-producing work (the sovereign AI stack, the fleet) is placed first and in plain sight, before the house (the storefront, the products) is built on it.

## [1.1.0] - 2026-06-06

### Changed
- **Caddyfile** — Changed from Let's Encrypt TLS to `tls internal` (self-signed cert). No port 80 required.
- **Architecture** — Primary WAN ingress moved from gillsystems.net:443 (port forwarding) to OCI Cloud Relay at [RELAY-LOCAL] (no port forwarding).

### Deprecated
- `gillsystems.net:443` as primary WAN ingress method (kept for LAN testing with `tls internal`).
- Port forwarding as WAN access method (replaced by Sovereign Bridge / OCI relay).

## [1.0.0] - 2026-05-30

### Added
- Caddy reverse proxy configuration for gillsystems.net
- Node Registry Watcher (node_registry_watcher.py) for dynamic Caddy upstreams
- Upstream auto-detection from Hermes LAN nodes
- DEPLOY.md with full deployment instructions
---

## [1.2.1] - 2026-09-22

### Fixed
- **index.html** — Removed the dead GAMES nav tab (404); all other navigation intact.
- **open-source.html** — Deadwood card title now links to the in-site game (Deadwood_alien_shooter.html), openable directly from the Open Source page; GitHub button retained as secondary.
- **ai-era.html** — Fleet animation iframe path corrected to absolute (`/animations/...`) so it renders from any page on the site.

### Verified
LAN ([LAN-DETAILS-LOCAL]) and GitHub Pages both serve identical content; animation serves at `/animations/fleet_animation_v2.html` (HTTP 200).

> *"They went down to the sea in ships, doing business on the mighty waters... then were glad because they were quiet, and he brought them unto their desired haven." — Psalm 107:23, 30 (ESV)*
> — The fleet ships from the harbor it already knows, into quiet waters, and comes home to the live site it was built for.

## 2026-09-28 — Fleet Animation v6 Live; Rotate-Crash Fixed; AI Page Copy Corrected
- **Crash fix (critical):** both v6 and the previous Claude build died after a few seconds of rotation.
  Root cause was a negative `ellipse()` minor-radius on the storage-tier glow (`t[4]*k*sin(pitch)+2` goes
  negative when the camera tilts below the horizon), which throws `IndexSizeError` and kills the whole
  `requestAnimationFrame` render loop. Fixed by taking `|sin(pitch)|`, clamping pitch above the horizon
  (`0.02..1.15`), adding safe radial/ellipse helpers, and wrapping the frame loop in a guard that re-schedules
  instead of dying. Verified: 5,860-frame headless render sweep (full rotation + zoom extremes + all select
  states) → 0 fatal canvas violations, 0 render-guard trips.
- **AI page copy:** the AI Era lede no longer says "one gateway hub" (that was wrong — the mesh is a peer
  mesh, not a central gateway). Now: "distributed peer mesh ... four AMD nodes and eighteen named agent threads."
- **Live-embed single source:** the AI page now references ONLY `/animations/fleet_animation_v6.html`. The old
  v2 reference is gone from the page (kept only in this changelog as history).
- Verified on LAN (curl --resolve [LAN-DETAILS-LOCAL]) and pushed to origin/main.
## 2026-09-28 — Animation v7: solid 3D node models, real agent roster, mobile
Per Commander Gill's iteration requests, all live on the AI Era page:
- **Solid 3D models** per real node (face-shaded, projected): Main = desktop tower, HTPC = small-form-factor
  cube, Steam Deck = handheld slab, Laptop = clamshell with a red duct-tape strip on the front edge.
- **Real agent data** — 19 threads / 18 names sourced from `Agents/ROSTER.md` (real roles and classes),
  replacing generic labels. Ebert (Zero Trust Critic) is on the Laptop ops seat; Hermes honestly holds two seats.
- **Speed control** defaulting to 45%, **RESET**, **BLOOM** (additive blur post-pass), and **DATA FLOW** toggles.
- **Logo** in the header, via a relative path so it resolves on the site and in local preview.
- **Mobile**: collapsible controls drawer + responsive layout at <=820px; orbit is rotation-only.
- Rotate-crash fix retained (negative ellipse minor-radius on the storage glow; canvas throws, it never clamps).
- Verified: 7,745-frame headless crash sweep = 0 fatal canvas violations, 0 render-guard trips. Zero IP/path
  leaks, zero external dependencies. Build success on commit 88afcd5.
