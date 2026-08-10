# Blackhole cursor with starfield gravity warp

## Problem

The portfolio already has a strong space theme (`StarBackground.js` rotating
starfield, `warp-jump` hyperspace burst on route changes, `BlackholeBackground`
hero video). The mouse cursor is still a plain OS arrow. We want the cursor
itself to read as a small blackhole, and to visibly warp the space around it —
nearby stars in the existing starfield should bend/pull toward it as the user
moves the mouse.

## Scope

- Desktop only (`pointer: fine`). Skipped entirely on touch devices.
- Skipped entirely when `prefers-reduced-motion: reduce` is set.
- Site-wide: mounted once alongside `StarBackground`, so it's active on every
  route without per-page wiring.
- Out of scope: warping/distorting actual DOM content (text, images, cards).
  Only the existing three.js starfield reacts. No new WebGL context, no SVG
  displacement filters on the DOM.

## Architecture

Two new pieces, one new component:

1. **`SpaceCursor.js`** (new) — renders the blackhole cursor graphic and owns
   the raw mouse-position tracking. Mounted once in `App.js` next to
   `StarBackground`.
2. **`StarBackground.js`** (extended) — reads the shared cursor-position ref
   inside its existing `requestAnimationFrame` loop and applies a per-frame
   gravity offset to stars near the cursor, on top of the existing base
   rotation. No second scene/loop.

Activation gate, computed once at module load:

```js
const SPACE_CURSOR_ENABLED =
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

When `false`, neither the cursor graphic nor the pull logic runs — default OS
cursor stays, `StarBackground` behaves exactly as it does today.

Communication between the two components is a module-level mutable object
(not React state, to avoid re-render thrash on every `mousemove`):

```js
// src/lib/spaceCursorState.js (new, tiny)
export const cursorState = { x: 0, y: 0, active: false };
```

`SpaceCursor` writes to it on `mousemove`/`mouseleave`; `StarBackground`'s
existing rAF loop reads it each frame. Mirrors the existing `warp-jump`
window-event pattern already used between `RouteWarpTrigger` and
`StarBackground`, just via a shared object instead of an event (this needs
continuous per-frame reads, not a discrete trigger).

## Cursor graphic

- ~18px `div`, `position: fixed`, `pointer-events: none`, high `z-index`.
- Visual: black core circle (~40% of diameter) + thin warm-white/orange ring
  (`#ffddaa`, matching the existing warp-streak color) + soft outer glow via
  `box-shadow` blur. Pure CSS, no images/canvas.
- Motion: position updates via `requestAnimationFrame`, lerped toward the raw
  mouse position (~0.2 factor per frame) rather than snapped directly, so it
  trails slightly — reads as mass with inertia, not a glued-on dot.
- Native cursor: `body { cursor: none }` applied only when
  `SPACE_CURSOR_ENABLED` is true, so JS-disabled or gated-out users always
  keep a normal cursor.
- Fade out (`opacity` transition) on `document` `mouseleave`; fade back in on
  `mouseenter`/first `mousemove`.

## Star gravity pull

Inside `StarBackground`'s existing `animate()` loop, after the base rotation
is applied and before render:

- Cursor position converted to the same normalized scene space the star
  sphere lives in.
- Pull radius: ~0.35 in that normalized space (scales with viewport since the
  star sphere itself is viewport-relative).
- For each star inside the radius: pull vector = direction from star toward
  cursor point, magnitude weighted by `(1 - dist/radius)^2` (sharp falloff
  near the center, per "subtle pull" — most stars barely move, only ones
  close to the cursor bend noticeably).
- Offset is added on top of the star's existing rest position each frame, not
  written back permanently — so it self-heals the instant the cursor moves
  away or the feature deactivates. No drift accumulation.
- Max offset capped so a star can visibly bend but never actually reach/pass
  through the cursor point.
- Fully orthogonal to the existing `warp-jump` streak logic — both read/write
  different parts of the position buffer math, both can run at once (e.g.
  user has mouse near a star mid-hyperspace-jump).
- When `cursorState.active` is `false` (mouse off-window, or feature gated
  off), pull contribution is simply skipped — no separate cleanup path
  needed.

## Lifecycle & cleanup

- `SpaceCursor` follows the same effect-cleanup pattern already used in
  `StarBackground`/`RouteWarpTrigger`: listeners added in `useEffect`, removed
  in its cleanup function.
- No new WebGL context, no new rAF loop — reuses `StarBackground`'s existing
  one, so no additional per-frame cost beyond the pull-radius math (cheap:
  early-`continue` for stars outside the radius, checked once per star per
  frame).
- `StarBackground`'s own resize/dispose handling is untouched.

## Testing

Manual, in the browser preview:

- Confirm blackhole cursor graphic renders and trails the mouse smoothly.
- Confirm stars within the pull radius visibly bend toward the cursor as it
  moves, and relax back when it moves away.
- Confirm it coexists with a `warp-jump` triggered mid-movement (nav click).
- Confirm `prefers-reduced-motion: reduce` (via devtools emulation) disables
  it entirely — normal cursor, unaffected starfield.
- Confirm touch/coarse-pointer emulation disables it entirely.
- Confirm mouse leaving the window fades the cursor out and stops the pull.
