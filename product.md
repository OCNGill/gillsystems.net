# Gillsystems.net — Caddy Infrastructure & Server Config

## Product Definition

| Field          | Value                                                       |
|----------------|-------------------------------------------------------------|
| **Product**    | Gillsystems.net — Caddy Server Infrastructure               |
| **Version**    | 1.1.0                                                       |
| **Status**     | Active — Sovereign Bridge Deployed                          |
| **Platform**   | Windows 10 (Gillsystems-Laptop, 10.0.0.93)                  |

## Description

Caddy-based reverse proxy and static site server for the Gillsystems platform. Serves the gillsystems.net static website, proxies WebSocket and API traffic to Hermes agent nodes on the LAN, and provides TLS termination for WAN access. The "Sovereign Bridge" architecture uses an OCI Cloud Relay (129.213.114.55) to eliminate dependency on ISP port forwarding.

## Tech Stack

| Component                | Technology                              |
|--------------------------|-----------------------------------------|
| Reverse Proxy            | Caddy v2                                |
| TLS                      | Self-signed (`tls internal`) for LAN    |
| Upstream Discovery       | node_registry_watcher.py (Python)       |
| Config Format            | Caddyfile + conf/upstreams.conf         |
| WAN Ingress              | OCI Cloud Relay via FRP tunnel          |
| Task Scheduler           | Windows Task Scheduler (watcher)        |
| Static Site              | HTML/CSS/JS served from repo root       |

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         INTERNET (WAN)                           │
│                                                                  │
│   Browser (HTTPS)               Android App (WSS)                │
│         │                              │                         │
│         │  gillsystems.net            │  wss://129.213.114.55   │
│         │                            │  /hermes                 │
│         ▼                            ▼                         │
│   ┌──────────────┐          ┌──────────────────┐               │
│   │  Caddy v2    │          │  OCI Cloud Relay │               │
│   │  (LAN only,  │          │  129.213.114.55  │               │
│   │   tls        │          │  :2200/:7000     │               │
│   │   internal)  │          └────────┬─────────┘               │
│   └──────┬───────┘                   │ FRP Tunnel               │
│          │                           │                          │
└──────────┼───────────────────────────┼──────────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    LOCAL NETWORK (10.0.0.0/24)                   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  Gillsystems-Laptop (10.0.0.93)                         │    │
│   │                                                         │    │
│   │  ┌──────────┐  ┌────────────────┐  ┌────────────────┐  │    │
│   │  │  Caddy   │  │  Node Registry │  │  FRP Client    │  │    │
│   │  │  v2      │  │  Watcher       │  │  (frpc)        │  │    │
│   │  │  :443    │  │  (Python)      │  │                │  │    │
│   │  └──────────┘  └───────┬────────┘  └───────┬────────┘  │    │
│   │                        │                    │           │    │
│   │                        ▼                    │           │    │
│   │               ┌────────────────┐            │           │    │
│   │               │  upstreams.conf│            │           │    │
│   │               └────────────────┘            │           │    │
│   │                                             │           │    │
│   │  ┌──────────────────────────────────────┐   │           │    │
│   │  │  Hermes Gateway           :2200     │◄──┼───────────┘    │
│   │  └──────────────────────────────────────┘   │                │
│   └─────────────────────────────────────────────┘                │
│                                                                  │
│   LAN Nodes (probed by watcher):                                 │
│   - Gillsystems-Main      10.0.0.164  (Windows 11)              │
│   - Gillsystems-HTPC      10.0.0.42   (Kubuntu)                 │
│   - Gillsystems-Laptop    10.0.0.93   (Windows 10)              │
│   - Gillsystems-Steam-Deck 10.0.0.139 (SteamOS)                 │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow — Static Site

1. Browser requests `https://gillsystems.net`
2. Caddy serves static files from repo root (index.html, CSS, JS, assets)
3. Cache-Control: public, max-age=3600 sent with static assets
4. Directory requests fall back to index.html

### Data Flow — WSS/API Proxy (LAN)

1. Node Registry Watcher polls all LAN nodes
2. Watcher writes active master to `conf/upstreams.conf`
3. Caddy hot-reloads upstreams (zero-downtime)
4. Client connects via `wss://gillsystems.net/hermes`
5. Caddy proxies to active Hermes gateway at `10.0.0.x:2200`

### Data Flow — WAN (Sovereign Bridge)

1. Android app connects to `wss://129.213.114.55:2200/hermes` directly
2. FRP tunnel forwards traffic from OCI relay to Gillsystems-Laptop:2200
3. No port forwarding required — ISP independent

## Features

- Static site serving (replaces GitHub Pages)
- WebSocket proxying to Hermes agent nodes
- Dynamic upstream detection via Node Registry Watcher
- Zero-downtime Caddy config reload
- TLS termination (self-signed for LAN, OCI for WAN)
- Multi-node LAN support with automatic failover
- Google Chat webhook receiver (/google-chat-webhook)
- Health check endpoint (/health)
- OpenAI-compatible API proxying (/v1/*)

## Development

- **Source**: `gillsystems.net/` repo
- **Caddy start**: `caddy run --config Caddyfile`
- **Caddy reload**: `caddy reload --config Caddyfile`
- **Watcher start**: `python scripts/node_registry_watcher.py`
- **Active master**: Gillsystems-Laptop at 10.0.0.93:2200
