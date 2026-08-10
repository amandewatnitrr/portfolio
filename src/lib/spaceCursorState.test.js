import {
  cursorState,
  setCursorPosition,
  clearCursor,
  isSpaceCursorEnabled,
} from "./spaceCursorState";

function mockMatchMedia(reducedMotion) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: reducedMotion,
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

  test("isSpaceCursorEnabled is true when reduced motion is not requested", () => {
    mockMatchMedia(false);
    expect(isSpaceCursorEnabled()).toBe(true);
  });

  test("isSpaceCursorEnabled is false when reduced motion is requested", () => {
    mockMatchMedia(true);
    expect(isSpaceCursorEnabled()).toBe(false);
  });
});
