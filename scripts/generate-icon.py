#!/usr/bin/env python3
"""Generate Makrofy app icon — 1024x1024 PNG."""

from PIL import Image, ImageDraw, ImageFont
import math
import os

SIZE = 1024
CENTER = SIZE // 2

img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# ── Background: dark gradient circle (rounded square for iOS) ────────────
# iOS clips to rounded rect automatically, so we fill the full square
# Rich black background
bg_color = (9, 9, 11)  # zinc-950
draw.rectangle([0, 0, SIZE, SIZE], fill=bg_color)

# ── Subtle radial glow in center ─────────────────────────────────────────
for r in range(280, 0, -1):
    alpha = int(18 * (1 - r / 280))
    glow_color = (255, 255, 255, alpha)
    x0, y0 = CENTER - r, CENTER - r
    x1, y1 = CENTER + r, CENTER + r
    draw.ellipse([x0, y0, x1, y1], fill=glow_color)

# ── Macro ring arcs (protein=blue, carbs=amber, fat=pink) ────────────────
ring_cx, ring_cy = CENTER, CENTER + 20
ring_r = 340
ring_width = 48

def draw_arc(cx, cy, r, start_deg, end_deg, color, width):
    """Draw a thick arc."""
    bbox = [cx - r, cy - r, cx + r, cy + r]
    draw.arc(bbox, start_deg, end_deg, fill=color, width=width)

# Protein arc (top-right) — white/ice blue
draw_arc(ring_cx, ring_cy, ring_r, -90, 30, (255, 255, 255, 255), ring_width)

# Carbs arc (right-bottom) — soft amber
draw_arc(ring_cx, ring_cy, ring_r, 40, 150, (251, 191, 36, 255), ring_width)

# Fat arc (bottom-left) — soft rose
draw_arc(ring_cx, ring_cy, ring_r, 160, 250, (244, 114, 182, 255), ring_width)

# Subtle gap arc (left-top) — dim
draw_arc(ring_cx, ring_cy, ring_r, 260, -100, (63, 63, 70, 200), ring_width)

# ── Round end caps for arcs ──────────────────────────────────────────────
def draw_cap(cx, cy, r, angle_deg, color, cap_r):
    """Draw a circle at arc endpoint."""
    rad = math.radians(angle_deg)
    x = cx + r * math.cos(rad)
    y = cy + r * math.sin(rad)
    draw.ellipse([x - cap_r, y - cap_r, x + cap_r, y + cap_r], fill=color)

cap_r = ring_width // 2
draw_cap(ring_cx, ring_cy, ring_r, -90, (255, 255, 255, 255), cap_r)
draw_cap(ring_cx, ring_cy, ring_r, 30, (255, 255, 255, 255), cap_r)
draw_cap(ring_cx, ring_cy, ring_r, 40, (251, 191, 36, 255), cap_r)
draw_cap(ring_cx, ring_cy, ring_r, 150, (251, 191, 36, 255), cap_r)
draw_cap(ring_cx, ring_cy, ring_r, 160, (244, 114, 182, 255), cap_r)
draw_cap(ring_cx, ring_cy, ring_r, 250, (244, 114, 182, 255), cap_r)

# ── Bold "M" letter in center ────────────────────────────────────────────
# Try to load a bold system font
font = None
font_paths = [
    "/System/Library/Fonts/SFPro-Bold.otf",
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/SFCompact.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/Library/Fonts/SF-Pro-Display-Bold.otf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]

for fp in font_paths:
    if os.path.exists(fp):
        try:
            font = ImageFont.truetype(fp, 340)
            break
        except:
            continue

if font is None:
    font = ImageFont.load_default()

# Draw the M
letter = "M"
bbox = draw.textbbox((0, 0), letter, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = CENTER - tw // 2
ty = CENTER - th // 2 - 10  # slight upward offset

# White M with slight shadow
draw.text((tx + 3, ty + 3), letter, fill=(0, 0, 0, 80), font=font)
draw.text((tx, ty), letter, fill=(255, 255, 255, 255), font=font)

# ── Small calorie flame accent below M ───────────────────────────────────
flame_cx = CENTER
flame_cy = CENTER + 190

# Simple flame shape using polygons
flame_points_outer = [
    (flame_cx, flame_cy - 50),
    (flame_cx + 22, flame_cy - 15),
    (flame_cx + 18, flame_cy + 10),
    (flame_cx + 8, flame_cy + 25),
    (flame_cx, flame_cy + 30),
    (flame_cx - 8, flame_cy + 25),
    (flame_cx - 18, flame_cy + 10),
    (flame_cx - 22, flame_cy - 15),
]
draw.polygon(flame_points_outer, fill=(251, 146, 60, 255))  # amber-400

flame_points_inner = [
    (flame_cx, flame_cy - 25),
    (flame_cx + 10, flame_cy + 0),
    (flame_cx + 6, flame_cy + 15),
    (flame_cx, flame_cy + 20),
    (flame_cx - 6, flame_cy + 15),
    (flame_cx - 10, flame_cy + 0),
]
draw.polygon(flame_points_inner, fill=(253, 224, 71, 255))  # yellow-300

# ── Save ─────────────────────────────────────────────────────────────────
output_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(output_dir)

# Flatten to RGB (iOS requires no alpha for app icons)
final = Image.new("RGB", (SIZE, SIZE), bg_color)
final.paste(img, mask=img.split()[3])

# Save to multiple locations
icon_path = os.path.join(project_root, "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
final.save(icon_path, "PNG")
print(f"Saved: {icon_path}")

# Also save to public/ for PWA
pwa_path = os.path.join(project_root, "public/icon-512.png")
final.save(pwa_path, "PNG")
print(f"Saved: {pwa_path}")

# 192x192 for PWA manifest
pwa_192 = final.resize((192, 192), Image.LANCZOS)
pwa_192_path = os.path.join(project_root, "public/icon-192.png")
pwa_192.save(pwa_192_path, "PNG")
print(f"Saved: {pwa_192_path}")

# 180x180 for apple-touch-icon
apple_touch = final.resize((180, 180), Image.LANCZOS)
apple_touch_path = os.path.join(project_root, "public/apple-touch-icon.png")
apple_touch.save(apple_touch_path, "PNG")
print(f"Saved: {apple_touch_path}")

print("Done!")
