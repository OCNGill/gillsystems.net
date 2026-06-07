# Changelog

All notable changes to this project.

---

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
