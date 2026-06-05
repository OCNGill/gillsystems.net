# DEPLOY.md — Caddy Server (Static Site + WSS Proxy)

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [DNS Configuration](#dns-configuration)
5. [Port Forwarding](#port-forwarding)
6. [Starting Services](#starting-services)
7. [Running as Windows Services](#running-as-windows-services)
8. [Firewall Rules](#firewall-rules)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INTERNET (WAN)                                     │
│                                                                             │
│   Browser (HTTPS)                    Android App (WebSocketClient)          │
│         │                                      │                            │
│         │  https://gillsystems.net             │  wss://gillsystems.net     │
│         │                                      │  /hermes                   │
│         ▼                                      ▼                            │
│   ┌──────────────┐     TLS Termination     ┌──────────────────────────┐    │
│   │   DNS A/AAAA │ ──────────────────────► │  Caddy v2                │    │
│   │   Record     │                         │  (Reverse Proxy +        │    │
│   └──────────────┘                         │   Static File Server)    │    │
│                                             └────────────┬─────────────┘    │
│                                                          │                  │
│                              ┌───────────────────────────┼──────────────┐  │
│                              │                           │              │  │
│                              ▼                           ▼              │  │
│                    ┌──────────────────┐      ┌──────────────────────┐   │  │
│                    │  Static Files    │      │  Reverse Proxy       │   │  │
│                    │  (Repo Root)     │      │  Routes:             │   │  │
│                    │                  │      │                      │   │  │
│                    │  index.html      │      │  /hermes    ──► WSS  │   │  │
│                    │  *.css, *.js     │      │  /console   ──► Hermes│   │  │
│                    │  assets/         │      │  /api/*     ──► Hermes│   │  │
│                    │  solutions/      │      │  /v1/*      ──► Hermes│   │  │
│                    │                  │      │  /health    ──► Hermes│   │  │
│                    │  file_server     │      └──────────┬───────────┘   │  │
│                    │  index.html      │                 │               │  │
│                    │  fallback        │                 │               │  │
│                    │                  │    Reads conf/upstreams.conf    │  │
│                    │  Cache-Control:  │    (auto-updated by watcher)    │  │
│                    │  public,         │                 │               │  │
│                    │  max-age=3600    │                 ▼               │  │
│                    └──────────────────┘      ┌──────────────────────┐   │  │
│                                              │  Node Pool           │   │  │
│                                              │  (Hermes Nodes)      │   │  │
│                                              │                      │   │  │
│                                              │  Node A :2200        │   │  │
│                                              │  Node B :2201        │   │  │
│                                              │  Node C :2202        │   │  │
│                                              │  Node D :2203        │   │  │
│                                              └──────────────────────┘   │  │
│                                                       ▲                  │  │
│                                                       │                  │  │
│                                              ┌────────┴─────────┐       │  │
│                                              │  node_registry_  │       │  │
│                                              │  watcher.py      │       │  │
│                                              │  (File Watcher)  │       │  │
│                                              │                  │       │  │
│                                              │  Polls all 4 LAN │       │  │
│                                              │  nodes, writes   │       │  │
│                                              │  conf/upstreams  │       │  │
│                                              │  .conf, triggers │       │  │
│                                              │  Caddy reload    │       │  │
│                                              └──────────────────┘       │  │
│                                                                         │  │
└─────────────────────────────────────────────────────────────────────────┘  │

Data Flow — Static Site:
  1. Browser requests https://gillsystems.net
  2. Caddy serves static files directly from repo root (index.html, CSS, JS, assets)
  3. Cache-Control: public, max-age=3600 header sent with static assets
  4. Directory requests fall back to index.html

Data Flow — WSS/API Proxy:
  1. Node registers → watcher.py detects change → updates conf/upstreams.conf
  2. Caddy hot-reloads upstreams.conf (zero-downtime)
  3. Android client connects via wss://gillsystems.net/hermes
  4. Caddy routes to a healthy node via round-robin
  5. WebSocket frames flow bidirectionally through the TLS tunnel
  6. API requests to /api/*, /v1/*, /console, /health similarly proxied to Hermes
```

### Static Site Serving

Caddy serves the entire static website directly from the repository root, replacing GitHub Pages entirely.

**How it works:**

- **`file_server`** — Caddy's built-in static file server handles all requests that don't match proxy routes. It serves files from the repo root directory where the `Caddyfile` lives.
- **`index.html` fallback** — When a directory is requested (e.g., `/` or `/solutions/`), Caddy looks for `index.html` in that directory. This enables clean URLs without `.html` extensions.
- **Cache headers** — Static assets are served with `Cache-Control: public, max-age=3600`, telling browsers to cache files for 1 hour. This reduces repeat load times and server bandwidth.
- **MIME types** — Caddy automatically detects MIME types from file extensions (`.css` → `text/css`, `.js` → `application/javascript`, `.png` → `image/png`, etc.).

**Served content:**

| Path | Content |
|---|---|
| `/` | `index.html` (main landing page) |
| `/solutions/` | `solutions.html` |
| `/ai-era.html` | AI Era page |
| `/open-source.html` | Open Source page |
| `/assets/` | Images, sounds, and other static assets |
| `/solutions/digital-transformation.html` | Solution detail pages |
| All `.css`, `.js` files | Stylesheets and scripts |

**Note:** All static files must remain in the repo root (or subdirectories) for Caddy's `file_server` to find them. Do not move them to a separate build output directory.

---

## Prerequisites

| Requirement | Minimum Version | Notes |
|---|---|---|
| **Caddy** | v2.7+ | Download from [caddyserver.com](https://caddyserver.com/download) |
| **Python** | 3.8+ | Required for `node_registry_watcher.py` |
| **DNS** | — | An A or AAAA record pointing to your server's public IP |
| **Ports** | 80, 443 | Must be open and forwarded to the Caddy server |
| **OS** | Windows 10+ / Linux | Both supported; instructions provided for each |

### Verify Prerequisites

```bash
# Check Caddy version
caddy version

# Check Python version
python --version

# Check DNS resolution
nslookup gillsystems.net

# Check port availability (Linux)
ss -tlnp | grep -E ':(80|443) '

# Check port availability (Windows)
netstat -an | findstr ":80 :443"
```

---

## Installation

### Caddy — Windows

1. Download the Windows amd64 binary from [caddyserver.com](https://caddyserver.com/download)
2. Place `caddy.exe` in the project root (`gillsystems.net/`)
3. Verify it runs:

```cmd
caddy version
```

4. (Optional) Add to PATH for global access:

```cmd
setx PATH "%PATH%;C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net"
```

### Caddy — Linux (Debian/Ubuntu)

```bash
# Install Caddy with official repository
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Verify
caddy version
```

### Python Dependencies

```bash
cd C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net
pip install -r scripts/requirements.txt
```

---

## DNS Configuration

You need a DNS A record (IPv4) or AAAA record (IPv6) pointing your domain to the server's **public** IP address.

### Example DNS Records

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `gillsystems.net` | `203.0.113.42` | 300 |
| A | `*.gillsystems.net` | `203.0.113.42` | 300 |

### Verify DNS

```bash
# Check A record
nslookup gillsystems.net

# Or with dig
dig gillsystems.net A +short

# Check propagation globally
dig @8.8.8.8 gillsystems.net A +short
```

> **Note:** DNS propagation can take up to 48 hours, though it's usually under 5 minutes with modern providers.

---

## Port Forwarding

Your router must forward external ports 80 and 443 to the internal IP of the machine running Caddy.

### Common Router Steps

1. Access your router admin panel (typically `192.168.1.1` or `10.0.0.1`)
2. Navigate to **Port Forwarding** or **Virtual Servers**
3. Add the following rules:

| External Port | Internal IP | Internal Port | Protocol |
|---|---|---|---|
| 80 | `<caddy-server-ip>` | 80 | TCP |
| 443 | `<caddy-server-ip>` | 443 | TCP |

### Verify Port Forwarding

From an external network (or using an online port checker):

```bash
# Test from another machine
curl -I http://gillsystems.net
curl -Ik https://gillsystems.net
```

Or use an online tool like [canyouseeme.org](https://canyouseeme.org) to check ports 80 and 443.

---

## Starting Services

### 1. Start the Node Registry Watcher

The watcher monitors the node registry and updates `conf/upstreams.conf` when nodes join or leave.

```bash
# Windows
cd C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net
python scripts/node_registry_watcher.py

# Linux
cd /path/to/gillsystems.net
python3 scripts/node_registry_watcher.py
```

### 2. Start Caddy

```bash
# From the project root (where Caddyfile lives)
cd C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net

# Windows
caddy run

# Linux
caddy run
```

Caddy will automatically:
- Obtain and renew TLS certificates via Let's Encrypt (on port 80)
- Serve HTTPS on port 443
- Serve static files from the repo root (index.html, CSS, JS, assets)
- Proxy `/hermes`, `/console`, `/api/*`, `/v1/*`, `/health` to Hermes nodes
- Load upstreams from `conf/upstreams.conf`
- Hot-reload when `upstreams.conf` changes (zero-downtime)

### 3. Verify Everything Works

```bash
# Check Caddy is serving the static site
curl -Ik https://gillsystems.net

# Check the watcher is running
# (Look for log output in the watcher terminal)

# Test WebSocket upgrade
curl -Ik \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  https://gillsystems.net/hermes
```

---

## Running as Windows Services

For production, run both Caddy and the watcher as Windows services using [NSSM](https://nssm.cc) (Non-Sucking Service Manager).

### Install NSSM

1. Download NSSM from [nssm.cc/download](https://nssm.cc/download)
2. Extract `nssm.exe` to a directory on your PATH

### Create Caddy Service

```cmd
nssm install CaddyWSS "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\caddy.exe"
nssm set CaddyWSS AppDirectory "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net"
nssm set CaddyWSS AppParameters "run"
nssm set CaddyWSS DisplayName "Caddy WSS Reverse Proxy"
nssm set CaddyWSS Description "Caddy reverse proxy for Hermes WebSocket node registry and static site serving"
nssm set CaddyWSS Start SERVICE_AUTO_START
nssm set CaddyWSS AppStdout "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\logs\caddy.log"
nssm set CaddyWSS AppStderr "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\logs\caddy-error.log"
nssm start CaddyWSS
```

### Create Watcher Service

```cmd
nssm install NodeRegistryWatcher "C:\Python311\python.exe"
nssm set NodeRegistryWatcher AppDirectory "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net"
nssm set NodeRegistryWatcher AppParameters "scripts/node_registry_watcher.py"
nssm set NodeRegistryWatcher DisplayName "Node Registry Watcher"
nssm set NodeRegistryWatcher Description "Watches node registry and updates Caddy upstreams"
nssm set NodeRegistryWatcher Start SERVICE_AUTO_START
nssm set NodeRegistryWatcher AppStdout "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\logs\watcher.log"
nssm set NodeRegistryWatcher AppStderr "C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\logs\watcher-error.log"
nssm start NodeRegistryWatcher
```

### Manage Services

```cmd
# Check status
nssm status CaddyWSS
nssm status NodeRegistryWatcher

# Stop
nssm stop CaddyWSS
nssm stop NodeRegistryWatcher

# Restart
nssm restart CaddyWSS
nssm restart NodeRegistryWatcher

# Remove
nssm remove CaddyWSS confirm
nssm remove NodeRegistryWatcher confirm
```

---

## Firewall Rules

### Windows Defender Firewall

```powershell
# Allow Caddy (port 80 and 443)
New-NetFirewallRule -DisplayName "Caddy HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Caddy HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# Allow Hermes node ports (if nodes are on the same machine)
New-NetFirewallRule -DisplayName "Hermes Nodes" -Direction Inbound -Protocol TCP -LocalPort 2200-2210 -Action Allow
```

### Linux (ufw)

```bash
# Allow Caddy
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow Hermes node ports
sudo ufw allow 2200:2210/tcp

# Enable firewall
sudo ufw enable
```

### Linux (iptables)

```bash
# Allow Caddy
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow Hermes node ports
sudo iptables -A INPUT -p tcp --dport 2200:2210 -j ACCEPT

# Save rules
sudo iptables-save > /etc/iptables/rules.v4
```

---

## Troubleshooting

| Symptom | Likely Cause | Solution |
|---|---|---|
| `caddy: command not found` | Caddy not in PATH | Add Caddy directory to PATH or use full path |
| `bind: address already in use` | Another service on port 80/443 | Stop the conflicting service: `netstat -ano \| findstr :443` |
| `tls: handshake failure` | Certificate issue | Ensure port 80 is open for Let's Encrypt ACME challenge |
| `no healthy upstream` | No nodes registered | Check `conf/upstreams.conf` has entries; verify watcher is running |
| `connection refused` (LAN) | Node not running | Verify the Hermes node is listening on the expected port |
| `DNS_PROBE_FINISHED_NXDOMAIN` | DNS not propagated | Wait for DNS propagation; check with `dig` |
| `SSL_CERT_EXPIRED` | Certificate not renewing | Check Caddy logs; ensure port 80 is accessible |
| Watcher not detecting changes | File path mismatch | Verify watcher is monitoring the correct registry path |
| `ModuleNotFoundError` | Python deps missing | Run `pip install -r scripts/requirements.txt` |
| Android `CLEARTEXT` error | Missing network security config | Add `android:usesCleartextTraffic="true"` to AndroidManifest.xml for LAN |
| Android SSL handshake fail | Untrusted cert | The `WebSocketClient` trusts all certs by default; for production, pin the certificate |
| NSSM service won't start | Wrong path | Verify all paths in `nssm set` commands are absolute and correct |
| `upstreams.conf` empty | Watcher not running | Start the watcher; check its logs for errors |
| **404 on static files** | File not in repo root or wrong path | Verify the file exists in the repo root directory; check Caddyfile `file_server` root path |
| **Wrong MIME types** | Caddy misdetecting file type | Ensure files have correct extensions (`.css`, `.js`, `.png`); check Caddy logs for served MIME type |
| **Cache issues (stale content)** | Browser caching old assets | Cache-Control is set to 3600s; force-reload with Ctrl+Shift+R; wait for cache to expire; or reduce max-age in Caddyfile |

### Log Locations

| Service | Log Path |
|---|---|
| Caddy (manual) | stdout/stderr of terminal |
| Caddy (NSSM) | `logs/caddy.log` / `logs/caddy-error.log` |
| Watcher (manual) | stdout/stderr of terminal |
| Watcher (NSSM) | `logs/watcher.log` / `logs/watcher-error.log` |

### Quick Diagnostic Commands

```bash
# Check if Caddy is listening
netstat -an | findstr ":443"

# Check static site loads
curl -Ik https://gillsystems.net

# Check upstreams.conf content
type conf\upstreams.conf

# Test WebSocket from command line
# (Install websocat: https://github.com/vi/websocat)
websocat wss://gillsystems.net/hermes

# Check Caddy config validity
caddy adapt --config Caddyfile

# Validate Python watcher syntax
python -m py_compile scripts/node_registry_watcher.py
```
