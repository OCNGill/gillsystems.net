# Gillsystems.net — Active Tracks

## Current Track: v1.1.0 Sovereign Bridge

**Status:** Complete

| Phase       | Status      | Details                                        |
|-------------|-------------|------------------------------------------------|
| Define      | ✅ Complete | v1.1.0 scope defined: Sovereign Bridge, OCI relay, port forwarding removal |
| Design      | ✅ Complete | Architecture documented in product.md          |
| Develop     | ✅ Complete | FRP tunnel configured, OCI relay deployed, Caddy tls internal |
| Debug       | ✅ Complete | End-to-end WAN path tested via OCI relay       |
| Document    | ✅ Complete | product.md, setup_state.json, tracks.md, DEPLOY.md updated |
| Deliver     | ✅ Complete | Sovereign Bridge cut over as primary WAN ingress |
| Deploy      | ✅ Complete | OCI relay at 129.213.114.55 operational        |

### Active Items

1. **OCI Relay Deployment** — ✅ Done. OCI Always Free instance at 129.213.114.55 running Ubuntu 20.04.
2. **FRP Tunnel** — ✅ Done. frpc on Windows laptop → frps on OCI relay. Hermes port 2200 tunneled.
3. **Caddy TLS Migration** — ✅ Done. Changed from Let's Encrypt to `tls internal`. No port 80 required.
4. **WAN Cutover** — ✅ Done. Primary WAN ingress moved from gillsystems.net:443 (port forwarding) to OCI relay.
5. **Documentation** — ✅ Done. All Conductor files and DEPLOY.md updated for v1.1.0.

### Blockers

- None currently identified.

---

## Completed Tracks

### Track 1: Caddy WAN Proxy — COMPLETE

**Objective:** Initial Caddy reverse proxy setup for gillsystems.net with TLS and WebSocket proxying.

| Item | Status |
|------|--------|
| Caddyfile configuration | ✅ Complete |
| WebSocket proxying to Hermes | ✅ Complete |
| TLS via Let's Encrypt | ✅ Complete (superseded by tls internal in v1.1.0) |
| Static site serving | ✅ Complete |

### Track 2: Node Registry Watcher — COMPLETE

**Objective:** Dynamic upstream detection for Hermes LAN nodes.

| Item | Status |
|------|--------|
| Python watcher script | ✅ Complete |
| Automatic upstreams.conf generation | ✅ Complete |
| Caddy hot-reload on change | ✅ Complete |
| Windows Task Scheduler integration | ✅ Complete |

---

## Next Track: LAN Caddy Enhancements

**Status:** Planned (v1.1.1)

| Item | Priority | Notes |
|------|----------|-------|
| Automatic Caddy service restart on failure | High | Use NSSM for process supervision |
| Node health check with failover | High | Caddy should detect and route around failed nodes |
| Watcher monitoring dashbow | Medium | Simple status page for node registry state |
| Reduce Caddy admin API exposure | Medium | Harden admin API or bind stricter |

---

## Future Track: Production TLS on gillsystems.net

**Status:** Planned (v1.2.0+)

| Item | Priority | Notes |
|------|----------|-------|
| DNS-01 challenge for Let's Encrypt | High | Remove tls internal and use real certificates |
| Automated certificate renewal | High | Built into Caddy with DNS-01 |
| Wildcard certificate for subdomains | Medium | *.gillsystems.net |
| Certificate pinning in Android app | Low | Update WebSocketClient to trust real cert chain |

---

## Future Track: Static Site Expansion

**Status:** Planned

| Item | Priority | Notes |
|------|----------|-------|
| Solutions pages | Medium | Expand /solutions/ section |
| AI Era page Update | Low | Update /ai-era.html |
| Blog section | Low | Git-based static blog engine |

---

## Archived Tracks

### Track 0: Initial Caddy Setup — COMPLETE (v1.0.0)

The initial deployment of Caddy with Let's Encrypt TLS, static site serving, and basic reverse proxy configuration. Superseded by v1.1.0 Sovereign Bridge changes.
