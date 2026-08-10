# Project Cards 3D Pin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bootstrap `Card` project grid with a section that visually matches next-portfolio's "A small selection of recent projects" — tilt-on-hover 3D pin cards with animated glow rings, a "Visit" pill, per-project tech icon badges, and a "Source Code" link.

**Architecture:** Add Tailwind CSS (prefixed `tw-`, preflight disabled) and framer-motion alongside the existing Bootstrap/CRA stack, scoped entirely to new files. Port `next-portfolio`'s `3d-pin.tsx` to a plain-React `PinContainer` component. New `data/projects.js` holds project content (replacing inline JSX props). New `RecentProjects` component renders the heading + card grid and replaces the old `Row`/`Col`/`ProjectCard` grid inside the existing `Projects.js` route component (which keeps its `BlackholeBackground` + `project-section` wrapper).

**Tech Stack:** CRA (react-scripts 5), React 17, Tailwind CSS 3 (prefixed, no preflight), framer-motion, clsx, tailwind-merge, react-icons (si/md/tb/fa6 sets), Jest + @testing-library/react (already present).

## Global Constraints

- Every new Tailwind class must use the `tw-` prefix — unprefixed Tailwind utilities collide with Bootstrap classes of the same name (`container`, `mt-3`, `p-4`, etc.) already used throughout the site.
- `corePlugins.preflight` must stay `false` — Tailwind's base reset must not touch existing global typography/box-sizing.
- New component/data files use the `.js` extension (not `.jsx`), matching this repo's existing convention (`ProjectCards.js`, `Projects.js` already contain JSX in `.js` files).
- "Visit" pin link: `project.link` if non-empty, else `project.sourceCode`. "Source Code" link: always `project.sourceCode`.
- Project copy (title/description/links) must be copied verbatim from the current `src/components/Projects/Projects.js` — no rewording.
- No changes outside `src/components/Projects/`, `src/components/ui/`, `src/data/`, `src/lib/`, `src/setupTests.js`, `src/index.js`, `public/bg.png`, and the Tailwind/PostCSS config files at the repo root.

---

### Task 1: Wire up Tailwind (prefixed, no preflight) + PostCSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/tailwind.css`
- Modify: `src/index.js`
- Modify: `src/setupTests.js`
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: a `tw-` prefixed Tailwind build wired into the CRA build/test pipeline; any later task can use `tw-*` classes in `.js` files under `src/`.

- [ ] **Step 1: Install dependencies**

```bash
npm install tailwindcss@^3 postcss autoprefixer framer-motion clsx tailwind-merge
```

- [ ] **Step 2: Create `tailwind.config.js`**

```js
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.js"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 3: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create `src/tailwind.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Import it once, in `src/index.js`**

Add after the existing `import "./index.css";` line:

```js
import "./tailwind.css";
```

- [ ] **Step 6: Add a `matchMedia` polyfill to `src/setupTests.js`**

framer-motion (used starting Task 4) reads `window.matchMedia` during render; jsdom under CRA's bundled Jest doesn't define it. Append to the existing file:

```js
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
```

- [ ] **Step 7: Verify the build still succeeds**

Run: `CI=true npm run build`
Expected: exits 0, prints `Compiled successfully.` (a Tailwind stylesheet with zero utilities generated yet is fine — nothing uses `tw-*` classes until Task 4).

- [ ] **Step 8: Verify existing tests still pass**

Run: `CI=true npm test`
Expected: `PASS src/App.test.js`, no new failures.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tailwind.config.js postcss.config.js src/tailwind.css src/index.js src/setupTests.js
git commit -m "chore: add prefixed Tailwind + framer-motion for project cards"
```

---

### Task 2: `cn()` class-merge helper

**Files:**
- Create: `src/lib/utils.js`
- Test: `src/lib/utils.test.js`

**Interfaces:**
- Produces: `cn(...inputs: Array<string | false | null | undefined>): string` — used by `PinContainer` (Task 4) to merge className props.

- [ ] **Step 1: Write the failing test**

```js
// src/lib/utils.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npx react-scripts test src/lib/utils.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './utils'`

- [ ] **Step 3: Write the implementation**

```js
// src/lib/utils.js
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({ prefix: "tw-" });

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `CI=true npx react-scripts test src/lib/utils.test.js --watchAll=false`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils.js src/lib/utils.test.js
git commit -m "feat: add cn() class-merge helper for tw- prefixed classes"
```

---

### Task 3: Project data + visit-link fallback

**Files:**
- Create: `src/data/projects.js`
- Test: `src/data/projects.test.js`

**Interfaces:**
- Consumes: existing assets `src/Assets/Projects/{sanjeevani.gif,Screenshot 2023-04-25 at 4.49.35 PM.png,expressiondiff.png,imhm.png,Logitraffic_Dashboard.png}` (unchanged, same files `Projects.js` already imports).
- Produces: `projects: Array<{ id, title, des, img, iconLists: Array<ComponentType>, link, sourceCode }>` and `getVisitLink(project): string` — both consumed by `RecentProjects` (Task 6).

- [ ] **Step 1: Write the failing test**

```js
// src/data/projects.test.js
import { projects, getVisitLink } from "./projects";

test("has exactly 5 projects", () => {
  expect(projects).toHaveLength(5);
});

test("getVisitLink falls back to sourceCode when link is empty", () => {
  expect(
    getVisitLink({ link: "", sourceCode: "https://github.com/x/y" })
  ).toBe("https://github.com/x/y");
});

test("getVisitLink uses link when present", () => {
  expect(
    getVisitLink({
      link: "https://example.com/demo",
      sourceCode: "https://github.com/x/y",
    })
  ).toBe("https://example.com/demo");
});

test("every project has a title, description, image, source link and at least one tech icon", () => {
  projects.forEach((project) => {
    expect(typeof project.title).toBe("string");
    expect(project.des.length).toBeGreaterThan(0);
    expect(project.img).toBeTruthy();
    expect(project.iconLists.length).toBeGreaterThan(0);
    expect(project.sourceCode).toMatch(/^https?:\/\//);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npx react-scripts test src/data/projects.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './projects'`

- [ ] **Step 3: Write the implementation**

```js
// src/data/projects.js
import { MdSensors } from "react-icons/md";
import { TbApi } from "react-icons/tb";
import {
  SiArduino,
  SiRaspberrypi,
  SiFirebase,
  SiSqlite,
  SiPython,
  SiDjango,
  SiWolframmathematica,
  SiBlender,
  SiReact,
} from "react-icons/si";

import sanjeevani from "../Assets/Projects/sanjeevani.gif";
import django_tut from "../Assets/Projects/Screenshot 2023-04-25 at 4.49.35 PM.png";
import expressiondiff from "../Assets/Projects/expressiondiff.png";
import imhm from "../Assets/Projects/imhm.png";
import logitraffic from "../Assets/Projects/Logitraffic_Dashboard.png";

export const projects = [
  {
    id: 1,
    title: "Sanjeevani",
    des: "Sanjeevani is an IoT web-based Real-Time Health Monitoring and Medical Consultation System. The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like Heart-Rate, Blood Pressure, Temperature, ECG Function, Glucose Level, Dissolved Oxygen Level, etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase and Udibots for storage in the database and henceforth is accessible by the authenticated person(doctor and the user).",
    img: sanjeevani,
    iconLists: [MdSensors, SiArduino, SiRaspberrypi, SiFirebase, SiSqlite],
    link: "",
    sourceCode:
      "https://github.com/amandewatnitrr/Team-X_HealthCare-Sanjeevani",
  },
  {
    id: 2,
    title: "DevSearch",
    des: "A Platform where Software Developer can share there projects on a platform and get reviews on it from other developers. The Developers can also showcase about there skills over there profile. They can also contact each other via message feature.",
    img: django_tut,
    iconLists: [SiPython, SiDjango, TbApi],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/django-tutorial",
  },
  {
    id: 3,
    title: "Expression Difference",
    des: "The Purpose of the Project is to design a function that tells difference between two given expressions and denotes the changes that need to be made to reference expression(expr_1) to make it appear same as another expression (expr_2) and produce the same evaluation. The approach involves visualizing these expressions as trees and record these differences in expression as a list of “Insert”, “Delete” and “ReplacePart” operations which on being applied to reference expression(expr_1) results in the other expression(expr_2). The Problem of identifying Differences in Expressions has a very large scale application, as working with large expressions in Wolfram can make code look messy. Any piece of code should be able to clearly demonstrate what it's doing and should be clearly distinguishable. The ExpressionDifference Function does the same. It clearly demonstrates how one expression can be converted into other expression with the use of Insert, ReplacePart and Delete operations. We explored that while working with expressions in Wolfram, sometime it becomes difficult to point out the differences between 2 expressions. Hence, ExpressionDifference solves this problem.",
    img: expressiondiff,
    iconLists: [SiWolframmathematica],
    link: "https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP",
    sourceCode:
      "https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP",
  },
  {
    id: 4,
    title: "i-MHM",
    des: "i-MHM is an ML/IoT based Real-Time Mental Health Monitoring and Consultation System. The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like ECG, body posture etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase for storage in the database and henceforth is accessible by the authenticated person(Parents and Counsellor). The app offers people better access to healthcare support beyond their bounds of convenience and connects them to doctors, specialists and healthcare experts on a digital platform, which provides them access to an online expert without a physical visit. For counsellors and parents, it includes a feature to view-track the medical record of the pupil regularly and efficiently.",
    img: imhm,
    iconLists: [
      MdSensors,
      SiArduino,
      SiRaspberrypi,
      SiFirebase,
      SiSqlite,
      SiBlender,
    ],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/codeutsava",
  },
  {
    id: 5,
    title: "Logitraffic",
    des: "LogiTraffic is an IoT based Deep Learning Powered Traffic Management and Theft Detection Solution. It’s an online website platform using which user can keep check on certain real-time parameters associated with the vehicle which includes fuel-level, GPS location, Brake System Temperature, Speed, Traffic Forecasting using Vehicle Detection and obtaining vehicle count through different road nodes and predicting Traffic Congestion/Jams. In case the user suspects his/her car has been stolen by logging in using the credentials one can lock the vehicles and see driver’s real time video stream and a picture of the driver is downloaded on the system so that it can be used for further investigation and police cases. (YouTube Video Presentation by Team Aztecs: https://youtu.be/rP2OGjZJ5NY) – Presented in E-Ujjwala Hackathon 2020 by Birsa Institute of Technology, Jharkhand (Team Aztecs - Finalists)",
    img: logitraffic,
    iconLists: [
      SiReact,
      SiDjango,
      MdSensors,
      SiArduino,
      SiRaspberrypi,
      SiFirebase,
      SiSqlite,
      SiBlender,
    ],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/Aztecs-LogiTraffic",
  },
];

export function getVisitLink(project) {
  return project.link && project.link.trim() !== ""
    ? project.link
    : project.sourceCode;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `CI=true npx react-scripts test src/data/projects.test.js --watchAll=false`
Expected: PASS, 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/data/projects.test.js
git commit -m "feat: add structured project data with tech icon lists"
```

---

### Task 4: `PinContainer` component (3D tilt pin, ported from next-portfolio)

**Files:**
- Create: `src/components/ui/PinContainer.js`
- Test: `src/components/ui/PinContainer.test.js`

**Interfaces:**
- Consumes: `cn` from `../../lib/utils` (Task 2).
- Produces: `PinContainer({ children, title, href, className, containerClassName })` — a React component. Consumed by `RecentProjects` (Task 6) as the card wrapper; `title` is the text shown in the hover "Visit" pill, `href` is its link target, `children` is the card's inner content.

- [ ] **Step 1: Write the failing test**

```js
// src/components/ui/PinContainer.test.js
import { render, screen } from "@testing-library/react";
import { PinContainer } from "./PinContainer";

test("renders children and a titled link pointing at href", () => {
  render(
    <PinContainer title="Visit" href="https://example.com">
      <p>card body</p>
    </PinContainer>
  );

  expect(screen.getByText("card body")).toBeInTheDocument();

  const link = screen.getByRole("link", { name: "Visit" });
  expect(link).toHaveAttribute("href", "https://example.com");
  expect(link).toHaveAttribute("target", "_blank");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npx react-scripts test src/components/ui/PinContainer.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './PinContainer'`

- [ ] **Step 3: Write the implementation**

Ported from `next-portfolio`'s `components/ui/3d-pin.tsx`: `next/link` → plain `<a>`, `next/image`/TS types dropped, every Tailwind class prefixed `tw-` (verified against a local Tailwind build that `tw-group/pin` + `group-hover/pin:tw-opacity-100` is the correct prefixed marker/variant pairing).

```jsx
// src/components/ui/PinContainer.js
import React, { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "tw-group/pin tw-relative tw-z-50 tw-cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="tw-absolute tw-left-1/2 tw-top-1/2 tw-ml-[0.09375rem] tw-mt-4 tw--translate-x-1/2 tw--translate-y-1/2"
      >
        <div
          style={{ transform }}
          className="tw-absolute tw-left-1/2 tw-top-1/2 tw-flex tw-items-start tw-justify-start tw-overflow-hidden tw-rounded-2xl tw-border tw-border-white/[0.1] tw-p-4 tw-shadow-[0_8px_16px_rgb(0_0_0/0.4)] tw-transition tw-duration-700 group-hover/pin:tw-border-white/[0.2]"
        >
          <div className={cn("tw-relative tw-z-50", className)}>
            {children}
          </div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({ title, href }) => {
  return (
    <motion.div className="tw-z-[60] tw-flex tw-h-80 tw-w-full tw-items-center tw-justify-center tw-opacity-0 tw-transition tw-duration-500 group-hover/pin:tw-opacity-100">
      <div className="tw-inset-0 tw--mt-7 tw-h-full tw-w-full tw-flex-none">
        <div className="tw-absolute tw-inset-x-0 tw-top-0 tw-flex tw-justify-center">
          <a
            href={href || "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="tw-relative tw-z-10 tw-flex tw-items-center tw-space-x-2 tw-rounded-full tw-bg-zinc-950 tw-px-4 tw-py-0.5 tw-ring-1 tw-ring-white/10"
          >
            <span className="tw-relative tw-z-20 tw-inline-block tw-py-0.5 tw-text-xs tw-font-bold tw-text-white">
              {title}
            </span>
            <span
              aria-hidden
              className="tw-absolute tw--bottom-0 tw-left-[1.125rem] tw-h-px tw-w-[calc(100%-2.25rem)] tw-bg-gradient-to-r tw-from-emerald-400/0 tw-via-emerald-400/90 tw-to-emerald-400/0 tw-transition-opacity tw-duration-500 group-hover/btn:tw-opacity-40"
            />
          </a>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="tw-absolute tw-left-1/2 tw-top-1/2 tw-ml-[0.09375rem] tw-mt-4 tw--translate-x-1/2 tw--translate-y-1/2"
        >
          {[0, 2, 4].map((delay) => (
            <motion.div
              key={delay}
              initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: 1, z: 0 }}
              transition={{ duration: 6, repeat: Infinity, delay }}
              className="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-[11.25rem] tw-w-[11.25rem] tw-rounded-[50%] tw-bg-sky-500/[0.08] tw-shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              aria-hidden
            />
          ))}
        </div>

        <>
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-h-20 tw-w-px tw-translate-y-[14px] tw-bg-gradient-to-b tw-from-transparent tw-to-cyan-500 tw-blur-[2px] group-hover/pin:tw-h-40"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-h-20 tw-w-px tw-translate-y-[14px] tw-bg-gradient-to-b tw-from-transparent tw-to-cyan-500 group-hover/pin:tw-h-40"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-z-40 tw-h-[4px] tw-w-[4px] tw-translate-x-[1.5px] tw-translate-y-[14px] tw-rounded-full tw-bg-cyan-600 tw-blur-[3px]"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-z-40 tw-h-[2px] tw-w-[2px] tw-translate-x-[0.5px] tw-translate-y-[14px] tw-rounded-full tw-bg-cyan-300"
          />
        </>
      </div>
    </motion.div>
  );
};

export default PinContainer;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `CI=true npx react-scripts test src/components/ui/PinContainer.test.js --watchAll=false`
Expected: PASS, 1 test

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/PinContainer.js src/components/ui/PinContainer.test.js
git commit -m "feat: port 3D tilt PinContainer component with tw- prefixed classes"
```

---

### Task 5: Copy the dark card-backdrop image

**Files:**
- Create: `public/bg.png` (binary copy from `/Users/akd/Github/next-portfolio/public/bg.png`)

**Interfaces:**
- Produces: a static asset served at `/bg.png`, referenced by `RecentProjects` (Task 6) as the dark panel shown behind each project screenshot.

- [ ] **Step 1: Copy the file**

```bash
cp "/Users/akd/Github/next-portfolio/public/bg.png" "/Users/akd/Github/portfolio/public/bg.png"
```

- [ ] **Step 2: Verify it copied correctly**

Run: `ls -la public/bg.png && shasum "/Users/akd/Github/next-portfolio/public/bg.png" public/bg.png`
Expected: both `shasum` outputs show the same hash.

- [ ] **Step 3: Commit**

```bash
git add public/bg.png
git commit -m "chore: add project-card backdrop image"
```

---

### Task 6: `RecentProjects` section component

**Files:**
- Create: `src/components/Projects/RecentProjects.js`
- Test: `src/components/Projects/RecentProjects.test.js`

**Interfaces:**
- Consumes: `projects`, `getVisitLink` from `../../data/projects` (Task 3); `PinContainer` from `../ui/PinContainer` (Task 4); `FaLocationArrow` from `react-icons/fa6`.
- Produces: `RecentProjects()` — default-exported React component, no props. Consumed by `Projects.js` (Task 7).

- [ ] **Step 1: Write the failing test**

```js
// src/components/Projects/RecentProjects.test.js
import { render, screen } from "@testing-library/react";
import RecentProjects from "./RecentProjects";
import { projects } from "../../data/projects";

test("renders the section heading", () => {
  render(<RecentProjects />);
  expect(
    screen.getByRole("heading", {
      name: /a small selection of recent projects/i,
    })
  ).toBeInTheDocument();
});

test("renders one card per project with its title and a Source Code link to its repo", () => {
  render(<RecentProjects />);

  projects.forEach((project) => {
    expect(screen.getByText(project.title)).toBeInTheDocument();
  });

  const sourceLinks = screen.getAllByText("Source Code");
  expect(sourceLinks).toHaveLength(projects.length);
  sourceLinks.forEach((link, i) => {
    expect(link.closest("a")).toHaveAttribute("href", projects[i].sourceCode);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npx react-scripts test src/components/Projects/RecentProjects.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './RecentProjects'`

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/Projects/RecentProjects.js
import React from "react";
import { FaLocationArrow } from "react-icons/fa6";

import { projects, getVisitLink } from "../../data/projects";
import { PinContainer } from "../ui/PinContainer";

function RecentProjects() {
  return (
    <section id="projects" className="tw-py-20">
      <h1 className="project-heading">
        A small selection of{" "}
        <strong className="purple">recent projects</strong>
      </h1>

      <div className="tw-mt-10 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-24 tw-gap-y-8 tw-p-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="tw-flex tw-h-[32rem] tw-w-[90vw] tw-items-center tw-justify-center sm:tw-h-[41rem] sm:tw-w-[570px] lg:tw-min-h-[32.5rem]"
          >
            <PinContainer title="Visit" href={getVisitLink(project)}>
              <div className="tw-relative tw-mb-10 tw-flex tw-h-[30vh] tw-w-[80vw] tw-items-center tw-justify-center tw-overflow-hidden sm:tw-h-[40vh] sm:tw-w-[570px]">
                <div className="tw-relative tw-h-full tw-w-full tw-overflow-hidden tw-bg-[#13162d] lg:tw-rounded-3xl">
                  <img
                    src="/bg.png"
                    alt="bg-img"
                    className="tw-h-full tw-w-full tw-object-cover"
                  />
                </div>

                <img
                  src={project.img}
                  alt={project.title}
                  className="tw-absolute tw-bottom-0 tw-z-10 tw-max-h-full tw-max-w-full"
                />
              </div>

              <h1 className="tw-line-clamp-1 tw-text-base tw-font-bold md:tw-text-xl lg:tw-text-2xl">
                {project.title}
              </h1>

              <p className="tw-line-clamp-2 tw-text-sm tw-font-light lg:tw-text-xl lg:tw-font-normal">
                {project.des}
              </p>

              <div className="tw-mb-3 tw-mt-7 tw-flex tw-w-full tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center">
                  {project.iconLists.map((Icon, i) => (
                    <div
                      key={i}
                      className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-white/[0.2] tw-bg-black lg:tw-h-10 lg:tw-w-10"
                      style={{ transform: `translateX(-${5 * i * 2}px)` }}
                    >
                      <Icon className="tw-h-4 tw-w-4 tw-text-white lg:tw-h-5 lg:tw-w-5" />
                    </div>
                  ))}
                </div>

                <div className="tw-flex tw-items-center tw-justify-center">
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-flex tw-text-sm tw-text-[#CBACF9] md:tw-text-xs lg:tw-text-xl"
                  >
                    Source Code
                  </a>
                  <FaLocationArrow className="tw-ms-3" color="#cbacf9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `CI=true npx react-scripts test src/components/Projects/RecentProjects.test.js --watchAll=false`
Expected: PASS, 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects/RecentProjects.js src/components/Projects/RecentProjects.test.js
git commit -m "feat: add RecentProjects section matching next-portfolio card design"
```

---

### Task 7: Wire `RecentProjects` into the `/project` route, remove the old card grid

**Files:**
- Modify: `src/components/Projects/Projects.js`
- Delete: `src/components/Projects/ProjectCards.js`

**Interfaces:**
- Consumes: `RecentProjects` default export from `./RecentProjects` (Task 6).
- Produces: `Projects` default export — unchanged signature (no props), still mounted at `/project` in `src/App.js:45` (no change needed there).

- [ ] **Step 1: Replace `Projects.js`'s body**

Old file imports `ProjectCard` and 5 image assets directly and renders a `Row`/`Col` grid of `ProjectCard`s inside a heading + paragraph. Replace the whole file:

```jsx
// src/components/Projects/Projects.js
import React from "react";
import { Container } from "react-bootstrap";

import RecentProjects from "./RecentProjects";
import BlackholeBackground from "../BlackholeBackground";

function Projects() {
  return (
    <Container fluid className="project-section">
      <div className="hero-blackhole-wrap">
        <BlackholeBackground />
      </div>
      <Container>
        <RecentProjects />
      </Container>
    </Container>
  );
}

export default Projects;
```

- [ ] **Step 2: Delete the now-unused card component**

```bash
git rm src/components/Projects/ProjectCards.js
```

- [ ] **Step 3: Run the full test suite**

Run: `CI=true npm test`
Expected: all suites pass (`App.test.js`, `lib/utils.test.js`, `data/projects.test.js`, `components/ui/PinContainer.test.js`, `components/Projects/RecentProjects.test.js`), no failures.

- [ ] **Step 4: Run the production build**

Run: `CI=true npm run build`
Expected: exits 0, `Compiled successfully.`

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects/Projects.js
git commit -m "feat: mount RecentProjects on the /project route, drop old card grid"
```

- [ ] **Step 6: Manual browser verification**

Start the dev server, navigate to `/project`, and confirm against the reference (`next-portfolio` running locally, or the description above):
- Heading reads "A small selection of **recent projects**" with the accent in purple.
- 5 cards render, each with: dark backdrop behind a bottom-anchored project screenshot, title, 2-line-clamped description, a row of tech-icon badges, and a "Source Code" link.
- Hovering a card tilts it (`rotateX`) and fades in glow rings + a "Visit" pill at the top; the pill's `href` opens the project's demo link (Expression Difference) or falls back to its GitHub repo (all others).
- No visual regression elsewhere on the site (nav, hero, about, footer) from the Tailwind/preflight change.

Take a screenshot of `/project` and compare side-by-side with `next-portfolio`'s projects section.
