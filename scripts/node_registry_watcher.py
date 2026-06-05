#!/usr/bin/env python3
"""
node_registry_watcher.py — Poll Hermes NodeRegistry API and update Caddy upstreams.

Polls GET /api/config/node on each LAN node, determines the active master node,
writes conf/upstreams.conf with Caddy reverse_proxy directives, and triggers
Caddy graceful reload via the CLI.

Usage:
    python scripts/node_registry_watcher.py

Environment variables (optional, override CLI args):
    NODE_IPS         Comma-separated LAN IPs (default: 10.0.0.164,10.0.0.42,10.0.0.93,10.0.0.139)
    NODE_PORT        Hermes API port on each node (default: 2200)
    POLL_INTERVAL    Seconds between polls (default: 30)
    CADDY_BIN        Path to the caddy binary (default: ./caddy.exe)
    CADDYFILE        Caddyfile path (default: Caddyfile)
    UPSTREAMS_CONF   Path to Caddy upstreams config (default: conf/upstreams.conf)
    LOG_FILE         Optional log file path (default: stdout only)
    NODE_NAMES       Optional comma-separated node names matching IP order

================================================================================
LAN NODE REGISTRY — Authoritative node list (source: Gillsystems_local_configuration.md)
================================================================================

  Node Name               IP Address      Role                    OS
  ─────────────────────── ─────────────── ─────────────────────── ──────────────────
  Gillsystems-Main         10.0.0.164      Orchestrator/Primary    Windows 11 Pro
                           Port: 2200      Compute                 GPU: Radeon 7900 XTX
  Gillsystems-HTPC         10.0.0.42       Storage Authority/      Kubuntu (Linux)
                           Port: 2200      Worker                  GPU: Radeon 7600
  Gillsystems-Laptop       10.0.0.93       Worker                  Windows 10
                           Port: 2200                              GPU: Vega 6 (iGPU)
  Gillsystems-Steam-Deck   10.0.0.139      Worker                  SteamOS (Arch Linux)
                           Port: 2200                              GPU: AMD RDNA 2 APU

  Hermes API Server Port: 2200 (all nodes)
  Network Subnet: 10.0.0.0/24 (static allocations)
================================================================================
"""

import json
import logging
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Configuration defaults
# ---------------------------------------------------------------------------

DEFAULT_NODE_IPS = "10.0.0.164,10.0.0.42,10.0.0.93,10.0.0.139"
DEFAULT_NODE_PORT = 2200
DEFAULT_POLL_INTERVAL = 30
DEFAULT_CADDY_BIN = "./caddy.exe"
DEFAULT_CADDYFILE = "Caddyfile"
DEFAULT_UPSTREAMS_CONF = "conf/upstreams.conf"
DEFAULT_NODE_NAMES = "Gillsystems-Main,Gillsystems-HTPC,Gillsystems-Laptop,Gillsystems-Steam-Deck"

# Timeout for each node's /api/config/node request (seconds)
REQUEST_TIMEOUT = 5

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

def setup_logging(log_file: Optional[str] = None) -> logging.Logger:
    logger = logging.getLogger("node_watcher")
    logger.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    if log_file:
        fh = logging.FileHandler(log_file)
        fh.setFormatter(formatter)
        logger.addHandler(fh)
    return logger

# ---------------------------------------------------------------------------
# Node registry polling
# ---------------------------------------------------------------------------

def fetch_node_registry(node_ip: str, port: int, logger: logging.Logger) -> Optional[Dict[str, Any]]:
    """Poll GET /api/config/node on a single node. Returns parsed JSON or None on failure."""
    url = f"http://{node_ip}:{port}/api/config/node"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            logger.debug("NodeRegistry response from %s: %s", node_ip, json.dumps(data, indent=2))
            return data
    except urllib.error.URLError as e:
        logger.debug("Node %s unreachable: %s", node_ip, e)
        return None
    except (json.JSONDecodeError, Exception) as e:
        logger.warning("Node %s returned invalid response: %s", node_ip, e)
        return None


def determine_active_master(
    node_ips: List[str],
    node_port: int,
    node_names: List[str],
    logger: logging.Logger,
) -> Optional[Dict[str, Any]]:
    """
    Poll all nodes and determine the active master.
    
    Strategy:
    1. Try each node's /api/config/node endpoint
    2. Use the master reported by the NodeRegistry (most recently seen active node)
    3. If multiple nodes respond with different masters, use the one with the highest last_seen
    4. If no NodeRegistry is available, fall back to the first responding node
    """
    all_responses: List[Dict[str, Any]] = []
    responding_nodes: List[Tuple[str, str, Dict[str, Any]]] = []  # (ip, name, response)

    for ip, name in zip(node_ips, node_names):
        response = fetch_node_registry(ip, node_port, logger)
        if response is not None:
            responding_nodes.append((ip, name, response))
            all_responses.append(response)

    if not responding_nodes:
        logger.warning("No nodes responded — all %d nodes unreachable", len(node_ips))
        return None

    logger.info("Responding nodes: %d/%d", len(responding_nodes), len(node_ips))

    # Collect all master candidates from all responses
    master_candidates: List[Dict[str, Any]] = []
    for ip, name, response in responding_nodes:
        master = response.get("master")
        if master and master.get("lan_ip"):
            master_candidates.append(master)
            logger.info(
                "  %s (%s) reports master: %s at %s:%s (last_seen: %s)",
                name, ip,
                master.get("node_name", "?"),
                master.get("lan_ip", "?"),
                master.get("port", "?"),
                master.get("last_seen", "?"),
            )

    if master_candidates:
        # Pick the master with the highest last_seen (most recent)
        best_master = max(master_candidates, key=lambda m: m.get("last_seen", 0))
        logger.info(
            "Selected master: %s at %s:%s",
            best_master.get("node_name", "?"),
            best_master.get("lan_ip", "?"),
            best_master.get("port", "?"),
        )
        return best_master

    # Fallback: no master reported — use the first responding node
    fallback_ip, fallback_name, _ = responding_nodes[0]
    logger.warning(
        "No master reported by any node — falling back to first responder: %s (%s)",
        fallback_name, fallback_ip,
    )
    return {
        "node_name": fallback_name,
        "lan_ip": fallback_ip,
        "port": node_port,
        "gpu": "",
        "hostname": fallback_name,
        "last_seen": time.time(),
        "ttl": 120,
    }

# ---------------------------------------------------------------------------
# Caddy upstream config generation
# ---------------------------------------------------------------------------

UPSTREAM_TEMPLATE = """# =============================================================================
# Caddy Upstream Configuration — AUTO-GENERATED
# =============================================================================
# DO NOT EDIT MANUALLY — this file is overwritten by node_registry_watcher.py
#
# Master: {node_name} at {lan_ip}:{port}
# GPU: {gpu}
# Generated: {timestamp}
# =============================================================================

# Android companion chat WebSocket
handle_path /hermes/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
        transport http {{
            read_buffer  8192
            write_buffer 8192
        }}
    }}
}}

# Console streaming WebSocket
handle_path /console/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
        transport http {{
            read_buffer  8192
            write_buffer 8192
        }}
    }}
}}

# Node/Engine config REST API
handle_path /api/config/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
    }}
}}

# OpenAI-compatible API
handle_path /v1/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
    }}
}}

# Health check
handle_path /health {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
    }}
}}

# Session management
handle_path /api/sessions/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
    }}
}}

# Run management
handle_path /v1/runs/* {{
    reverse_proxy {lan_ip}:{port} {{
        header_up X-Forwarded-For {{remote_host}}
        header_up X-Real-IP {{remote_host}}
        header_up X-Forwarded-Proto {{scheme}}
    }}
}}
"""


def generate_upstream_config(master: Dict[str, Any]) -> str:
    """Generate Caddy upstream config content from master node info."""
    return UPSTREAM_TEMPLATE.format(
        node_name=master.get("node_name", "unknown"),
        lan_ip=master.get("lan_ip", "127.0.0.1"),
        port=master.get("port", 2200),
        gpu=master.get("gpu", "unknown"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


def write_upstream_config(content: str, conf_path: str, logger: logging.Logger) -> bool:
    """Write upstream config atomically (write to temp, then rename)."""
    path = Path(conf_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        tmp_path.write_text(content, encoding="utf-8")
        tmp_path.replace(path)
        logger.info("Wrote upstream config: %s", conf_path)
        return True
    except OSError as e:
        logger.error("Failed to write upstream config: %s", e)
        return False

# ---------------------------------------------------------------------------
# Caddy CLI reload
# ---------------------------------------------------------------------------

def reload_caddy(caddy_bin: str, caddyfile: str, logger: logging.Logger) -> bool:
    """Trigger Caddy graceful reload via the CLI."""
    try:
        result = subprocess.run(
            [caddy_bin, "reload", "--config", caddyfile],
            capture_output=True, text=True, timeout=15,
        )
        if result.returncode == 0:
            logger.info("Caddy reload triggered successfully")
            return True
        else:
            logger.warning(
                "Caddy reload failed (exit %d): %s",
                result.returncode, result.stderr.strip(),
            )
            return False
    except FileNotFoundError:
        logger.error("caddy binary not found at %s", caddy_bin)
        return False
    except subprocess.TimeoutExpired:
        logger.error("Caddy reload timed out")
        return False
    except Exception as e:
        logger.error("Caddy reload error: %s", e)
        return False

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

def main() -> None:
    """Main watcher loop: poll nodes, update config, reload Caddy."""
    # Read configuration from environment or defaults
    node_ips = [ip.strip() for ip in os.getenv("NODE_IPS", DEFAULT_NODE_IPS).split(",") if ip.strip()]
    node_names = [n.strip() for n in os.getenv("NODE_NAMES", DEFAULT_NODE_NAMES).split(",") if n.strip()]
    node_port = int(os.getenv("NODE_PORT", str(DEFAULT_NODE_PORT)))
    poll_interval = int(os.getenv("POLL_INTERVAL", str(DEFAULT_POLL_INTERVAL)))
    caddy_bin = os.getenv("CADDY_BIN", DEFAULT_CADDY_BIN)
    caddyfile = os.getenv("CADDYFILE", DEFAULT_CADDYFILE)
    upstreams_conf = os.getenv("UPSTREAMS_CONF", DEFAULT_UPSTREAMS_CONF)
    log_file = os.getenv("LOG_FILE", None)

    # Ensure node_names matches node_ips length
    if len(node_names) < len(node_ips):
        node_names.extend([f"node-{i}" for i in range(len(node_names), len(node_ips))])

    logger = setup_logging(log_file)

    logger.info("=" * 60)
    logger.info("Node Registry Watcher — starting")
    logger.info("=" * 60)
    logger.info("Nodes: %s", ", ".join(f"{n} ({ip})" for n, ip in zip(node_names, node_ips)))
    logger.info("Port: %d", node_port)
    logger.info("Poll interval: %ds", poll_interval)
    logger.info("Caddy bin: %s", caddy_bin)
    logger.info("Caddyfile: %s", caddyfile)
    logger.info("Upstreams config: %s", upstreams_conf)
    logger.info("")

    last_master_key: Optional[str] = None  # "ip:port" of last known master

    while True:
        try:
            logger.info("Polling nodes...")
            master = determine_active_master(node_ips, node_port, node_names, logger)

            if master is None:
                logger.warning("No master detected — keeping last known config (if any)")
                logger.info("Sleeping %ds before retry...", poll_interval)
                time.sleep(poll_interval)
                continue

            current_key = f"{master.get('lan_ip')}:{master.get('port')}"

            if current_key == last_master_key:
                logger.info("Master unchanged: %s — no reload needed", current_key)
            else:
                logger.info(
                    "Master changed: %s → %s",
                    last_master_key or "(none)",
                    current_key,
                )

                # Generate and write new upstream config
                config_content = generate_upstream_config(master)
                if write_upstream_config(config_content, upstreams_conf, logger):
                    # Trigger Caddy reload
                    if reload_caddy(caddy_bin, caddyfile, logger):
                        last_master_key = current_key
                        logger.info("Failover complete — now routing to %s", current_key)
                    else:
                        logger.error("Caddy reload failed — will retry on next poll")
                else:
                    logger.error("Failed to write upstream config — will retry on next poll")

        except KeyboardInterrupt:
            logger.info("Received SIGINT — shutting down")
            sys.exit(0)
        except Exception as e:
            logger.error("Unexpected error in poll loop: %s", e, exc_info=True)

        logger.info("Sleeping %ds...", poll_interval)
        time.sleep(poll_interval)


if __name__ == "__main__":
    main()