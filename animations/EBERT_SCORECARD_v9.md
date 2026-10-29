# EBERT ZERO-TRUST SCORECARD — Gillsystems Commander Hermes Mesh
Artifact: animations/Gillsystems_Commander_Hermes_Animation_v9.html (final build v9.8)
Gate: weighted >= 6.2 / 7.0, no rounding. Judge: Qwen3.8-27B Turbo Brilliance (Main 10.0.0.164), vision, 8 screenshots per pass.

## VERDICT: REJECT — median 5.45 / 7.0 (best single pass 6.05)

### Pass history (same artifact, defect-fix rounds)
| round | weighted | what changed |
|---|---|---|
| v9.0 | 5.05 | first build: 31 seats / 30 agents, ranks wrong-free but header stats stale |
| v9.1 | 5.55 | header stat fixed, mesh rows injected, label clamp |
| v9.2 | 4.95 | rank + Agent #1 + command chain landed on canvas |
| v9.3 | 4.95 | legend to top, rail overflow 0 measured, true mobile emulation (CDP) |
| v9.4 | 5.25 | FOC tied to narrow axis, mobile sub-labels culled, LAYERS grid |
| v9.5 | 5.95 | labels abbreviated, portrait relief (dist 68), collision culls |
| v9.6 | 6.05 | mobile anchor 0.68, hub title lifted, header clamp |
| v9.8 med | 5.45 | node-name stagger, per-node detail lines culled on phones |

### Median axis profile (4 independent samples, v9.8)
| axis | weight | median | read |
|---|---|---|---|
| Truthfulness | 20 | 6.5 | **correct** — Adam #1, Planck class-only, chain and audit honest |
| Technical | 15 | 6.0 | zero external deps, 0px rail overflow, 31 seats at all 8 viewports |
| Brand | 5 | 5.5 | identity present, not distinctive |
| First-Impression | 5 | 5.5 | dense |
| Interaction | 10 | 5.5 | inspector + drawer work; hover/click affordances thin |
| Visual Craft | 25 | 5.0 | pseudo-3D reads as diagram, not a scene |
| **Clarity** | 20 | **4.0** | **structural blocker** |

### Why it fails
Clarity is 4/7 in every sample. Culling labels did not move it: the scene carries ~35 on-canvas text labels competing with each other inside a projected pseudo-3D field. That is a design problem, not a bug. Reaching 6.2 requires the on-canvas label count to drop and the hierarchy to move into the HUD (select-to-reveal), plus a visual-craft pass on materials/lighting — not another label patch.

### Real defects remaining (honest)
- Phone scene: 4 node names + hub title still share a compressed band even after staggering.
- 1280x800: rail occupies ~29% of width and crowds the mesh.
- Adam inspector prints class SPECIALIST — accurate to ROSTER but reads like a rank next to "Agent #1".

### What IS verified working
- 31 seats / 30 agents / 4 nodes at every viewport (measured in-page, not asserted).
- Agent #1 = Adam; Planck = Super Agent (class), not #1; command chain Hermes→Theo→Liara→Planck→Architect→Orchestrator + Sentinel audit — visible in the fixed command bar at all 8 viewports.
- Single file, zero external dependencies, no network calls, no IPs/paths leaked.
- Rail scroll overflow 0px at 1920x1080, 1600x1000, 1280x800, 390x844, 430x932, 1200x1600.

**NOT PUBLISHED.** No site deploy, no push — held for Commander review per standing order.
