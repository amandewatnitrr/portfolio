import React from "react";
import { Container } from "react-bootstrap";
import Github from "./Github";
import TechStackPyramid from "./TechStackPyramid";
import ToolStackPyramid from "./ToolStackPyramid";
import BlackholeBackground from "../BlackholeBackground";

function About() {
  return (
    <Container fluid className="about-section">
      <div className="hero-blackhole-wrap">
        <BlackholeBackground />
      </div>
      <Container>
        <TechStackPyramid />

        <ToolStackPyramid />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
