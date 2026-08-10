import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  isSpaceCursorEnabled,
  setCursorPosition,
  clearCursor,
} from "../lib/spaceCursorState";

// Renders a small blackhole graphic that follows the pointer — a mouse on
// desktop, a finger on touch — and feeds its position into
// spaceCursorState.js so StarBackground.js can warp the starfield toward
// it. Disabled only when prefers-reduced-motion is set (renders nothing,
// native cursor untouched).
//
// On touch, the cursor appears under the finger while touching and fades
// out the instant it lifts (there's no persistent pointer to track between
// touches, unlike a mouse that keeps hovering).
//
// Click/tap squish is ported from the reference "Black Hole cursor"
// codepen (codepen.io/ben4ali/pen/JjqdOyB): scale up on press, back down
// on release, both with GSAP's "back" ease, anywhere on the page — not
// gated to buttons/links.
function SpaceCursor() {
  // Outer element is the positioning anchor (moved via translate3d every
  // rAF frame). The inner element carries the visual look and is scaled by
  // GSAP independently, so the two animations never fight over `transform`
  // on the same node.
  const anchorRef = useRef(null);
  const dotRef = useRef(null);
  // Raw target position, updated synchronously on mousemove.
  const target = useRef({ x: 0, y: 0 });
  // Current rendered (lerped) position — trails the target slightly so the
  // cursor reads as a body with mass/inertia, not glued to the pointer.
  const current = useRef({ x: 0, y: 0 });
  const frameId = useRef(null);

  useEffect(() => {
    const enabled = isSpaceCursorEnabled();
    if (!enabled) return undefined;

    document.body.style.cursor = "none";

    const handleMouseMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      setCursorPosition(event.clientX, event.clientY);
      if (anchorRef.current) {
        anchorRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      clearCursor();
      if (anchorRef.current) {
        anchorRef.current.style.opacity = "0";
      }
    };

    const handleMouseDown = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 2, duration: 0.25, ease: "back" });
    };

    const handleMouseUp = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.2, ease: "back" });
    };

    // Touch has no hover, so a tap must snap the anchor straight to the
    // finger (bypassing the lerp) — otherwise the very first frame would
    // visibly fly in from wherever `current` last was (0,0, or the last
    // spot a mouse pointer was).
    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      target.current.x = touch.clientX;
      target.current.y = touch.clientY;
      current.current.x = touch.clientX;
      current.current.y = touch.clientY;
      setCursorPosition(touch.clientX, touch.clientY);
      if (anchorRef.current) {
        anchorRef.current.style.opacity = "1";
        anchorRef.current.style.transform = `translate3d(${touch.clientX}px, ${touch.clientY}px, 0)`;
      }
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 2, duration: 0.25, ease: "back" });
      }
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      target.current.x = touch.clientX;
      target.current.y = touch.clientY;
      setCursorPosition(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      clearCursor();
      if (anchorRef.current) {
        anchorRef.current.style.opacity = "0";
      }
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 1, duration: 0.2, ease: "back" });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    // passive: true — these never call preventDefault, so the browser
    // shouldn't block scrolling/panning waiting to find out.
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    const LERP_FACTOR = 0.2;
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
      current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;
      if (anchorRef.current) {
        anchorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(frameId.current);
      document.body.style.cursor = "";
    };
  }, []);

  if (!isSpaceCursorEnabled()) {
    return null;
  }

  return (
    <div ref={anchorRef} className="space-cursor-anchor">
      <div ref={dotRef} className="space-cursor" />
    </div>
  );
}

export default SpaceCursor;
