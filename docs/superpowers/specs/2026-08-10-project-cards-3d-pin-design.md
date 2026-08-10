# Project Cards: 3D Pin Redesign

Date: 2026-08-10

## Goal

Replace the current Bootstrap `Card`-based project grid (`src/components/Projects/Projects.js` + `ProjectCards.js`) with a section that looks exactly like the "A small selection of recent projects" section in `/Users/akd/Github/next-portfolio` (`components/recent-projects.tsx` + `components/ui/3d-pin.tsx`): dark project screenshot on a rounded dark panel, tilt-on-hover 3D pin effect, animated glow rings + beam, "Visit" pill that fades in on hover, and a "Source Code" link with arrow icon.

## Stack decision

Current project is CRA (react-scripts 5) + Bootstrap 5 + react-bootstrap. It has no Tailwind today. Reference component is Tailwind + framer-motion.

- Install `tailwindcss`, `postcss`, `autoprefixer`, `framer-motion`, `clsx`, `tailwind-merge`.
- `tailwind.config.js`: `content` scoped to `./src/**/*.{js,jsx}`, `prefix: "tw-"`, `corePlugins: { preflight: false }`.
  - Prefix avoids collisions with Bootstrap's identically-named utility classes (`.container`, `.mt-3`, `.p-4`, etc. — same class names, different values in each framework).
  - Disabling preflight prevents Tailwind's base reset from touching global typography/box-sizing that Bootstrap and the site's existing CSS already control.
- Ported component classNames get the `tw-` prefix (e.g. reference's `flex mt-10` becomes `tw-flex tw-mt-10`). Visual output is identical; only the source class strings differ from the reference file.
- `src/lib/utils.js`: `cn()` helper via `clsx` + `tailwind-merge`, with `twMerge` configured for the `tw-` prefix.

## New files

- `src/index.css` (or a new `src/tailwind.css` imported once in `index.js`): add the three `@tailwind` directives (`base` layer will be inert due to `preflight: false`, but keep the directive for correct utility generation).
- `src/lib/utils.js` — `cn()` helper.
- `src/components/ui/PinContainer.jsx` — port of `3d-pin.tsx`: `PinContainer` (hover tilt wrapper) + `PinPerspective` (glow rings, beam, "Visit" pill). `next/link` → plain `<a target="_blank" rel="noreferrer noopener">`. `next/image` → plain `<img>`.
- `src/components/Projects/RecentProjects.jsx` — replaces `Projects.js`'s render body: heading "A small selection of `recent projects`" (accent span styled like existing `.purple` class), centered flex-wrap grid of `PinContainer` cards, one per project.
- `src/data/projects.js` — project data array: `{ id, title, des, img, iconLists, link, sourceCode }`.
- `public/bg.png` — copy from next-portfolio's `public/bg.png` (dark backdrop shown behind each project screenshot inside the panel).

## Data mapping (old → new)

| Old (`Projects.js` props) | New (`data/projects.js` field) |
|---|---|
| `imgPath` | `img` |
| `title` | `title` |
| `description` | `des` |
| `ghLink` | `sourceCode` |
| `demoLink` | `link` (falls back to `sourceCode` if absent) |
| `isBlog` | dropped — no blog-specific styling in the reference card |
| *(none)* | `iconLists` — new, array of react-icons components |

## Link behavior (replaces GitHub/Demo buttons)

- Pin hover "Visit" pill → `link` = `demoLink` if the project has one, else falls back to `sourceCode` (GitHub repo).
- Bottom "Source Code" text link + arrow icon → always `sourceCode`.
- Old `Button` (GitHub/Demo) components and the `isBlog` branch are removed; no current project sets `isBlog`, so nothing is lost.

## Per-project tech icons (react-icons, no new image assets)

User-specified stacks, mapped to closest `react-icons` (mostly `react-icons/si`, one `react-icons/md` for generic IoT sensor icon):

- **Sanjeevani**: IoT (`MdSensors`), `SiArduino`, `SiRaspberrypi`, `SiFirebase`, `SiSqlite`
- **DevSearch**: `SiPython`, `SiDjango`, REST API (`TbApi` from `react-icons/tb`)
- **Expression Difference**: `SiWolframmathematica`
- **i-MHM**: IoT (`MdSensors`), `SiArduino`, `SiRaspberrypi`, `SiFirebase`, `SiSqlite`, `SiBlender`
- **Logitraffic**: `SiReact`, `SiDjango`, IoT (`MdSensors`), `SiArduino`, `SiRaspberrypi`, `SiFirebase`, `SiSqlite`, `SiBlender`

Rendered as small overlapping circular badges (icon centered, dark circle background, white border), same layout as the reference's `iconLists.map(...)` block — icons render directly as react-icons components instead of `<Image src={icon}>`.

## Layout / heading

- Heading copy and structure matches reference: `"A small selection of "` + accent span `"recent projects"` (reuse existing `.purple` color, add `tw-` sizing classes matching reference's `.heading` treatment, or reuse the existing `.project-heading` class already in `App.css`/`style.css` — verified during implementation to avoid duplicate heading styles).
- Grid: centered `flex flex-wrap` layout with the same gap/spacing scale as reference (`tw-mt-10 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-24 tw-gap-y-8 tw-p-4`), each card wrapper sized responsively to match reference's breakpoints (`tw-h-[32rem] tw-w-[90vw] sm:tw-h-[41rem] sm:tw-w-[570px] lg:tw-min-h-[32.5rem]`).
- `BlackholeBackground` wrapper in current `Projects.js` stays as-is behind the section (not part of card scope).

## Out of scope

- No changes to project content/copy beyond the des/title already present.
- No changes to other sections of the site.
- `isBlog` special-casing removed (unused).
- `public/grid3.png` (untracked stray file already in repo) is unrelated to this work, left alone.

## Testing

- `npm run build` succeeds with Tailwind wired in.
- Visual check in browser: hover tilt, glow rings animate, "Visit" pill appears with correct href, "Source Code" link opens correct repo, icon row renders correct badges per project, no visible regression to rest of site (nav, other sections) from Tailwind/preflight change.
