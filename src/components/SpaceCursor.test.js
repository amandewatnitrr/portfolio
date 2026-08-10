import { render, fireEvent, cleanup } from "@testing-library/react";
import SpaceCursor from "./SpaceCursor";
import { cursorState } from "../lib/spaceCursorState";

function mockMatchMedia(enabled) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === "(pointer: fine)" ? enabled : false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

describe("SpaceCursor", () => {
  afterEach(() => {
    cleanup();
    document.body.style.cursor = "";
  });

  test("renders nothing and leaves native cursor alone when disabled", () => {
    mockMatchMedia(false); // pointer: fine -> false, i.e. touch device
    const { container } = render(<SpaceCursor />);
    expect(container).toBeEmptyDOMElement();
    expect(document.body.style.cursor).not.toBe("none");
  });

  test("renders the cursor graphic and hides native cursor when enabled", () => {
    mockMatchMedia(true);
    const { container } = render(<SpaceCursor />);
    expect(container.querySelector(".space-cursor")).not.toBeNull();
    expect(document.body.style.cursor).toBe("none");
  });

  test("mousemove updates shared cursor state", () => {
    mockMatchMedia(true);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    expect(cursorState.x).toBe(100);
    expect(cursorState.y).toBe(200);
    expect(cursorState.active).toBe(true);
  });

  test("mouseleave on document clears active state", () => {
    mockMatchMedia(true);
    render(<SpaceCursor />);
    fireEvent.mouseMove(document, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(document);
    expect(cursorState.active).toBe(false);
  });

  test("unmount restores native cursor", () => {
    mockMatchMedia(true);
    const { unmount } = render(<SpaceCursor />);
    expect(document.body.style.cursor).toBe("none");
    unmount();
    expect(document.body.style.cursor).not.toBe("none");
  });
});
