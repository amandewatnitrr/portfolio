// Ported from next-portfolio's data/index.ts (gridItems, techStack),
// trimmed to the 5 cards requested and re-themed with this site's own
// tech stack / phrases. className/imgClassName/titleClassName here are
// this project's own plain-CSS classes (see Grid.css) rather than the
// source's Tailwind utility strings.
export const gridItems = [
  {
    id: 1,
    title: "May the force be with you",
    description: "",
    className: "bento-item-1",
    imgClassName: "bento-img-cover",
    titleClassName: "bento-title-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "bento-item-2",
    imgClassName: "",
    titleClassName: "bento-title-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "bento-item-3",
    imgClassName: "",
    titleClassName: "bento-title-3",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "bento-item-4",
    imgClassName: "bento-img-cover",
    titleClassName: "bento-title-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title: "Currently learning Ethical Hacking",
    description: "The Inside Scoop",
    className: "bento-item-5",
    imgClassName: "bento-img-corner",
    titleClassName: "bento-title-5",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
];

// Next.js / Vue.js / AWS / Typescript swapped for C++ / Django / Kubernetes / Bash,
// MongoDB swapped for MySQL, plus Mathematica/Wolfram and IoT added.
// Grouped so related tech sits adjacent - languages, then web stack, then
// devops (Kubernetes -> Docker -> Helm, in that thought-order), then the
// rest.
export const techStack = [
  "C++",
  "Python",
  "JavaScript",
  "Bash",
  "React.js",
  "Django",
  "Kubernetes",
  "Docker",
  "Helm",
  "MySQL",
  "IoT",
  "Arduino",
  "Ethical Hacking",
  "Mathematica/Wolfram",
];
