import React from "react";
import { Container } from "react-bootstrap";
import Github from "./Github";
import Techstack from "./Techstack";
import Toolstack from "./Toolstack";
import BlackholeBackground from "../BlackholeBackground";

function About() {
  return (
    <Container fluid className="about-section">
      <div className="hero-blackhole-wrap">
        <BlackholeBackground />
      </div>
      <Container>
        <h1 className="project-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1>

        <Techstack />

        <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1>
        <Toolstack />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
