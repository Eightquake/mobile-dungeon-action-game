#!/bin/sh
# Renders the game icon (public/icons/icon.svg) to the PNG sizes the manifest and iOS need (UC-012 step 6).
# Needs rsvg-convert (librsvg). Run after changing the SVG and commit the PNGs.
set -eu
cd "$(dirname "$0")/../public/icons"
for size in 180 192 512; do
  rsvg-convert -w "$size" -h "$size" icon.svg -o "icon-$size.png"
done
