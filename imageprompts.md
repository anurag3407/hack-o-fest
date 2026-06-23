# HACK-O-FEST — Hero Image Prompts

Drop generated files at the listed paths and they'll be picked up automatically.
All hero art is consumed by `components/hero/HeroExperience.tsx`.

Generate with agy directly, e.g.:

> Generate an image for: <paste a prompt below>

Then save/copy the result to the target path.

---

## 1. Hero nebula backdrop — **ACTIVE** (already generated & placed)

- **Path:** `public/img/hero/hero-bg.jpg`
- **Aspect:** 16:9, at least 1920×1080 (2560×1440 preferred)
- **Used by:** beats 0–2 (HERO / ABOUT / STATS) as the fixed backdrop behind the suit.

**Prompt:**

```
A cinematic, premium hero-section background for a Marvel-homage hackathon.
Ultra-detailed atmospheric concept art, 16:9, dark and moody. A deep void-black
field transitioning into deep royal purple and crimson nebula toward the top.
Volumetric god-rays and soft cinematic haze. A concentrated warm gold + arc-reactor
cyan energy glow low in the CENTER-BOTTOM of the frame, as if a powerful light
source rests on the ground center. Faint floating embers and energy particles.
Subtle hexagonal Tony-Stark HUD circuitry etched faintly into the darkness at the
sides. Keep the lower-center area relatively clear (negative space) so a 3D
character can stand there. NO text, NO words, NO logos, NO characters or people
or robots — only environment and atmosphere.
```

---

## 1b. Gold workshop backdrop (beat 1 · ABOUT) — **ACTIVE**

- **Path:** `public/img/hero/hero-gold.jpg`
- **Used by:** beat 1 (the suit slides right; copy on the left), cross-faded in.

**Prompt:**

```
A cinematic hero-section background for a Marvel-homage hackathon. Ultra-detailed
atmospheric concept art, 16:9, dark and moody. A warm GOLD and amber energy
environment — an abstract Tony-Stark-workshop / arc-reactor-laboratory vibe: deep
black base, glowing molten-gold volumetric light with rising embers, faint
hexagonal HUD circuitry and holographic blueprint lines etched in gold, soft
cinematic god-rays and haze. Keep the RIGHT third darker/clearer (negative space)
so a 3D character can stand there; concentrate the gold glow toward center-left.
NO text, NO words, NO logos, NO characters, NO people, NO robots.
```

---

## 1c. Cyan data-grid backdrop (beat 2 · STATS) — **ACTIVE**

- **Path:** `public/img/hero/hero-cyan.jpg`
- **Used by:** beat 2 (the suit slides left; copy on the right), cross-faded in.

**Prompt:**

```
A cinematic hero-section background for a Marvel-homage hackathon. Ultra-detailed
atmospheric concept art, 16:9, dark and moody. A cool CYAN and electric-blue
holographic data environment: deep black base, glowing cyan volumetric light,
faint streams of floating holographic data and particles, a subtle perspective
grid receding into darkness, arc-reactor-blue energy haze, hexagonal HUD circuitry
in blue. Keep the LEFT third darker/clearer (negative space) so a 3D character can
stand there; concentrate the cyan glow toward center-right. NO text, NO words, NO
logos, NO characters, NO people, NO robots.
```

---

## 2. Resting / landing backdrop — **ACTIVE** (using provided `resting_image.jpg`)

- **Path:** `public/img/hero/resting.jpg`
- **Currently:** the provided Hall-of-Armor photo, copied in.
- **Used by:** beat 3 (REST), cross-faded in over the final third of the scroll as
  the suit settles to center for its "natural landing".

**Regen prompt (if you want a cleaner, centered plate):**

```
Interior of Tony Stark's "Hall of Armor": a dark, polished basement gallery with a
circular metal dais in the center and softly back-lit glass display alcoves along a
curved back wall. Cinematic, moody, cool blue-white rim lighting with warm gold
accents, glossy reflective black floor, shallow depth of field. Symmetrical, the
CENTER of the frame is an empty lit platform (no armor in the center slot) so a 3D
character can stand there. Photoreal, 16:9. NO text, NO logos, NO visible people.
```

---

## 3. (Optional) Vertical / mobile nebula crop

- **Path:** `public/img/hero/hero-bg-portrait.jpg` (not yet wired)
- **Aspect:** 9:16. Same art direction as #1 but composed vertically, energy glow
  centered around 70% height. Wire into `HeroExperience` with a media query if you
  want a tighter mobile composition.

```
Same as the hero nebula backdrop but composed for a 9:16 vertical phone screen:
the gold + cyan ground glow sits at ~70% height with clear negative space above it,
purple/crimson nebula across the top third, HUD circuitry faint at the vertical
edges. NO text, NO characters.
```
