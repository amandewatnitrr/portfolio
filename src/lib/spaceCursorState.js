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
