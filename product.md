# Gillsystems.net — Caddy Infrastructure & Server Config

## Product Definition

| Field          | Value                                                       |
|----------------|-------------------------------------------------------------|
| **Product**    | Gillsystems.net — Caddy Server Infrastructure               |
| **Version**    | 1.1.0                                                       |
| **Status**     | Active — Sovereign Bridge Deployed                          |
| **Platform**   | Windows 10 (Gillsystems-Laptop, [LAN-DETAILS-LOCAL])                  |

## Description

Caddy-based reverse proxy and static site server for the Gillsystems platform. Serves the gillsystems.net static website, proxies WebSocket and API traffic to Hermes agent nodes on the LAN, and provides TLS termination for WAN access. The "Sovereign Bridge" architecture uses an OCI Cloud Relay ([RELAY-LOCAL]) to eliminate dependency on ISP port forwarding.

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
│         │  gillsystems.net            │  wss://[RELAY-LOCAL]    │
│         │                            │  /hermes                 │
│         ▼                            ▼                         │
│   ┌──────────────┐          ┌──────────────────┐               │
│   │  Caddy v2    │          │  OCI Cloud Relay │               │
│   │  (LAN only,  │          │  [RELAY-LOCAL]  │                │
│   │   tls        │          │  :2200/:7000     │               │
│   │   internal)  │          └────────┬─────────┘               │
│   └──────┬───────┘                   │ FRP Tunnel               │
│          │                           │                          │
└──────────┼───────────────────────────┼──────────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────────────────────────┐
│            LOCAL NETWORK ([LAN-DETAILS-LOCAL])                   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  Gillsystems-Laptop ([LAN-DETAILS-LOCAL])               │    │
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
│   - Gillsystems-Main      [LAN-DETAILS-LOCAL]  (Windows 11)     │
│   - Gillsystems-HTPC      [LAN-DETAILS-LOCAL]   (Kubuntu)       │
│   - Gillsystems-Laptop    [LAN-DETAILS-LOCAL]   (Windows 10)    │
│   - Gillsystems-Steam-Deck [LAN-DETAILS-LOCAL] (SteamOS)        │
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
5. Caddy proxies to active Hermes gateway at `[LAN-DETAILS-LOCAL]:2200`

### Data Flow — WAN (Sovereign Bridge)

1. Android app connects to `wss://[RELAY-LOCAL]/hermes` directly
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
- **Active master**: Gillsystems-Laptop at [LAN-DETAILS-LOCAL]:2200
