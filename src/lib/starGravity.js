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
