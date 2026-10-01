#!/usr/bin/env python3
"""
Gillsystems pre-publish integrity gate.

The Commander's page shipped with TWO complete HTML documents in one file and a
second live canvas running beside the first. It looked fine to every automated
check in this repo because none of them counted document elements. This gate
exists so that class of corruption can never ship again.

Run from the repo root:  python plans/preship_gate.py
Exit 0 = safe to publish. Exit 1 = DO NOT PUBLISH.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Archive is excluded on purpose: superseded files are allowed to be odd.
SKIP_DIRS = {".git", "archive", "node_modules", ".vs", "__pycache__"}
# Arrows (U+2190-21FF) are navigation glyphs used deliberately on the era pages,
# not emoji icons. Excluded on purpose - the directive targets emoji ICONS.
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]"
)
VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr"}
CHECK_TAGS = ["div","section","article","button","span","p","ul","li","nav",
              "header","footer","main","table","tr","td","form","label"]

def html_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for f in filenames:
            if f.lower().endswith((".html", ".htm")):
                yield os.path.join(dirpath, f)

def check(path):
    errs = []
    with open(path, encoding="utf-8", errors="replace") as fh:
        h = fh.read()
    rel = os.path.relpath(path, ROOT)

    # 1. SINGLE DOCUMENT. The bug that shipped.
    # A fragment (sprite preview, embeddable piece) has no document at all.
    # That is legitimate. The failure mode is MORE THAN ONE, never zero.
    is_fragment = "<html" not in h.lower()
    for tag in ("html", "head", "body"):
        n_open = len(re.findall(rf"<{tag}[\s>]", h))
        n_close = len(re.findall(rf"</{tag}>", h))
        if n_open > 1 or n_close > 1:
            errs.append(f"{rel}: {n_open} <{tag}> / {n_close} </{tag}> - DUPLICATE DOCUMENT")
        elif n_open == 0 and not is_fragment:
            errs.append(f"{rel}: no <{tag}> element")

    # 2. NO TRUNCATED TAGS from a bad splice. The artefact was a closing tag
    #    cut in half, leaving "E html>". The match text itself begins with the
    #    stray letter, so inspect what precedes the WHOLE match.
    for m in re.finditer(r"([^\s])\s+html>", h):
        if m.group(1) != "E":
            continue
        lead = h[max(0, m.start() - 80):m.start() + 1]
        if "<!DOCTYPE" in lead:
            continue
        errs.append(f"{rel}: truncated tag fragment '{m.group(0).strip()}' from a broken splice")

    # 3. TAG BALANCE.
    for tag in CHECK_TAGS:
        o = len(re.findall(rf"<{tag}[\s>]", h))
        c = len(re.findall(rf"</{tag}>", h))
        if o != c:
            errs.append(f"{rel}: <{tag}> {o} open / {c} close - UNBALANCED")

    # 4. DUPLICATE IDS. A repeated id silently breaks getElementById wiring.
    ids = re.findall(r'\sid="([^"]+)"', h)
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        errs.append(f"{rel}: duplicate ids {sorted(dupes)[:6]}")

    # 5. NO EAGER THIRD-PARTY IFRAME. YouTube must be behind a facade.
    for m in re.finditer(r"<iframe[^>]*src=[\"']([^\"']+)[\"']", h, re.S | re.I):
        src = m.group(1)
        if re.search(r"youtube\.com/embed|youtube-nocookie\.com/embed|vimeo|twitch", src, re.I):
            errs.append(f"{rel}: eager third-party iframe {src[:60]} - use a facade")

    # 6. DUPLICATE INLINE SPRITE (a bad splice inlined it twice).
    sprites = len(re.findall(r'<svg width="0" height="0"', h))
    if sprites > 1:
        errs.append(f"{rel}: {sprites} inline sprite blocks - should be 1")

    # 7. SVG SYMBOLS ALL RESOLVE.
    defined = set(re.findall(r'<symbol id="([^"]+)"', h))
    used = {u for u in re.findall(r'<use href="#([^"]+)"', h) if "$" not in u and "+" not in u}
    missing = used - defined
    if missing:
        errs.append(f"{rel}: unresolved svg symbols {sorted(missing)[:6]}")

    # 8. NO EMOJI.
    hits = EMOJI.findall(h)
    if hits:
        errs.append(f"{rel}: {len(hits)} emoji found {hits[:8]}")

    return rel, len(h), errs

def main():
    files = sorted(html_files())
    if not files:
        print("no html found")
        return 1
    total_err = 0
    print(f"GILLSYSTEMS PRE-PUBLISH GATE - {len(files)} files\n" + "=" * 62)
    for path in files:
        rel, size, errs = check(path)
        if errs:
            total_err += len(errs)
            print(f"\nFAIL {rel} ({size:,} B)")
            for e in errs:
                print(f"       - {e}")
        else:
            print(f"  ok  {rel} ({size:,} B)")
    print("=" * 62)
    if total_err:
        print(f"RESULT: {total_err} PROBLEM(S). DO NOT PUBLISH.")
        return 1
    print("RESULT: all clean. Safe to publish.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
