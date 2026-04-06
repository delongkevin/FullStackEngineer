#!/usr/bin/env python3
"""
Generate realistic app startup screenshot mockups for portfolio display.
Each mockup simulates a mobile app's splash/home screen at 390x844 (iPhone-style).
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
W, H = 390, 844  # Portrait mobile resolution

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def fnt(size, bold=False):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def draw_gradient(draw, w, h, top_color, bottom_color):
    for y in range(h):
        t = y / h
        c = lerp_color(top_color, bottom_color, t)
        draw.line([(0, y), (w, y)], fill=c)

def draw_status_bar(draw, w, fg=(255, 255, 255)):
    draw.rectangle([(0, 0), (w, 44)], fill=(0, 0, 0, 50))
    draw.text((16, 12), "9:41", fill=fg, font=fnt(14, bold=True))
    # Battery/signal dots
    for i in range(3):
        draw.ellipse([(w-26+i*8, 18), (w-20+i*8, 24)], fill=fg)

def draw_bottom_nav(img, draw, w, h, labels, active_idx, bg_color, active_color, text_color):
    nav_h = 82
    y0 = h - nav_h
    nav_bg = Image.new("RGBA", (w, nav_h), bg_color + (245,))
    img.paste(nav_bg, (0, y0), nav_bg)
    draw.line([(0, y0), (w, y0)], fill=(255, 255, 255, 40), width=1)
    slot_w = w // len(labels)
    for i, label in enumerate(labels):
        cx = i * slot_w + slot_w // 2
        color = active_color if i == active_idx else text_color
        r = 14
        if i == active_idx:
            draw.ellipse([(cx-r, y0+10), (cx+r, y0+10+r*2)], fill=active_color + (220,))
        else:
            draw.ellipse([(cx-r, y0+10), (cx+r, y0+10+r*2)], outline=text_color + (120,), width=2)
        tw = draw.textlength(label, font=fnt(11))
        draw.text((cx - tw//2, y0 + 46), label, fill=color, font=fnt(11))

def draw_card(draw, x, y, w, h, radius, fill, shadow=True):
    if shadow:
        draw.rounded_rectangle([(x+3, y+3), (x+w+3, y+h+3)], radius=radius, fill=(0, 0, 0, 40))
    draw.rounded_rectangle([(x, y), (x+w, y+h)], radius=radius, fill=fill)

def draw_pill(draw, x, y, w, h, fill):
    draw.rounded_rectangle([(x, y), (x+w, y+h)], radius=h//2, fill=fill)

def draw_avatar_circle(draw, cx, cy, r, fill, initial=""):
    draw.ellipse([(cx-r, cy-r), (cx+r, cy+r)], fill=fill)
    if initial:
        tw = draw.textlength(initial, font=fnt(14, bold=True))
        draw.text((cx - tw//2, cy - 9), initial, fill=(255, 255, 255), font=fnt(14, bold=True))

def tl(draw, txt, font_size=14, bold=False):
    """Text length helper."""
    return draw.textlength(txt, font=fnt(font_size, bold))

# ─── 1. Fitness Tracker ────────────────────────────────────────────────────────
def gen_fitness_tracker():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#0F172A"), hex_to_rgb("#1E3A5F"))
    draw_status_bar(draw, W)

    # Header
    draw.text((20, 60), "FitTrack Pro", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "Good morning, Kevin!", fill=(148, 163, 184), font=fnt(14))

    # Ring / Activity circle
    cx, cy, r = 195, 220, 80
    draw.ellipse([(cx-r, cy-r), (cx+r, cy+r)], outline=(30, 64, 175), width=14)
    bbox = [cx-r, cy-r, cx+r, cy+r]
    draw.arc(bbox, start=-90, end=173, fill=(99, 179, 237), width=14)
    draw.text((cx - 22, cy - 20), "73%", fill=(255, 255, 255), font=fnt(18, bold=True))
    draw.text((cx - 30, cy + 6), "Calories", fill=(148, 163, 184), font=fnt(12))

    # Stats row
    stats = [("2,450", "Steps"), ("847", "Cal"), ("4.2km", "Dist")]
    for i, (val, lbl) in enumerate(stats):
        x = 10 + i * 125
        draw_card(draw, x, 330, 115, 70, 12, (30, 41, 59))
        draw.text((x + 12, 342), val, fill=(99, 179, 237), font=fnt(16, bold=True))
        draw.text((x + 12, 366), lbl, fill=(148, 163, 184), font=fnt(12))

    # Workout cards
    draw.text((20, 418), "Today's Workouts", fill=(255, 255, 255), font=fnt(16, bold=True))
    workouts = [("Morning Run", "32 min  -  340 cal", (29, 78, 216)),
                ("Strength Training", "45 min  -  280 cal", (126, 34, 206)),
                ("Yoga Session", "20 min  -  120 cal", (6, 95, 70))]
    for i, (name, detail, color) in enumerate(workouts):
        y = 448 + i * 80
        draw_card(draw, 14, y, W-28, 65, 12, (22, 33, 48))
        draw.rectangle([(14, y), (22, y+65)], fill=color)
        draw.text((32, y + 14), name, fill=(255, 255, 255), font=fnt(14, bold=True))
        draw.text((32, y + 36), detail, fill=(100, 116, 139), font=fnt(12))

    draw_bottom_nav(img, draw, W, H, ["Home", "Workouts", "Stats", "Profile"], 0,
                    (15, 23, 42), (99, 179, 237), (100, 116, 139))

    img.convert("RGB").save(os.path.join(OUT_DIR, "fitness-tracker.png"), "PNG", optimize=True)
    print("✓ fitness-tracker.png")


# ─── 2. Finance Dashboard ──────────────────────────────────────────────────────
def gen_finance_tracker():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#064E3B"), hex_to_rgb("#111827"))
    draw_status_bar(draw, W)

    draw.text((20, 60), "FinanceIQ", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "Portfolio Overview", fill=(110, 231, 183), font=fnt(14))

    # Balance card
    draw_card(draw, 14, 112, W-28, 110, 16, (6, 78, 59))
    draw.text((30, 128), "Total Balance", fill=(167, 243, 208), font=fnt(13))
    draw.text((30, 150), "$48,291.50", fill=(255, 255, 255), font=fnt(26, bold=True))
    draw.text((30, 184), "+2.4%  this month", fill=(52, 211, 153), font=fnt(13))

    # Bar chart
    draw.text((20, 242), "Spending by Category", fill=(255, 255, 255), font=fnt(15, bold=True))
    cats = [("Housing", 0.38, (16, 185, 129)),
            ("Food & Dining", 0.22, (59, 130, 246)),
            ("Transport", 0.15, (245, 158, 11)),
            ("Other", 0.25, (139, 92, 246))]
    for i, (label, pct, color) in enumerate(cats):
        y = 268 + i * 52
        bar_w = int((W - 130) * pct)
        draw_card(draw, 14, y, W-28, 42, 8, (17, 24, 39))
        draw.text((22, y + 13), label, fill=(255, 255, 255), font=fnt(12))
        draw.rectangle([(22, y+30), (22+bar_w, y+38)], fill=color)
        pct_txt = f"{int(pct*100)}%"
        tw = tl(draw, pct_txt, 12)
        draw.text((W - tw - 20, y + 13), pct_txt, fill=(209, 213, 219), font=fnt(12))

    # Transactions
    draw.text((20, 490), "Recent Transactions", fill=(255, 255, 255), font=fnt(15, bold=True))
    txns = [("N", "Netflix", "Apr 5", "-$15.99", (239, 68, 68), (55, 20, 80)),
            ("S", "Salary Deposit", "Apr 1", "+$5,200", (52, 211, 153), (6, 78, 59)),
            ("G", "Grocery Store", "Mar 31", "-$87.42", (239, 68, 68), (55, 20, 80))]
    for i, (init, name, date, amt, amt_c, av_c) in enumerate(txns):
        y = 520 + i * 72
        draw_card(draw, 14, y, W-28, 60, 10, (17, 24, 39))
        draw_avatar_circle(draw, 44, y+30, 20, av_c, init)
        draw.text((76, y + 12), name, fill=(255, 255, 255), font=fnt(14, bold=True))
        draw.text((76, y + 34), date, fill=(107, 114, 128), font=fnt(12))
        tw = tl(draw, amt, 14, bold=True)
        draw.text((W - tw - 20, y + 22), amt, fill=amt_c, font=fnt(14, bold=True))

    draw_bottom_nav(img, draw, W, H, ["Home", "Budget", "Invest", "Profile"], 0,
                    (10, 15, 26), (52, 211, 153), (107, 114, 128))

    img.convert("RGB").save(os.path.join(OUT_DIR, "finance-tracker.png"), "PNG", optimize=True)
    print("✓ finance-tracker.png")


# ─── 3. Chat App ───────────────────────────────────────────────────────────────
def gen_chat_app():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#1E1B4B"), hex_to_rgb("#0F172A"))
    draw_status_bar(draw, W)

    draw.text((20, 60), "ConnectChat", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "Messages", fill=(165, 180, 252), font=fnt(14))

    # Search bar
    draw_card(draw, 14, 112, W-28, 44, 22, (30, 27, 75))
    draw.text((44, 126), "Search conversations...", fill=(99, 102, 241, 150), font=fnt(13))

    # Conversation list
    convos = [
        ("A", "Alice Johnson", "Hey! Are you free tonight?", "2m", True, (99, 102, 241)),
        ("T", "Team Alpha", "PR review is ready", "15m", True, (16, 185, 129)),
        ("B", "Bob Smith", "Sounds great, see you there", "1h", False, (245, 158, 11)),
        ("S", "Sarah K.", "The designs look awesome!", "3h", False, (239, 68, 68)),
        ("D", "David R.", "Can you send the report?", "1d", False, (139, 92, 246)),
        ("M", "Mom", "Call me when you can", "2d", False, (236, 72, 153)),
    ]
    for i, (init, name, msg, time_str, unread, color) in enumerate(convos):
        y = 170 + i * 80
        draw_card(draw, 8, y, W-16, 68, 12, (28, 24, 68) if unread else (18, 24, 48))
        draw_avatar_circle(draw, 44, y+34, 24, color, init)
        draw.text((80, y + 10), name, fill=(255, 255, 255), font=fnt(14, bold=True))
        draw.text((80, y + 34), msg[:34] + ("..." if len(msg) > 34 else ""), fill=(148, 163, 184), font=fnt(12))
        tw = tl(draw, time_str, 11)
        draw.text((W - tw - 14, y + 12), time_str, fill=(107, 114, 128), font=fnt(11))
        if unread:
            draw.ellipse([(W-30, y+40), (W-12, y+58)], fill=(99, 102, 241))

    draw_bottom_nav(img, draw, W, H, ["Chats", "Groups", "Calls", "Profile"], 0,
                    (15, 12, 38), (99, 102, 241), (107, 114, 128))

    img.convert("RGB").save(os.path.join(OUT_DIR, "chat-app.png"), "PNG", optimize=True)
    print("✓ chat-app.png")


# ─── 4. Real Estate Marketplace ────────────────────────────────────────────────
def gen_real_estate():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#1C1917"), hex_to_rgb("#2D2520"))
    draw_status_bar(draw, W, fg=(255, 255, 255))

    draw.text((20, 60), "HomeFind", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "Find your perfect home", fill=(214, 211, 209), font=fnt(14))

    # Search bar
    draw_card(draw, 14, 112, W-28, 48, 24, (41, 37, 36))
    draw.text((40, 128), "Search by city or ZIP code...", fill=(120, 113, 108), font=fnt(13))

    # Filter pills
    filters = [("All", True), ("For Sale", False), ("For Rent", False), ("New", False)]
    x_off = 20
    for label, active in filters:
        pill_w = int(tl(draw, label, 13)) + 24
        fill = (234, 179, 8) if active else (41, 37, 36)
        text_c = (0, 0, 0) if active else (214, 211, 209)
        draw_pill(draw, x_off, 176, pill_w, 30, fill)
        draw.text((x_off + 12, 182), label, fill=text_c, font=fnt(13))
        x_off += pill_w + 10

    # Featured properties
    draw.text((20, 224), "Featured Listings", fill=(255, 255, 255), font=fnt(16, bold=True))
    props = [
        ("$425,000", "3 bd  |  2 ba  |  1,850 sqft", "Austin, TX", (87, 83, 78), (68, 62, 56)),
        ("$1,200 / mo", "2 bd  |  1 ba  |  950 sqft", "Denver, CO", (60, 56, 52), (50, 46, 42)),
    ]
    for i, (price, details, loc, bg, img_bg) in enumerate(props):
        y = 256 + i * 175
        draw_card(draw, 14, y, W-28, 160, 14, bg)
        draw.rounded_rectangle([(20, y+8), (W-20, y+98)], radius=10, fill=img_bg)
        # House icon (simplified)
        cx_h = W // 2
        draw.polygon([(cx_h-30, y+60), (cx_h, y+30), (cx_h+30, y+60)], fill=(160, 150, 140))
        draw.rectangle([(cx_h-22, y+60), (cx_h+22, y+82)], fill=(140, 130, 120))
        draw.rectangle([(cx_h-8, y+66), (cx_h+8, y+82)], fill=(img_bg[0]-10, img_bg[1]-10, img_bg[2]-10))
        draw.text((26, y + 106), price, fill=(234, 179, 8), font=fnt(16, bold=True))
        draw.text((26, y + 128), details, fill=(214, 211, 209), font=fnt(12))
        draw.text((26, y + 146), f"  {loc}", fill=(161, 155, 150), font=fnt(12))

    draw_bottom_nav(img, draw, W, H, ["Search", "Saved", "Tours", "Profile"], 0,
                    (28, 25, 23), (234, 179, 8), (107, 114, 128))

    img.convert("RGB").save(os.path.join(OUT_DIR, "real-estate-marketplace.png"), "PNG", optimize=True)
    print("✓ real-estate-marketplace.png")


# ─── 5. Music Streaming App ────────────────────────────────────────────────────
def gen_music_streaming():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#18181B"), hex_to_rgb("#3B0764"))
    draw_status_bar(draw, W)

    draw.text((20, 60), "SoundWave", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "What's playing today?", fill=(216, 180, 254), font=fnt(14))

    # Now playing card
    draw_card(draw, 14, 110, W-28, 200, 18, (39, 10, 80))
    # Album art
    draw.rounded_rectangle([(30, 124), (128, 222)], radius=10, fill=(88, 28, 135))
    # Music note icon
    draw.ellipse([(72, 168), (88, 182)], fill=(216, 180, 254))
    draw.line([(88, 168), (88, 148), (102, 144), (102, 160)], fill=(216, 180, 254), width=3)
    draw.ellipse([(96, 160), (108, 170)], fill=(216, 180, 254))
    draw.text((144, 128), "Midnight Echoes", fill=(255, 255, 255), font=fnt(14, bold=True))
    draw.text((144, 150), "Aurora Dreams", fill=(167, 139, 250), font=fnt(12))
    # Progress bar
    draw.rounded_rectangle([(144, 180), (342, 186)], radius=3, fill=(55, 20, 100))
    draw.rounded_rectangle([(144, 180), (242, 186)], radius=3, fill=(167, 139, 250))
    draw.ellipse([(238, 177), (246, 189)], fill=(216, 180, 254))
    # Control buttons
    for bx, label in [(152, "<<"), (200, "||"), (248, ">>")]:
        draw.rectangle([(bx-12, 200), (bx+12, 218)], fill=(60, 25, 100))
        tw = tl(draw, label, 11, bold=True)
        draw.text((bx - tw//2, 204), label, fill=(216, 180, 254), font=fnt(11, bold=True))

    # Recently played
    draw.text((20, 330), "Recently Played", fill=(255, 255, 255), font=fnt(16, bold=True))
    songs = [("Electric Soul", "Neon City", "3:42"),
             ("Ocean Waves", "Chill Vibes", "4:15"),
             ("Run the Night", "Velocity", "2:58"),
             ("Lost in Space", "Cosmic Drift", "5:01")]
    colors = [(126, 34, 206), (29, 78, 216), (6, 95, 70), (157, 23, 77)]
    for i, (title, artist, dur) in enumerate(songs):
        y = 362 + i * 74
        draw_card(draw, 14, y, W-28, 62, 10, (30, 10, 52))
        draw.rounded_rectangle([(24, y+8), (78, y+54)], radius=8, fill=colors[i])
        # Music note in thumbnail
        draw.ellipse([(42, y+34), (50, y+42)], fill=(255, 255, 255, 200))
        draw.line([(50, y+34), (50, y+22), (58, y+20)], fill=(255, 255, 255, 200), width=2)
        draw.text((90, y + 12), title, fill=(255, 255, 255), font=fnt(14, bold=True))
        draw.text((90, y + 36), artist, fill=(167, 139, 250), font=fnt(12))
        tw = tl(draw, dur, 12)
        draw.text((W - tw - 18, y + 24), dur, fill=(107, 114, 128), font=fnt(12))

    draw_bottom_nav(img, draw, W, H, ["Home", "Search", "Library", "Profile"], 0,
                    (15, 5, 28), (167, 139, 250), (107, 114, 128))

    img.convert("RGB").save(os.path.join(OUT_DIR, "music-streaming.png"), "PNG", optimize=True)
    print("✓ music-streaming.png")


# ─── 6. Weather Insights App ───────────────────────────────────────────────────
def gen_weather_insights():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, W, H, hex_to_rgb("#0C4A6E"), hex_to_rgb("#1E3A8A"))
    draw_status_bar(draw, W)

    draw.text((20, 60), "WeatherInsights", fill=(255, 255, 255), font=fnt(22, bold=True))
    draw.text((20, 88), "Austin, Texas", fill=(186, 230, 253), font=fnt(14))

    # Sun icon
    cx_s, cy_s = 195, 165
    draw.ellipse([(cx_s-36, cy_s-36), (cx_s+36, cy_s+36)], fill=(250, 204, 21))
    for angle_deg in range(0, 360, 45):
        import math
        rad = math.radians(angle_deg)
        x1 = int(cx_s + 44 * math.cos(rad))
        y1 = int(cy_s + 44 * math.sin(rad))
        x2 = int(cx_s + 56 * math.cos(rad))
        y2 = int(cy_s + 56 * math.sin(rad))
        draw.line([(x1, y1), (x2, y2)], fill=(250, 204, 21), width=4)

    draw.text((cx_s - 30, cy_s + 50), "76°F", fill=(255, 255, 255), font=fnt(28, bold=True))
    draw.text((cx_s - 42, cy_s + 84), "Sunny & Clear", fill=(186, 230, 253), font=fnt(15))
    draw.text((cx_s - 66, cy_s + 106), "H: 82  L: 65    Humidity: 42%", fill=(125, 211, 252), font=fnt(12))

    # Stats row
    stats = [("Wind", "12 mph"), ("Rain", "0%"), ("UV Index", "High")]
    for i, (label, val) in enumerate(stats):
        x = 10 + i * 124
        draw_card(draw, x, 300, 112, 62, 12, (7, 89, 133))
        draw.text((x + 10, 310), label, fill=(186, 230, 253), font=fnt(11))
        draw.text((x + 10, 334), val, fill=(255, 255, 255), font=fnt(14, bold=True))

    # Hourly forecast
    draw.text((20, 382), "Hourly Forecast", fill=(255, 255, 255), font=fnt(15, bold=True))
    hours = [("Now", "76"), ("2 PM", "80"), ("4 PM", "78"), ("6 PM", "74"), ("8 PM", "68")]
    for i, (t, temp) in enumerate(hours):
        x = 10 + i * 74
        draw_card(draw, x, 408, 66, 80, 10, (7, 89, 133))
        draw.text((x + 8, 416), t, fill=(186, 230, 253), font=fnt(11))
        # Mini sun/cloud icon
        if int(temp) >= 76:
            draw.ellipse([(x+20, y2+7) if False else (x+20, 436), (x+46, 462)], fill=(250, 204, 21, 180))
        else:
            draw.ellipse([(x+18, 438), (x+48, 460)], fill=(148, 163, 184))
        draw.text((x + 10, 468), f"{temp}°", fill=(255, 255, 255), font=fnt(14, bold=True))

    # 5-day forecast
    draw.text((20, 508), "5-Day Forecast", fill=(255, 255, 255), font=fnt(15, bold=True))
    forecast = [("Monday", "82°", "65°"), ("Tuesday", "79°", "61°"),
                ("Wednesday", "70°", "58°"), ("Thursday", "75°", "62°"),
                ("Friday", "83°", "66°")]
    for i, (day, hi, lo) in enumerate(forecast):
        y = 536 + i * 48
        draw_card(draw, 14, y, W-28, 40, 8, (7, 89, 133, 140))
        draw.text((22, y + 10), day, fill=(255, 255, 255), font=fnt(13))
        # Color bar representing temp
        bar_x = W // 2 - 30
        draw.rounded_rectangle([(bar_x, y+16), (bar_x+60, y+24)], radius=4,
                                fill=lerp_color(hex_to_rgb("#3B82F6"), hex_to_rgb("#F59E0B"), i/4))
        hi_tw = tl(draw, hi, 13, bold=True)
        draw.text((W - hi_tw - 50, y + 10), hi, fill=(253, 220, 100), font=fnt(13, bold=True))
        lo_tw = tl(draw, lo, 13)
        draw.text((W - lo_tw - 14, y + 10), lo, fill=(186, 230, 253), font=fnt(13))

    draw_bottom_nav(img, draw, W, H, ["Today", "Forecast", "Alerts", "Settings"], 0,
                    (7, 60, 95), (56, 189, 248), (107, 114, 128))

    img.convert("RGB").save(os.path.join(OUT_DIR, "weather-insights.png"), "PNG", optimize=True)
    print("✓ weather-insights.png")


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    gen_fitness_tracker()
    gen_finance_tracker()
    gen_chat_app()
    gen_real_estate()
    gen_music_streaming()
    gen_weather_insights()
    print("\nAll 6 app screenshots generated successfully!")
