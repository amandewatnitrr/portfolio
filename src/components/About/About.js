import React from "react";
import { Container } from "react-bootstrap";
import Github from "./Github";
import TechStackPyramid from "./TechStackPyramid";
import Toolstack from "./Toolstack";
import BlackholeBackground from "../BlackholeBackground";

function About() {
  return (
    <Container fluid className="about-section">
      <div className="hero-blackhole-wrap">
        <BlackholeBackground />
      </div>
      <Container>
        <TechStackPyramid />

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
