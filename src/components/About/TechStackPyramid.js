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
} from "react-icons/si";
import { FcElectronics } from "react-icons/fc";
import { MdDesignServices } from "react-icons/md";

// Pyramid layout ported from portfolio-website's TechStackNew.tsx -
// structure/styling only. No video background (kept this page's own
// BlackholeBackground) and the skill list is this site's own (see
// Techstack.js), not the source's.
const techStack = [
  // Row 1 - core languages/frameworks (widest)
  [
    { name: "C++", Icon: CgCPlusPlus },
    { name: "JavaScript", Icon: DiJavascript1 },
    { name: "Python", Icon: DiPython },
    { name: "Java", Icon: SiJava },
    { name: "React", Icon: DiReact },
    { name: "Node.js", Icon: DiNodejs },
  ],
  // Row 2 - backend/tools
  [
    { name: "Django", Icon: SiDjango },
    { name: "Firebase", Icon: SiFirebase },
    { name: "Git", Icon: DiGit },
    { name: "Bash", Icon: SiGnubash },
    { name: "Raspberry Pi", Icon: SiRaspberrypi },
  ],
  // Row 3 - IoT/hardware/research
  [
    { name: "Arduino", Icon: SiArduino },
    { name: "Wolfram", Icon: SiWolfram },
    { name: "Electronics", Icon: FcElectronics },
  ],
  // Row 4 - tip of pyramid
  [
    { name: "Gradle", Icon: SiGradle },
    { name: "UI/UX Design", Icon: MdDesignServices },
  ],
];

function TechStackPyramid() {
  return (
    <div className="techstack-pyramid-section">
      <h1 className="project-heading">
        Professional <strong className="purple">Skillset</strong>
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
