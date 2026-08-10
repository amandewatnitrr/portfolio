import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  isSpaceCursorEnabled,
  setCursorPosition,
  clearCursor,
} from "../lib/spaceCursorState";

// Renders a small blackhole graphic that replaces the native cursor on
// fine-pointer, non-reduced-motion devices, and feeds raw mouse position
// into spaceCursorState.js so StarBackground.js can warp the starfield
// toward it. Disabled entirely on touch/coarse pointers and when
// prefers-reduced-motion is set (renders nothing, native cursor untouched).
//
// Click squish is ported from the reference "Black Hole cursor" codepen
// (codepen.io/ben4ali/pen/JjqdOyB): scale up on mousedown, back down on
// mouseup, both with GSAP's "back" ease, on any click anywhere — not
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

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
