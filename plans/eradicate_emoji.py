"""Gillsystems site-wide emoji eradication.

Commander directive 2026-09-30:
  "WE NEED ALL EMOJI BULLSHIT AI ICONS READICATED IMMEDIATELY"
  "EMOJIS SAYS VIBE CODING PUSSY, NOT SYSTEMS ARCHITECT"

Replaces emoji with the real Gillsystems vendor-mark sprite. Preserves arrows
(U+2190/U+2192) and plain typographic glyphs -- those are punctuation in prose,
not icons. Every emoji gets a REAL vendor logo appropriate to its meaning.

Idempotent: safe to re-run.
"""
import re, os, sys, json

G = r"C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net"
SPRITE_TXT = os.path.join(G, "plans", "icons", "_sprite.txt")

# ---- emoji -> real vendor mark -------------------------------------------
# keyed by codepoint(s). Order matters: longer sequences first.
MAP = {
    # --- hardware / platform ---
    "\U0001F4BB": "am-desktop",      # 💻 laptop
    "\U0001F5A5\uFE0F": "am-monitor",  # 🖥️ desktop
    "\U0001F5A5": "am-monitor",
    "\U0001F4FA": "am-monitor",      # 📺 tv -> monitor
    "\U0001F3AE": "am-steamos",      # 🎮 gamepad -> SteamOS
    "\U0001F4F1": "am-phone",        # 📱 phone
    "\U0001F5B1\uFE0F": "am-desktop",  # 🖱 mouse
    "\U0001F5B1": "am-desktop",
    # --- software / brand ---
    "\U0001F916": "am-mesh",         # 🤖 robot -> mesh network
    "\U0001F9ED": "am-compass",      # 🧭 compass
    "\U0001F527": "am-gear",         # 🔧 wrench
    "\U0001F9F9": "am-spark",        # 🧹 broom
    "\U0001F4E6": "am-courier",      # 📦 package
    "\U0001F50D": "am-search",       # 🔍 magnifier
    "\U0001F512": "am-lock",         # 🔒 lock
    # --- comms ---
    "\U0001F4E7": "am-gchat",        # 📧 email
    "\U0001F4DE": "am-phone",        # 📞 phone
    "\U0001F4AC": "am-docs",         # 💬 speech balloon
    "\U0001F4C8": "am-radar",        # 📈 chart
    # --- business / concept ---
    "\U0001F4BC": "am-herald",       # 💼 briefcase
    "\U0001F4AA": "am-rocket",       # 💪 muscle
    "\U0001F4B8": "am-gear",         # 💸 money wings
    "\U0001F3E2": "am-desktop",      # 🏢 office
    "\U0001F3D7": "am-courier",      # 🏗 construction
    "\U0001F393": "am-book",         # 🎓 graduation cap
    "\U0001F464": "am-courier",      # 👤 bust
    "\U0001F4CA": "am-radar",        # 📊 bar chart
    "\U0001F4C9": "am-radar",        # 📉
    # --- status / misc ---
    "\u26A1": "am-radeon",           # ⚡ high voltage -> Radeon
    "\u274C": "am-lock",             # ❌ cross mark
    "\u2705": "am-qa",               # ✅ check
    "\u26A0": "am-shield",           # ⚠ warning
    "\U0001F525": "am-radeon",       # 🔥 fire
    "\U0001F4A5": "am-rocket",       # 💥 collision
    "\U0001F680": "am-rocket",       # 🚀 rocket
    "\U0001F48E": "am-diamond",      # 💎 gem
    "\U0001F3AF": "am-likert",       # 🎯 target
    "\U0001F3D7\uFE0F": "am-courier",
    "\U0001F95A": "am-qa",           # 🥚 egg
    "\u2601": "am-cloud",            # ☁ cloud
    "\U0001F5FD": "am-docs",         # 🗽 scroll
    "\U0001F4D6": "am-docs",         # 📖 book
    "\U0001F4DA": "am-docs",         # 📚 books
    "\U0001F310": "am-mesh",         # 🌐 globe
    "\u23F0": "am-cron",             # ⏰ alarm clock
    "\u26F1": "am-cloud",            # 🌧 rain
    "\U0001F308": "am-compass",      # 🌈 rainbow
    "\U0001F30D": "am-compass",      # 🌍 globe
    # --- games / misc ---
    "\U0001F480": "am-debug",        # 💀 skull
    "\U0001F47D": "am-helm",         # 👽 alien
    "\U0001F920": "am-courier",      # 🤠 cowboy
    "\U0001F3B5": "am-monitor",      # 🎵 music
    "\U0001F335": "am-steamos",      # 🌵 cactus
    "\u2764": "am-docs",             # ❤ heart
    "\U0001F52B": "am-debug",        # 🔫 water pistol
    "\U0001F60A": "am-helm",         # 😊 smile
}

EMOJI_RE = re.compile(
    "|".join(
        re.escape(k) + r"\uFE0F?"
        for k in sorted(MAP, key=len, reverse=True)
    )
)


def svg(icon_id, size=1.15):
    return (
        f'<svg class="gs-ic" style="width:{size}em;height:{size}em;'
        f'vertical-align:middle;display:inline-block" aria-hidden="true">'
        f'<use href="#{icon_id}"/></svg>'
    )


def process(path, sprite):
    rel = os.path.relpath(path, G).replace("\\", "/")
    h = open(path, encoding="utf-8", errors="replace").read()
    if "<symbol" in h:
        return None  # already has sprite
    original = h

    # record which icons this page will use
    used = set()

    def rep(m):
        icon = MAP[m.group(0).rstrip("\uFE0F")] if m.group(0).rstrip("\uFE0F") in MAP else None
        if icon is None:
            for k in sorted(MAP, key=len, reverse=True):
                if m.group(0).startswith(k):
                    icon = MAP[k]
                    break
        if icon is None:
            return m.group(0)
        used.add(icon)
        return svg(icon)

    h = EMOJI_RE.sub(rep, h)
    leftover = re.findall(r"[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF]", h)

    if h == original:
        return None

    # inject FULL sprite before </head> (simpler & safe; 38KB)
    if "</head>" in h:
        h = h.replace("</head>", sprite + "\n</head>", 1)
    else:
        h = sprite + "\n" + h

    open(path, "w", encoding="utf-8").write(h)
    return {
        "file": rel,
        "replaced": len(EMOJI_RE.findall(original)),
        "icons_used": sorted(used),
        "leftover_emoji": len(leftover),
    }


def main():
    sprite = open(SPRITE_TXT, encoding="utf-8").read().replace(
        'focusable="false">',
        'focusable="false" xmlns="http://www.w3.org/2000/svg">',
    )
    files = sorted(
        os.path.join(G, f)
        for f in os.listdir(G)
        if f.endswith(".html") and f not in ("ai-era.html",)
    )
    results = []
    for f in files:
        r = process(f, sprite)
        if r:
            results.append(r)
    print(json.dumps(results, indent=1))
    tot = sum(r["replaced"] for r in results)
    left = sum(r["leftover_emoji"] for r in results)
    print(f"\nFILES TOUCHED: {len(results)}   EMOJI REPLACED: {tot}   LEFTOVER: {left}")


if __name__ == "__main__":
    main()