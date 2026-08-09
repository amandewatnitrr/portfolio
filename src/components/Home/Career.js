import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    position: "Software Engineer",
    company: "GE Healthcare",
    period: "Aug 2022 - Present",
    description:
      "Rolled out a real-time Grafana dashboard, cutting incident response time by 40%. Secured service-to-service traffic with Kong API Gateway, then led the migration to APISIX, adding test automation and a secure secret-handling mechanism along the way.",
  },
  {
    position: "Edison Engineer",
    company: "GE Healthcare",
    period: "Aug 2022 - Jul 2024",
    description:
      "Migrated the application to a Microservice Architecture, cutting deployment time by 10%. Built a Python pipeline service, a document-inquiry chatbot, and a Kafka + Elasticsearch log analysis system to boost data insight generation.",
  },
  {
    position: "Research Intern",
    company: "Wolfram",
    period: "Jun 2021 - Jul 2021",
    description:
      "Designed an expression-alignment algorithm using tree-based representation and transformation operations, resolving mismatched expressions into identical evaluations.",
  },
];

const getDisplayYear = (period) => {
  if (period.includes("Present")) return "NOW";
  if (period.includes(" - ")) return period.split(" - ")[0];
  return period;
};

function Career() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const careerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".career-section",
          start: "top 50%",
          end: "bottom 30%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      careerTimeline
        .fromTo(
          ".career-timeline",
          { maxHeight: "0%" },
          { maxHeight: "100%", duration: 1, ease: "none" },
          0
        )
        .fromTo(
          ".career-timeline",
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          0
        )
        .fromTo(
          ".career-info-box",
          { opacity: 0 },
          { opacity: 1, stagger: 0.1, duration: 0.5 },
          0
        )
        .fromTo(
          ".career-dot",
          { animationIterationCount: "infinite" },
          { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
          0
        );
    });

    return () => ctx.revert();
  }, []);

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
