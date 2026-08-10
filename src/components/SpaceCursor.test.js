import { render, fireEvent, cleanup } from "@testing-library/react";
import SpaceCursor from "./SpaceCursor";
import { cursorState } from "../lib/spaceCursorState";

jest.mock("gsap", () => ({
  __esModule: true,
  default: { to: jest.fn() },
}));
// eslint-disable-next-line import/first
import gsap from "gsap";

function mockMatchMedia(reducedMotion) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: reducedMotion,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

describe("SpaceCursor", () => {
  afterEach(() => {
    cleanup();
    document.body.style.cursor = "";
    gsap.to.mockClear();
  });

  test("renders nothing and leaves native cursor alone when reduced motion is requested", () => {
    mockMatchMedia(true);
    const { container } = render(<SpaceCursor />);
    expect(container).toBeEmptyDOMElement();
    expect(document.body.style.cursor).not.toBe("none");
  });

  test("renders the cursor graphic and hides native cursor when enabled", () => {
    mockMatchMedia(false);
    const { container } = render(<SpaceCursor />);
    expect(container.querySelector(".space-cursor")).not.toBeNull();
    expect(document.body.style.cursor).toBe("none");
  });

  test("mousemove updates shared cursor state", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    expect(cursorState.x).toBe(100);
    expect(cursorState.y).toBe(200);
    expect(cursorState.active).toBe(true);
  });

  test("mouseleave on document clears active state", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(document);
    expect(cursorState.active).toBe(false);
  });

  test("mousedown scales the cursor up via gsap (ported from reference codepen)", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.mouseDown(document);
    expect(gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ scale: 2, duration: 0.25, ease: "back" })
    );
  });

  test("mouseup scales the cursor back down via gsap", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.mouseUp(document);
    expect(gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ scale: 1, duration: 0.2, ease: "back" })
    );
  });

  test("touchstart updates shared cursor state and scales the cursor up", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.touchStart(document, { touches: [{ clientX: 50, clientY: 75 }] });
    expect(cursorState.x).toBe(50);
    expect(cursorState.y).toBe(75);
    expect(cursorState.active).toBe(true);
    expect(gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ scale: 2, duration: 0.25, ease: "back" })
    );
  });

  test("touchmove updates shared cursor state", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.touchStart(document, { touches: [{ clientX: 50, clientY: 75 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 120, clientY: 140 }] });
    expect(cursorState.x).toBe(120);
    expect(cursorState.y).toBe(140);
    expect(cursorState.active).toBe(true);
  });

  test("touchend clears active state and scales the cursor back down", () => {
    mockMatchMedia(false);
    render(<SpaceCursor />);
    fireEvent.touchStart(document, { touches: [{ clientX: 50, clientY: 75 }] });
    fireEvent.touchEnd(document, { touches: [] });
    expect(cursorState.active).toBe(false);
    expect(gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ scale: 1, duration: 0.2, ease: "back" })
    );
  });

  test("unmount restores native cursor", () => {
    mockMatchMedia(false);
    const { unmount } = render(<SpaceCursor />);
    expect(document.body.style.cursor).toBe("none");
    unmount();
    expect(document.body.style.cursor).not.toBe("none");
  });
});
