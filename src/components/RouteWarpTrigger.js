import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Must match StarBackground.js's WARP_DURATION_MS — full length of the warp
// animation. New page content should only appear once the warp has fully
// finished, not pop in mid-flash.
export const WARP_CONTENT_DELAY_MS = 3000;

// Set by warpNavigate() right before it changes the route, so the
// location-change effect below knows this navigation's warp was already
// fired by the click handler and doesn't fire a second one.
let suppressNextAutoWarp = false;

export function triggerWarp() {
  window.dispatchEvent(new Event("warp-jump"));
}

// Use in nav click handlers instead of navigating directly: starts the
// warp burst immediately, then swaps the route in once the screen is
// mid-flash rather than instantly.
export function warpNavigate(navigate, to) {
  suppressNextAutoWarp = true;
  triggerWarp();
  window.setTimeout(() => navigate(to), WARP_CONTENT_DELAY_MS);
}

// Fires "warp-jump" on route changes that didn't go through warpNavigate
// (browser back/forward, address-bar edits) — skips the very first mount,
// and skips navigations warpNavigate already handled itself.
function RouteWarpTrigger() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (suppressNextAutoWarp) {
      suppressNextAutoWarp = false;
      return;
    }
    triggerWarp();
  }, [location.pathname]);

  return null;
}

export default RouteWarpTrigger;

// Content-visibility gate for the routed page area: old content should
// vanish the instant a warp starts (not linger through the flash), then
// the new content (already swapped in by then, via warpNavigate's delayed
// navigate or the browser's own back/forward change) fades back in once
// the warp animation has fully finished. Covers both navigation paths
// since both fire "warp-jump".
export function useWarpVisible() {
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef(null);

  useEffect(() => {
    function onWarp() {
      setVisible(false);
      clearTimeout(hideTimeout.current);
      hideTimeout.current = window.setTimeout(() => {
        setVisible(true);
      }, WARP_CONTENT_DELAY_MS);
    }
    window.addEventListener("warp-jump", onWarp);
    return () => {
      window.removeEventListener("warp-jump", onWarp);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  return visible;
}
