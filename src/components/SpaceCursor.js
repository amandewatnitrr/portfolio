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
// Elements a click on should trigger the warp-pulse burst.
const INTERACTIVE_SELECTOR =
  'button, a, [role="button"], input[type="submit"], input[type="button"]';

function SpaceCursor() {
  const dotRef = useRef(null);
  const pulseRef = useRef(null);
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

    // Warp-pulse burst: a ring that snaps to full size then expands out
    // while fading, centered on the clicked interactive element. Restarting
    // a CSS animation requires a reflow between removing and re-adding it,
    // since the browser no-ops re-setting the same animation name.
    const handleClick = (event) => {
      if (!event.target.closest(INTERACTIVE_SELECTOR)) return;
      const pulse = pulseRef.current;
      if (!pulse) return;
      pulse.style.left = `${event.clientX}px`;
      pulse.style.top = `${event.clientY}px`;
      pulse.style.animation = "none";
      // eslint-disable-next-line no-unused-expressions
      pulse.offsetWidth; // force reflow so the animation restarts
      pulse.style.animation = "space-cursor-pulse 0.6s ease-out";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClick);

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
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(frameId.current);
      document.body.style.cursor = "";
    };
  }, []);

  if (!isSpaceCursorEnabled()) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="space-cursor">
        <span className="space-cursor-disk" />
      </div>
      <div ref={pulseRef} className="space-cursor-pulse" />
    </>
  );
}

export default SpaceCursor;
