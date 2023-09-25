import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import expressiondiff from "../../Assets/Projects/expressiondiff.png";
import sanjeevani from "../../Assets/Projects/sanjeevani.gif";
import imhm from "../../Assets/Projects/imhm.png";
import django_tut from "../../Assets/Projects/Screenshot 2023-04-25 at 4.49.35 PM.png";
import logitraffic from "../../Assets/Projects/Logitraffic_Dashboard.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={sanjeevani}
              isBlog={false}
              title="Sanjeevani"
              description="Sanjeevani is an IoT web-based Real-Time Health Monitoring and Medical Consultation System.
              The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like Heart-Rate, Blood Pressure, Temperature, ECG Function, Glucose Level, Dissolved Oxygen Level, etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase and Udibots for storage in the database and henceforth is accessible by the authenticated person(doctor and the user)."
              ghLink="https://github.com/amandewatnitrr/Team-X_HealthCare-Sanjeevani"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={django_tut}
              isBlog={false}
              title="DevSearch"
              description="A Platform where Software Developer can share there projects on a platform and get reviews on it from other developers.
              The Developers can also showcase about there skills over there profile. They can also contact each other via message feature.
              "
              ghLink="https://github.com/amandewatnitrr/django-tutorial"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={expressiondiff}
              isBlog={false}
              title="Expression Difference"
              description="
              The Purpose of the Project is to design a function that tells difference between two given expressions and denotes the changes that need to be made to reference expression(expr_1) to make it appear same as another expression (expr_2) and produce the same evaluation. The approach involves visualizing these expressions as trees and record these differences in expression as a list of  “Insert”, “Delete” and “ReplacePart” operations which on being applied to reference expression(expr_1) results in the other expression(expr_2). 
              The Problem of identifying Differences in Expressions has a very large scale application, as working with large expressions in Wolfram can make code look messy . Any piece of code should be able to clearly demonstrate what it' s doing and should be clearly distinguishable . The ExpressionDifference Function does the same . It clearly demonstrates how one expression can be converted into other expression with the use of Insert, ReplacePart and Delete operations . We explored that while working with expressions in Wolfram, sometime it becomes difficult to point out the differences between 2 expressions . Hence, ExpressionDifference solves this problem ."
              ghLink="https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP"
              demoLink="https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={imhm}
              isBlog={false}
              title="i-MHM"
              description="i-MHM is an ML/IoT based Real-Time Mental Health Monitoring and Consultation System.
              The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like ECG, body posture etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase for storage in the database and henceforth is accessible by the authenticated person(Parents and Counsellor).
              The app offers people better access to healthcare support beyond their bounds of convenience and connects them to doctors, specialists and healthcare experts on a digital platform, which provides them access to an online expert without a physical visit. For counsellors and parents, it includes a feature to view-track the medical record of the pupil regularly and efficiently."
              ghLink="https://github.com/amandewatnitrr/codeutsava"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={logitraffic}
              isBlog={false}
              title="Logitraffic"
              description="LogiTraffic is an IoT based Deep Learning Powered Traffic Management and Theft Detection Solution. It’s an online website platform using which user can keep check on certain real-time parameters associated with the vehicle which includes fuel-level, GPS location, Brake System Temperature, Speed, Traffic Forecasting using Vehicle Detection and obtaining vehicle count through different road nodes and predicting Traffic Congestion/Jams. In case the user suspects his/her car has been stolen by logging in using the credentials one can lock the vehicles and see driver’s real time video stream and a picture of the driver is downloaded on the system so that it can be used for further investigation and police cases. (YouTube Video Presentation by Team Aztecs: https://youtu.be/rP2OGjZJ5NY) – Presented in E-Ujjwala Hackathon 2020 by Birsa Institute of Technology, Jharkhand (Team Aztecs - Finalists)"
              ghLink="https://github.com/amandewatnitrr/Aztecs-LogiTraffic"
            />
          </Col>

          
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
