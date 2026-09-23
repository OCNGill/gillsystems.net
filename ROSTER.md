# gillsystems.net — Agent Roster

*This repo contains the public website. Agents that deploy or monitor this site:*

## Active Agents Interfacing with Website

| Agent Name | Role | Interface | Status |
|------------|------|-----------|--------|
| Commander Hermes | Primary AI, deploys content | Git push, Caddy config | Active |
| Courier | Notifies Commander of deployments | Google Chat DM, email | Active |
| Sentinel | Security audit of deployed content | Cron scans, zero-trust | Active |
| Scribe | Documentation compliance | This repo's conductor | Active |
| Major-Gaben | Steam Deck / Linux node specialist | Deck deployment verification | Active |

## Website Services & Agents

### Caddy (Port 443, TLS internal)
- Config: `Caddyfile` (self-signed cert, no port 80)
- Upstreams: Dynamic via node_registry_watcher.py
- Managed by: Hermes (config), Courier (notifications)

### Node Registry Watcher
- Script: `scripts/node_registry_watcher.py`
- Updates Caddy upstreams from Hermes LAN nodes
- Runs as: Cron on Laptop

### GitHub Pages
- Domain: `gillsystems.net` (CNAME verified)
- Branch: `main` → live ~2 min after push
- Managed by: Hermes (push), Courier (notify)

---

## Cross-Reference
- **Master ROSTER**: `../Agents/ROSTER.md` (canonical)
- **MASTER_CHARTER**: `../Gillsystems-Commanders-Hermes/MASTER_CHARTER.md`
