# Changelog

All notable changes to this project.

---

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
- **Architecture** — Primary WAN ingress moved from gillsystems.net:443 (port forwarding) to OCI Cloud Relay at 129.213.114.55:2200 (no port forwarding).

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
LAN (10.0.0.93) and GitHub Pages both serve identical content; animation serves at `/animations/fleet_animation_v2.html` (HTTP 200).

> *"They went down to the sea in ships, doing business on the mighty waters... then were glad because they were quiet, and he brought them unto their desired haven." — Psalm 107:23, 30 (ESV)*
> — The fleet ships from the harbor it already knows, into quiet waters, and comes home to the live site it was built for.
