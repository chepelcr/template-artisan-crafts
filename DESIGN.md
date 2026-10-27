# Artisan Crafts — design plan

**Concept: Carreta pintada.** The store is a bright workshop with the colours
of a painted Sarchí oxcart. The one bold thing is the cart's wheel: a painted
rosette whose ring turns as the page scrolls, with the hero photo held still
in its hub. Everything else borrows the cart's trim: bands of painted teeth in
each category's own colours, and a small still rosette as the mark and the
section divider.

Serves: artisans, potters, woodworkers, weavers, souvenir shops, and
workshops or classes sold as services.

## Palette

| Token | Hex | Role |
|---|---|---|
| white | `#FBFAF6` | page (bright, not cream) |
| sand | `#F3EEE2` | quiet surfaces, the piece's facts |
| carreta red | `#C62828` | the store's accent (org primary): main buttons, offers |
| sun | `#F2B91B` | active navigation, the cart count, highlights |
| cobalt | `#1E49A6` | footer, CTA block, strong buttons, the demo notice |
| leaf | `#2F8F4E` | paint only (wheel, bands, medallions) |
| ink | `#1D1B19` | text |

Contrast (computed): ink on white 16.4:1 · soft ink `#5E5750` on white
6.8:1, on sand 6.1:1 · red on white 5.4:1 (offers and small labels) · white on
red 5.6:1 · ink on sun 9.6:1 · white on cobalt 7.9:1 · sun on cobalt 4.6:1.
Category panels and bands take the category's colours from the POS; the name
(large text) uses `onColor`, and counts sit on a white pill so they always
read.

## Type

**Alegreya** (500–900) for display and prices — a calligraphic serif with
hand-made warmth, set heavy — and **Alegreya Sans** for text at 18 px. No
all-caps eyebrows, no monospace labels.

## Layout

```
HOME
 header + band of painted teeth (red · sun · cobalt · leaf)
┌──────────────────────────────┬──────────────────────────────────────┐
│ (sun pill) Hecho a mano       │        ╭── painted wheel ──╮          │
│ Piezas con el color           │       │  ring turns with   │         │
│ de la carreta                 │       │  scroll; CMS photo │         │
│ [Ver las piezas] [Visitar]    │        ╰── still in hub ───╯          │
└──────────────────────────────┴──────────────────────────────────────┘
 Del taller: category panels in the category's colour, photo medallion,
 name, count pill ×5        ──── rosette ────
 Piezas nuevas: white boards with a painted band, 4 across
 benefits: painted medallions · story photo between two bands · cobalt CTA
CATALOG: title + count │ search + Filtros (sheet on phones; inline type,
offers, order) │ chips with the category's colour dot │ groups under a
painted bar in the category's colours, or a flat grid when filtered
PRODUCT: square photo under the category band │ name, price in Alegreya,
text, facts (category, type, duration, level, availability), add
```

## Signature

`Wheel` (`src/components/Wheel.tsx`): one SVG — rim, sun band with 32 teeth,
16 petals, leaf diamonds, a dotted cobalt ring — whose ring group turns with
`scrollY`. One rAF per scroll burst, only while the wheel is on screen
(IntersectionObserver); with reduced motion (setting or `?motion=reduce`) the
listener is never attached and the wheel stays still. No WebGL in this
template.

Other motion answers an action: boards lift on hover, the bag turns a quarter
when something is added, sheets slide. No section fade-ups.

## Changed from the generic default

- Left "cream + high-contrast serif + terracotta": bright white, the cart's
  saturated folk colours, a calligraphic serif.
- No hero photo-only page: the photo lives inside the wheel.
- Categories are painted panels from the category's own colour, image and
  name — no hard-coded lists, no name-to-icon maps.
