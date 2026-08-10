# Blackhole Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mouse cursor with a small CSS blackhole graphic and make nearby stars in the existing three.js `StarBackground` bend toward it, on desktop pointers only.

**Architecture:** A shared mutable module (`spaceCursorState.js`) is written to by a new `SpaceCursor` component on `mousemove`/`mouseleave`, and read every frame by `StarBackground`'s existing `requestAnimationFrame` loop. A pure function (`starGravity.js`) computes the per-star pull offset so the physics math is unit-testable independent of three.js/canvas. Both new modules are gated by a single `SPACE_CURSOR_ENABLED` flag (`pointer: fine` and not `prefers-reduced-motion`) computed once at module load.

**Tech Stack:** React 17 (CRA/react-scripts 5), three.js (already a dependency, used by `StarBackground.js`), Jest + `@testing-library/react` (already configured via `react-scripts test`).

## Global Constraints

- Desktop only: active only when `window.matchMedia("(pointer: fine)").matches`.
- Respect motion preference: inactive when `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
- No new WebGL context and no new `requestAnimationFrame` loop — pull math runs inside `StarBackground`'s existing `animate()` loop.
- No DOM/SVG content warping — only the three.js starfield reacts (per spec's declared out-of-scope).
- Cursor ring color `#ffddaa`, matching the existing warp-streak color (`StarBackground.js:104`) for visual consistency.
- Pull radius ~0.35 in the star sphere's normalized scene space; falloff `(1 - dist/radius)^2`; offset capped so a star never reaches the cursor point.
- `body { cursor: none }` applied only while the feature is active, never unconditionally.

---

### Task 1: Pure star-gravity math module

**Files:**
- Create: `src/lib/starGravity.js`
- Test: `src/lib/starGravity.test.js`

**Interfaces:**
- Consumes: nothing (pure module, no dependencies).
- Produces: `PULL_RADIUS` (number, `0.35`), `MAX_PULL_OFFSET` (number, `0.05`), `computePullOffset(starX, starY, starZ, cursorX, cursorY, cursorZ)` returning `{ dx, dy, dz }` — the offset to add to a star's rest position for one frame. Used by Task 4 (`StarBackground.js`).

- [ ] **Step 1: Write the failing tests**

```javascript
// src/lib/starGravity.test.js
import { computePullOffset, PULL_RADIUS, MAX_PULL_OFFSET } from "./starGravity";

describe("computePullOffset", () => {
  test("returns zero offset when star is outside the pull radius", () => {
    const offset = computePullOffset(1, 0, 0, 0, 0, 0);
    expect(offset).toEqual({ dx: 0, dy: 0, dz: 0 });
  });

  test("pulls a star toward the cursor along the line between them", () => {
    // Star at (0.1, 0, 0), cursor at origin: star should move in -x direction.
    const offset = computePullOffset(0.1, 0, 0, 0, 0, 0);
    expect(offset.dx).toBeLessThan(0);
    expect(offset.dy).toBe(0);
    expect(offset.dz).toBe(0);
  });

  test("falloff is stronger closer to the cursor", () => {
    const near = computePullOffset(0.05, 0, 0, 0, 0, 0);
    const far = computePullOffset(0.3, 0, 0, 0, 0, 0);
    expect(Math.abs(near.dx)).toBeGreaterThan(Math.abs(far.dx));
  });

  test("offset magnitude never exceeds MAX_PULL_OFFSET", () => {
    // Star essentially on top of the cursor (near-zero distance).
    const offset = computePullOffset(0.0001, 0, 0, 0, 0, 0);
    const magnitude = Math.sqrt(offset.dx ** 2 + offset.dy ** 2 + offset.dz ** 2);
    expect(magnitude).toBeLessThanOrEqual(MAX_PULL_OFFSET + 1e-9);
  });

  test("PULL_RADIUS and MAX_PULL_OFFSET are the documented constants", () => {
    expect(PULL_RADIUS).toBe(0.35);
    expect(MAX_PULL_OFFSET).toBe(0.05);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test src/lib/starGravity.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './starGravity'`

- [ ] **Step 3: Write the implementation**

```javascript
// src/lib/starGravity.js

// How close (in the star sphere's normalized scene space, same units as
// StarBackground.js's `randomInSphere(sphere, 1.2)` buffer) a star has to be
// to the cursor's projected scene position before gravity affects it at all.
export const PULL_RADIUS = 0.35;

// Hard cap on how far a single frame's offset can push a star, so a star
// can bend visibly but never actually reach/pass through the cursor point.
export const MAX_PULL_OFFSET = 0.05;

// Pure function: given a star's rest position and the cursor's current
// projected position (both in the star sphere's scene space), returns the
// {dx, dy, dz} offset to add to the star's position for this frame.
// Returns {dx: 0, dy: 0, dz: 0} when the star is outside PULL_RADIUS.
//
// Falloff is (1 - dist/radius)^2 — subtle overall, sharp near the center,
// per the "subtle pull" design choice: most stars in range barely move,
// only ones close to the cursor bend noticeably.
export function computePullOffset(starX, starY, starZ, cursorX, cursorY, cursorZ) {
  const toCursorX = cursorX - starX;
  const toCursorY = cursorY - starY;
  const toCursorZ = cursorZ - starZ;
  const dist = Math.sqrt(
    toCursorX * toCursorX + toCursorY * toCursorY + toCursorZ * toCursorZ
  );

  if (dist === 0 || dist >= PULL_RADIUS) {
    return { dx: 0, dy: 0, dz: 0 };
  }

  const falloff = (1 - dist / PULL_RADIUS) ** 2;
  const magnitude = Math.min(falloff * PULL_RADIUS, MAX_PULL_OFFSET);

  return {
    dx: (toCursorX / dist) * magnitude,
    dy: (toCursorY / dist) * magnitude,
    dz: (toCursorZ / dist) * magnitude,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test src/lib/starGravity.test.js --watchAll=false`
Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add src/lib/starGravity.js src/lib/starGravity.test.js
git commit -m "feat: add pure star-gravity offset math

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Shared cursor state module + activation gate

**Files:**
- Create: `src/lib/spaceCursorState.js`
- Test: `src/lib/spaceCursorState.test.js`

**Interfaces:**
- Consumes: `window.matchMedia` (browser API, mocked in tests).
- Produces: `cursorState` (mutable object `{ x: number, y: number, active: boolean }`), `setCursorPosition(x, y)`, `clearCursor()`, `isSpaceCursorEnabled()` (function, not a module-load constant — see note below). Used by Task 3 (`SpaceCursor.js`) and Task 4 (`StarBackground.js`).

Note: `isSpaceCursorEnabled()` is a function (re-evaluates `matchMedia` each call) rather than a constant computed once at import time, so it stays testable under Jest without needing module-registry resets between test cases.

- [ ] **Step 1: Write the failing tests**

```javascript
// src/lib/spaceCursorState.test.js
import {
  cursorState,
  setCursorPosition,
  clearCursor,
  isSpaceCursorEnabled,
} from "./spaceCursorState";

function mockMatchMedia({ pointerFine, reducedMotion }) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches:
      query === "(pointer: fine)" ? pointerFine : reducedMotion,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

describe("spaceCursorState", () => {
  afterEach(() => {
    clearCursor();
  });

  test("setCursorPosition updates x, y and marks active", () => {
    setCursorPosition(12, 34);
    expect(cursorState).toEqual({ x: 12, y: 34, active: true });
  });

  test("clearCursor marks inactive but keeps last known position", () => {
    setCursorPosition(5, 6);
    clearCursor();
    expect(cursorState.active).toBe(false);
    expect(cursorState.x).toBe(5);
    expect(cursorState.y).toBe(6);
  });

  test("isSpaceCursorEnabled is true for fine pointer + no reduced motion", () => {
    mockMatchMedia({ pointerFine: true, reducedMotion: false });
    expect(isSpaceCursorEnabled()).toBe(true);
  });

  test("isSpaceCursorEnabled is false for coarse pointer (touch)", () => {
    mockMatchMedia({ pointerFine: false, reducedMotion: false });
    expect(isSpaceCursorEnabled()).toBe(false);
  });

  test("isSpaceCursorEnabled is false when reduced motion is requested", () => {
    mockMatchMedia({ pointerFine: true, reducedMotion: true });
    expect(isSpaceCursorEnabled()).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test src/lib/spaceCursorState.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './spaceCursorState'`

- [ ] **Step 3: Write the implementation**

```javascript
// src/lib/spaceCursorState.js

// Shared mutable state, written by SpaceCursor.js on mousemove/mouseleave
// and read every animation frame by StarBackground.js. Plain mutable object
// (not React state) so updates don't trigger React re-renders on every
// mousemove — StarBackground already polls this once per rAF frame.
export const cursorState = { x: 0, y: 0, active: false };

export function setCursorPosition(x, y) {
  cursorState.x = x;
  cursorState.y = y;
  cursorState.active = true;
}

// Mouse left the window, or the feature is deactivating: stop contributing
// gravity pull, but keep the last known x/y so a fade-out transition (if
// any) has a position to fade from rather than snapping to 0,0.
export function clearCursor() {
  cursorState.active = false;
}

// Re-checks matchMedia on every call rather than caching at import time —
// keeps this testable under Jest (no module-registry reset needed between
// cases) at negligible cost since callers only invoke it on mount.
export function isSpaceCursorEnabled() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test src/lib/spaceCursorState.test.js --watchAll=false`
Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add src/lib/spaceCursorState.js src/lib/spaceCursorState.test.js
git commit -m "feat: add shared cursor-position state and activation gate

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: SpaceCursor component (graphic + tracking)

**Files:**
- Create: `src/components/SpaceCursor.js`
- Test: `src/components/SpaceCursor.test.js`
- Modify: `src/App.css` (append cursor styles)

**Interfaces:**
- Consumes: `isSpaceCursorEnabled`, `setCursorPosition`, `clearCursor` from `src/lib/spaceCursorState.js` (Task 2).
- Produces: default export `SpaceCursor` (React component, no props). Mounted by Task 5 (`App.js`).

- [ ] **Step 1: Write the failing test**

```javascript
// src/components/SpaceCursor.test.js
import { render, fireEvent, cleanup } from "@testing-library/react";
import SpaceCursor from "./SpaceCursor";
import { cursorState } from "../lib/spaceCursorState";

function mockMatchMedia(matches) {
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches,
    media: "",
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

describe("SpaceCursor", () => {
  afterEach(() => {
    cleanup();
    document.body.style.cursor = "";
  });

  test("renders nothing and leaves native cursor alone when disabled", () => {
    mockMatchMedia(false); // pointer: fine -> false, i.e. touch device
    const { container } = render(<SpaceCursor />);
    expect(container).toBeEmptyDOMElement();
    expect(document.body.style.cursor).not.toBe("none");
  });

  test("renders the cursor graphic and hides native cursor when enabled", () => {
    mockMatchMedia(true);
    const { container } = render(<SpaceCursor />);
    expect(container.querySelector(".space-cursor")).not.toBeNull();
    expect(document.body.style.cursor).toBe("none");
  });

  test("mousemove updates shared cursor state", () => {
    mockMatchMedia(true);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    expect(cursorState.x).toBe(100);
    expect(cursorState.y).toBe(200);
    expect(cursorState.active).toBe(true);
  });

  test("mouseleave on document clears active state", () => {
    mockMatchMedia(true);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(document);
    expect(cursorState.active).toBe(false);
  });

  test("unmount restores native cursor", () => {
    mockMatchMedia(true);
    const { unmount } = render(<SpaceCursor />);
    expect(document.body.style.cursor).toBe("none");
    unmount();
    expect(document.body.style.cursor).not.toBe("none");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx react-scripts test src/components/SpaceCursor.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './SpaceCursor'`

- [ ] **Step 3: Write the implementation**

```javascript
// src/components/SpaceCursor.js
import React, { useEffect, useRef } from "react";
import {
  isSpaceCursorEnabled,
  setCursorPosition,
  clearCursor,
} from "../lib/spaceCursorState";

// Renders a small blackhole graphic that replaces the native cursor on
// fine-pointer, non-reduced-motion devices, and feeds raw mouse position
// into spaceCursorState.js so StarBackground.js can pull nearby stars
// toward it. Disabled entirely on touch/coarse pointers and when
// prefers-reduced-motion is set (renders nothing, native cursor untouched).
function SpaceCursor() {
  const dotRef = useRef(null);
  // Raw (unlerped) target position, updated synchronously on mousemove.
  const target = useRef({ x: 0, y: 0 });
  // Current rendered (lerped) position.
  const current = useRef({ x: 0, y: 0 });
  const frameId = useRef(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const enabled = isSpaceCursorEnabled();
    enabledRef.current = enabled;
    if (!enabled) return undefined;

    document.body.style.cursor = "none";

    const handleMouseMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      current.current.x = event.clientX;
      current.current.y = event.clientY;
      setCursorPosition(event.clientX, event.clientY);
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      clearCursor();
      if (dotRef.current) {
        dotRef.current.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const LERP_FACTOR = 0.2;
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
      current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameId.current);
      document.body.style.cursor = "";
    };
  }, []);

  if (!isSpaceCursorEnabled()) {
    return null;
  }

  return <div ref={dotRef} className="space-cursor" />;
}

export default SpaceCursor;
```

- [ ] **Step 4: Add cursor styles**

Append to `src/App.css`:

```css
/* Blackhole cursor (SpaceCursor.js) — replaces native cursor on desktop
   pointers when motion is not reduced. Positioned via transform (not
   left/top) for GPU-accelerated, jank-free tracking. */
.space-cursor {
  position: fixed;
  top: -9px;
  left: -9px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #000;
  box-shadow:
    0 0 0 2px #ffddaa,
    0 0 12px 4px rgba(255, 221, 170, 0.6);
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.2s ease;
  will-change: transform;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx react-scripts test src/components/SpaceCursor.test.js --watchAll=false`
Expected: PASS — all 5 tests green

- [ ] **Step 6: Commit**

```bash
git add src/components/SpaceCursor.js src/components/SpaceCursor.test.js src/App.css
git commit -m "feat: add SpaceCursor component with blackhole graphic

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Wire star gravity into StarBackground's render loop

**Files:**
- Modify: `src/components/StarBackground.js:126-174` (the `animate` function)

**Interfaces:**
- Consumes: `computePullOffset`, `PULL_RADIUS` from `src/lib/starGravity.js` (Task 1); `cursorState` from `src/lib/spaceCursorState.js` (Task 2).
- Produces: no new exports — internal behavior change to `StarBackground`'s existing render loop, consumed visually (manual verification, no new unit surface).

Note: `StarBackground.js` currently mutates `streakGeometry`'s position buffer in place inside `animate()` for the warp effect (`StarBackground.js:151-158`), but stars themselves (`points` / `geometry`) are only ever rotated as a whole group, never per-star repositioned. This task adds a second, separate per-star position buffer for the gravity-pulled render positions, computed fresh from `sphere` (the rest positions) each frame — so it self-heals automatically and never accumulates drift, per the design's "not written back permanently" requirement.

- [ ] **Step 1: Add the imports**

In `src/components/StarBackground.js`, add these two imports at the top of the file, alongside the existing `import * as THREE from "three";`:

```javascript
import { computePullOffset, PULL_RADIUS } from "../lib/starGravity";
import { cursorState } from "../lib/spaceCursorState";
```

- [ ] **Step 2: Add a per-star render-position buffer and point the geometry at it**

In `src/components/StarBackground.js`, replace line 61:

```javascript
    geometry.setAttribute("position", new THREE.BufferAttribute(sphere, 3));
```

with:

```javascript
    // Per-star rendered position, recomputed from `sphere` (rest positions)
    // each frame that gravity pull is active. Kept separate from `sphere`
    // so the pull never permanently mutates rest positions — it always
    // eases back the instant the cursor moves away, by construction.
    const renderPositions = new Float32Array(sphere.length);
    renderPositions.set(sphere);
    geometry.setAttribute("position", new THREE.BufferAttribute(renderPositions, 3));
```

- [ ] **Step 3: Apply gravity pull each frame inside `animate()`**

In `src/components/StarBackground.js`, inside the `animate` function, immediately before the existing `if (warpIntensity > 0) {` block (around line 149), add:

```javascript
      // Blackhole cursor gravity pull (SpaceCursor.js writes cursorState).
      // Cursor's screen position is converted to the star sphere's
      // normalized scene space by mapping [0, innerWidth] / [0, innerHeight]
      // to roughly [-1, 1], matching the sphere's radius-1.2 scale.
      if (cursorState.active) {
        const cursorSceneX = (cursorState.x / window.innerWidth) * 2 - 1;
        const cursorSceneY = -((cursorState.y / window.innerHeight) * 2 - 1);
        const cursorSceneZ = 0;

        let anyPulled = false;
        for (let i = 0; i < sphere.length; i += 3) {
          const sx = sphere[i];
          const sy = sphere[i + 1];
          const sz = sphere[i + 2];
          const roughDist = Math.abs(sx - cursorSceneX) + Math.abs(sy - cursorSceneY);
          if (roughDist > PULL_RADIUS * 2) {
            renderPositions[i] = sx;
            renderPositions[i + 1] = sy;
            renderPositions[i + 2] = sz;
            continue;
          }
          const offset = computePullOffset(
            sx, sy, sz,
            cursorSceneX, cursorSceneY, cursorSceneZ
          );
          renderPositions[i] = sx + offset.dx;
          renderPositions[i + 1] = sy + offset.dy;
          renderPositions[i + 2] = sz + offset.dz;
          anyPulled = anyPulled || offset.dx !== 0 || offset.dy !== 0 || offset.dz !== 0;
        }
        if (anyPulled) {
          geometry.attributes.position.needsUpdate = true;
        }
      } else if (renderPositions[0] !== sphere[0]) {
        // Cursor inactive (mouse left window / feature disabled): snap
        // back to rest positions once, then stop touching the buffer.
        renderPositions.set(sphere);
        geometry.attributes.position.needsUpdate = true;
      }
```

Note: `sphere` stays the untouched rest-position source of truth (used for rotation math elsewhere in the file, e.g. the streak direction vectors); `renderPositions` is what actually gets rendered and is recomputed from `sphere` every frame, so gravity pull can never permanently drift a star.

- [ ] **Step 4: Manual verification in the browser preview**

Run: `npm start` (or use the project's existing dev-server preview flow)

- Move the mouse near the starfield: confirm stars within a small radius visibly bend toward the cursor.
- Move the mouse away: confirm stars ease back to their original rotating positions (no permanent drift).
- Trigger a route change (nav click, fires `warp-jump`): confirm the hyperspace streak burst still plays correctly with the cursor pull active at the same time — no visual conflict or console errors.
- Open browser devtools, throttle CPU or check frame rate: confirm no dropped-frame regression versus current `main` (the added per-frame loop is O(star count), same order as the existing warp streak loop).

- [ ] **Step 5: Commit**

```bash
git add src/components/StarBackground.js
git commit -m "feat: pull nearby stars toward cursor position

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Mount SpaceCursor site-wide and verify end-to-end

**Files:**
- Modify: `src/App.js:1-10` (imports and render)

**Interfaces:**
- Consumes: default export `SpaceCursor` from `src/components/SpaceCursor.js` (Task 3).
- Produces: nothing new — final integration point.

- [ ] **Step 1: Import and mount `SpaceCursor` in `App.js`**

In `src/App.js`, add the import alongside the existing component imports (after line 3, `import StarBackground from "./components/StarBackground";`):

```javascript
import SpaceCursor from "./components/SpaceCursor";
```

Then render it alongside `StarBackground` (line 36):

```javascript
      <StarBackground />
      <SpaceCursor />
```

- [ ] **Step 2: Run the full test suite**

Run: `npx react-scripts test --watchAll=false`
Expected: PASS — all existing tests plus the new `starGravity.test.js`, `spaceCursorState.test.js`, `SpaceCursor.test.js` suites green

- [ ] **Step 3: Manual end-to-end verification in the browser preview**

Run: `npm start`, open the app in the browser preview.

- Confirm the blackhole cursor graphic (black core + warm ring) renders and smoothly trails the real mouse position across the whole site (Home, About, Projects, Resume routes).
- Confirm nearby stars bend toward it as documented in Task 4.
- Emulate `prefers-reduced-motion: reduce` in devtools: confirm the cursor graphic disappears, native cursor returns, and stars no longer respond to mouse movement.
- Emulate a touch/coarse-pointer device (devtools device toolbar): confirm the same — native cursor, no star pull.
- Move the mouse out of the browser viewport: confirm the cursor graphic fades out and stars relax back to rest.
- Check the browser console for errors across all four routes.

- [ ] **Step 4: Commit**

```bash
git add src/App.js
git commit -m "feat: mount SpaceCursor site-wide

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
