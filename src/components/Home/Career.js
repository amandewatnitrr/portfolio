import React from "react";

const experiences = [
  {
    position: "Software Engineer",
    company: "GE Healthcare",
    period: "Aug 2022 - Present",
    description:
      "Migrated application to Microservice Architecture, cutting deployment time by 10%. Built a Python pipeline service, a real-time Grafana dashboard, a document-inquiry chatbot, and a Kafka + Elasticsearch log analysis system. Tech: Java, Groovy, Python, C++, PostgreSQL, Shell Scripting, Jenkins, Grafana.",
  },
  {
    position: "Research Intern",
    company: "Wolfram",
    period: "Jun 2021 - Jul 2021",
    description:
      "Developed a function for aligning two expressions by generating transformation operations that yield identical evaluations, using tree-based representation and computational techniques.",
  },
];

const getDisplayYear = (period) => {
  if (period.includes("Present")) return "NOW";
  if (period.includes(" - ")) return period.split(" - ")[0];
  return period;
};

function Career() {
  return (
    <div className="career-section">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experiences.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>{getDisplayYear(exp.period)}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Career;
