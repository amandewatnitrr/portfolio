import {
  SiReact,
  SiCplusplus,
  SiGnubash,
  SiDjango,
  SiKubernetes,
  SiMysql,
  SiDocker,
  SiPython,
  SiJavascript,
  SiHelm,
  SiArduino,
  SiWolframmathematica,
} from "react-icons/si";
import { FaUserSecret, FaMicrochip } from "react-icons/fa";

// Maps tech-pill label -> icon component, so BentoGridItem can render
// a brand icon next to each label in the "My tech stack" card.
const techIcons = {
  "React.js": SiReact,
  "C++": SiCplusplus,
  Bash: SiGnubash,
  Django: SiDjango,
  Kubernetes: SiKubernetes,
  MySQL: SiMysql,
  Docker: SiDocker,
  Python: SiPython,
  JavaScript: SiJavascript,
  Helm: SiHelm,
  Arduino: SiArduino,
  "Ethical Hacking": FaUserSecret,
  "Mathematica/Wolfram": SiWolframmathematica,
  IoT: FaMicrochip,
};

export default techIcons;
