import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Must match StarBackground.js's WARP_RAMP_MS — the point where the streak
// burst hits peak whiteout, which is when the new page's content should
// actually appear instead of popping in the instant you click.
export const WARP_SWAP_DELAY_MS = 180;

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
  window.setTimeout(() => navigate(to), WARP_SWAP_DELAY_MS);
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
