import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple"><b>Aman Kumar Dewangan</b> </span>
            from <span className="purple"> Raipur, Chhattisgarh, India.</span>
            <br />I am currently working as <span className="purple">Edison Engineer in GE Healthcare</span>. I completed my 
            <span className="purple"> B.Tech in ELectrical Engineering from National Institute of Technology Raipur.</span>
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Writting Poems
            </li>
            <li className="about-activity">
              <ImPointRight /> Digital Art/Drwaing
            </li>
            <li className="about-activity">
              <ImPointRight /> Video Editing
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "One my way to find the One Piece"{" "}
          </p>
          <footer className="blockquote-footer">AkD</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
