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

  useEffect(() => {
    const enabled = isSpaceCursorEnabled();
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
