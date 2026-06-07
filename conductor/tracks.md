# Track Registry

## Completed Tracks

| # | Name | Status | Description |
|---|------|--------|-------------|
| 1 | Caddy WAN Proxy | COMPLETE | Caddy reverse proxy for gillsystems.net with TLS and WebSocket proxying |
| 2 | Node Registry Watcher | COMPLETE | Dynamic upstream detection for Hermes LAN nodes |
| 3 | Sovereign Bridge | COMPLETE | OCI Cloud Relay replaces port forwarding for WAN access |

## Active Track

### Track 3: Sovereign Bridge
- **Status:** COMPLETE
- **Phase:** Deploy ✓
- **Objective:** Replace ISP-dependent port forwarding with OCI Always Free relay
- **Infrastructure:**
  - OCI Instance: 129.213.114.55 (Ubuntu 20.04, 1GB RAM)
  - FRP tunnel from Windows laptop to OCI relay
  - Caddy kept on gillsystems.net with `tls internal` for LAN fallback
  - Android app connects directly to 129.213.114.55:2200
