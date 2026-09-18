#!/usr/bin/env bash
# Regenerate the README screenshot gallery.
#
#   ./docs/capture-screenshots.sh
#
# Starts the demo server if it is not already up, drives headless Chrome, and
# writes PNGs to docs/screenshots/. The demo reads ?theme= and ?palette= from
# the URL and ?chrome=off freezes entry animations, so every shot is
# deterministic.
set -euo pipefail

cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="http://localhost:4173/demo/"
OUT="docs/screenshots"
mkdir -p "$OUT"

[ -x "$CHROME" ] || { echo "Google Chrome not found at $CHROME"; exit 1; }

started=""
if ! curl -sf -o /dev/null --max-time 2 "$BASE"; then
  python3 -m http.server 4173 --directory plugins/navi-ui >/dev/null 2>&1 &
  started=$!
  sleep 1.5
fi
cleanup() { [ -n "$started" ] && kill "$started" 2>/dev/null || true; }
trap cleanup EXIT

# shot <file> <route> <palette> <theme> <width> <height> [scale-to-width]
shot() {
  local file=$1 route=$2 pal=$3 theme=$4 w=$5 h=$6 scale=${7:-}
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size="$w,$h" \
    --virtual-time-budget=4000 \
    --screenshot="$OUT/$file" \
    "$BASE?palette=$pal&theme=$theme&chrome=off#/$route" >/dev/null 2>&1
  [ -n "$scale" ] && sips -Z "$scale" "$OUT/$file" >/dev/null
  printf '  %-26s %s\n' "$file" "$(du -h "$OUT/$file" | cut -f1)"
}

echo "Hero"
shot overview-dark.png   overview harbor dark  1440 900 1200
shot overview-light.png  overview harbor light 1440 900 1200

echo "Palettes"
for p in harbor ember indigo moss plum graphite; do
  shot "palette-$p.png" overview "$p" dark 1280 800 640
done

echo "Screens"
shot customers.png   customers          harbor dark  1440 1000 1200
shot automations.png automations/AUT-01 harbor dark  1440 1500 1200
shot logs.png        logs               harbor light 1440 900  1200
shot components.png  components         harbor dark  1440 1100 1200

echo "done — $(du -sh $OUT | cut -f1) in $OUT"
