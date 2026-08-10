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
