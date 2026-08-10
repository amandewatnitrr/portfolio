import React from "react";
import {
  SiLinux,
  SiVisualstudiocode,
  SiPostman,
  SiHeroku,
  SiVercel,
  SiGithub,
  SiFigma,
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiRaspberrypi,
  SiIntellijidea,
  SiApple,
  SiWindows,
  SiBlender,
} from "react-icons/si";
import { DiDebian, DiGoogleCloudPlatform } from "react-icons/di";
import { FaRobot } from "react-icons/fa";
import { TbRobot } from "react-icons/tb";

// Same pyramid layout as TechStackPyramid, reusing its CSS classes -
// this site's own tool list (see the old Toolstack.js), plus Claude AI,
// GitHub Copilot and Premiere Pro. The two AI assistants have no brand
// icon in this react-icons version, so they get generic robot glyphs
// with the real name as label. Rows grouped by domain: IDEs/AI coding
// tools, cloud/deploy, OS/platform, creative/design, hardware.
// Docker/Kubernetes moved to Technical Skillset (with Helm).
const toolStack = [
  // Row 1 - IDEs, version control, AI coding tools
  [
    { name: "VS Code", Icon: SiVisualstudiocode },
    { name: "IntelliJ IDEA", Icon: SiIntellijidea },
    { name: "GitHub", Icon: SiGithub },
    { name: "Claude AI", Icon: FaRobot },
    { name: "GitHub Copilot", Icon: TbRobot },
  ],
  // Row 2 - cloud/deploy
  [
    { name: "Google Cloud", Icon: DiGoogleCloudPlatform },
    { name: "Vercel", Icon: SiVercel },
    { name: "Heroku", Icon: SiHeroku },
    { name: "Postman", Icon: SiPostman },
  ],
  // Row 3 - OS/platform
  [
    { name: "Linux", Icon: SiLinux },
    { name: "Debian", Icon: DiDebian },
    { name: "Windows", Icon: SiWindows },
    { name: "Apple", Icon: SiApple },
  ],
  // Row 4 - creative/design
  [
    { name: "Figma", Icon: SiFigma },
    { name: "Adobe Illustrator", Icon: SiAdobeillustrator },
    { name: "After Effects", Icon: SiAdobeaftereffects },
    { name: "Premiere Pro", Icon: SiAdobepremierepro },
  ],
  // Row 5 - tip of pyramid
  [
    { name: "Raspberry Pi", Icon: SiRaspberrypi },
    { name: "Blender", Icon: SiBlender },
  ],
];

function ToolStackPyramid() {
  return (
    <div className="techstack-pyramid-section">
      <h1 className="project-heading">
        <strong className="purple">Tools</strong> I use
      </h1>

      <div className="techstack-pyramid">
        {toolStack.map((row, rowIndex) => (
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

export default ToolStackPyramid;
