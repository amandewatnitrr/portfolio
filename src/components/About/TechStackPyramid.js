import React from "react";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiPython,
  DiGit,
} from "react-icons/di";
import {
  SiFirebase,
  SiArduino,
  SiWolfram,
  SiJava,
  SiRaspberrypi,
  SiGnubash,
  SiGradle,
  SiDjango,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiHelm,
} from "react-icons/si";
import { FcElectronics } from "react-icons/fc";
import { MdDesignServices } from "react-icons/md";

// Pyramid layout ported from portfolio-website's TechStackNew.tsx -
// structure/styling only. No video background (kept this page's own
// BlackholeBackground) and the skill list is this site's own (see
// Techstack.js), not the source's. Rows are loosely grouped by domain
// (frontend / backend+languages / cloud+tools / hardware / research)
// with explicitly-related skills (HTML, CSS, React) kept adjacent.
const techStack = [
  // Row 1 - frontend (widest)
  [
    { name: "HTML", Icon: SiHtml5 },
    { name: "CSS", Icon: SiCss3 },
    { name: "React", Icon: DiReact },
    { name: "JavaScript", Icon: DiJavascript1 },
    { name: "Bootstrap", Icon: SiBootstrap },
    { name: "Tailwind", Icon: SiTailwindcss },
    { name: "Node.js", Icon: DiNodejs },
  ],
  // Row 2 - backend/languages
  [
    { name: "Django", Icon: SiDjango },
    { name: "Python", Icon: DiPython },
    { name: "Java", Icon: SiJava },
    { name: "C++", Icon: CgCPlusPlus },
    { name: "MySQL", Icon: SiMysql },
    { name: "PostgreSQL", Icon: SiPostgresql },
  ],
  // Row 3 - devops/cloud
  [
    { name: "Kubernetes", Icon: SiKubernetes },
    { name: "Docker", Icon: SiDocker },
    { name: "Helm", Icon: SiHelm },
    { name: "GCP", Icon: SiGooglecloud },
    { name: "Git", Icon: DiGit },
    { name: "Bash", Icon: SiGnubash },
  ],
  // Row 4 - IoT/hardware/tools
  [
    { name: "Arduino", Icon: SiArduino },
    { name: "Raspberry Pi", Icon: SiRaspberrypi },
    { name: "Electronics", Icon: FcElectronics },
    { name: "Gradle", Icon: SiGradle },
  ],
  // Row 5 - tip of pyramid
  [
    { name: "Firebase", Icon: SiFirebase },
    { name: "Wolfram", Icon: SiWolfram },
    { name: "UI/UX Design", Icon: MdDesignServices },
  ],
];

function TechStackPyramid() {
  return (
    <div className="techstack-pyramid-section techstack-pyramid-section-top">
      <h1 className="project-heading">
        Technical <strong className="purple">Skillset</strong>
      </h1>

      <div className="techstack-pyramid">
        {techStack.map((row, rowIndex) => (
          <div key={rowIndex} className="techstack-row">
            {row.map(({ name, Icon }) => (
              <div key={name} className="techstack-item" title={name}>
                <Icon />
                <span>{name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechStackPyramid;
