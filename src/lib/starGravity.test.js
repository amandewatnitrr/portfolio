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
