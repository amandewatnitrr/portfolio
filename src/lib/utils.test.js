import { cn } from "./utils";

test("joins class strings with a space", () => {
  expect(cn("tw-flex", "tw-items-center")).toBe("tw-flex tw-items-center");
});

test("resolves conflicting prefixed tailwind utilities, keeping the last one", () => {
  expect(cn("tw-p-2", "tw-p-4")).toBe("tw-p-4");
});

test("drops falsy values", () => {
  expect(cn("tw-flex", false && "tw-hidden", null, undefined, "")).toBe(
    "tw-flex"
  );
});
