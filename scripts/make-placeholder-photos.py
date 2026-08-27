#!/usr/bin/env python3
"""
Generates the warm tonal stand-ins in /public/photos.

These are NOT pictures of animals and are not trying to be. They are soft,
slightly out-of-focus warm fields, keyed to the palette, so that layout,
type and contrast can all be judged at full size while the real photographs
are still being gathered.

Delete this script and the SVGs once real photography is in place, and remove
`placeholder: true` from PHOTOS in lib/content.ts.
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "photos"

# name: (w, h, base, mid, deep)
PLATES = {
    "hero":    (1600, 1000, "#E8DCCF", "#D9C7B5", "#C9AE99"),
    "buddy":   (1000, 1250, "#EFE3D6", "#E0CDB8", "#C8A98F"),
    "milo":    (1000, 1250, "#E4D9CE", "#D2C1B0", "#B9A38F"),
    "luna":    (1000, 1250, "#EAE2D8", "#DAD0C3", "#C2B5A6"),
    "charlie": (1000, 1250, "#ECDED2", "#DCC8B6", "#C4A793"),
}


def plate(name, w, h, base, mid, deep):
    cx, cy = w / 2, h / 2
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="Warm tonal placeholder">
  <defs>
    <radialGradient id="v-{name}" cx="50%" cy="42%" r="72%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30"/>
      <stop offset="62%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#5A4A3C" stop-opacity="0.16"/>
    </radialGradient>
    <filter id="b-{name}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="{int(min(w, h) * 0.085)}"/>
    </filter>
    <filter id="g-{name}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="{w}" height="{h}" fill="{base}"/>

  <!-- soft out-of-focus forms, like light falling across a room -->
  <g filter="url(#b-{name})" opacity="0.95">
    <ellipse cx="{cx * 0.62:.0f}" cy="{cy * 1.34:.0f}" rx="{w * 0.44:.0f}" ry="{h * 0.36:.0f}" fill="{mid}"/>
    <ellipse cx="{cx * 1.46:.0f}" cy="{cy * 0.58:.0f}" rx="{w * 0.34:.0f}" ry="{h * 0.28:.0f}" fill="{deep}" opacity="0.55"/>
    <ellipse cx="{cx * 1.1:.0f}" cy="{cy * 1.62:.0f}" rx="{w * 0.3:.0f}" ry="{h * 0.2:.0f}" fill="{deep}" opacity="0.4"/>
  </g>

  <rect width="{w}" height="{h}" fill="url(#v-{name})"/>
  <rect width="{w}" height="{h}" filter="url(#g-{name})" opacity="0.11" style="mix-blend-mode:multiply"/>
</svg>
"""


OUT.mkdir(parents=True, exist_ok=True)
for name, (w, h, base, mid, deep) in PLATES.items():
    p = OUT / f"{name}.svg"
    p.write_text(plate(name, w, h, base, mid, deep))
    print(f"  {p.name}  {p.stat().st_size // 1024}KB")
print("done")
