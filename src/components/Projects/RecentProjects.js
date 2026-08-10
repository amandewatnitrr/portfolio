import React from "react";
import { FaLocationArrow } from "react-icons/fa6";

import { projects, getVisitLink } from "../../data/projects";
import { PinContainer } from "../ui/PinContainer";

const ICON_COLORS = {
  MdSensors: "#38BDF8",
  TbApi: "#22C55E",
  SiArduino: "#00979D",
  SiRaspberrypi: "#A22846",
  SiFirebase: "#FFCA28",
  SiSqlite: "#003B57",
  SiPython: "#3776AB",
  SiDjango: "#092E20",
  SiWolframmathematica: "#DD1100",
  SiBlender: "#F5792A",
  SiReact: "#61DAFB",
  SiGnubash: "#4EAA25",
  SiLinux: "#FCC624",
  SiDocker: "#2496ED",
  SiGit: "#F05032",
  SiJavascript: "#F7DF1E",
};

function RecentProjects() {
  return (
    <section id="projects" className="tw-py-20">
      <h1 className="project-heading">
        A small selection of{" "}
        <strong className="purple">recent projects</strong>
      </h1>

      <div className="tw-mt-10 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-24 tw-gap-y-8 tw-p-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="tw-flex tw-h-[32rem] tw-w-[90vw] tw-items-center tw-justify-center sm:tw-h-[41rem] sm:tw-w-[570px] lg:tw-min-h-[32.5rem]"
          >
            <PinContainer
              title="Visit"
              href={getVisitLink(project)}
              className="tw-rounded-2xl tw-bg-[#13162d] tw-p-4"
            >
              <div className="tw-relative tw-mb-10 tw-flex tw-h-[30vh] tw-w-[80vw] tw-items-center tw-justify-center tw-overflow-hidden sm:tw-h-[40vh] sm:tw-w-[570px]">
                <div className="tw-relative tw-h-full tw-w-full tw-overflow-hidden tw-bg-[#13162d] lg:tw-rounded-3xl">
                  <img
                    src="/bg.png"
                    alt="bg-img"
                    className="tw-h-full tw-w-full tw-object-cover"
                  />
                </div>

                <img
                  src={project.img}
                  alt={project.title}
                  className="tw-absolute tw-bottom-0 tw-z-10 tw-max-h-full tw-max-w-full"
                />
              </div>

              <h1 className="tw-line-clamp-1 tw-w-full tw-text-left tw-text-base tw-font-bold tw-text-white md:tw-text-xl lg:tw-text-2xl">
                {project.title}
              </h1>

              <p className="tw-line-clamp-2 tw-w-full tw-text-left tw-text-sm tw-font-light tw-text-white lg:tw-text-xl lg:tw-font-normal">
                {project.des}
              </p>

              <div className="tw-mb-3 tw-mt-7 tw-flex tw-w-full tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center">
                  {project.iconLists.map((Icon, i) => (
                    <div
                      key={i}
                      className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-white/[0.2] tw-bg-black lg:tw-h-10 lg:tw-w-10"
                      style={{ transform: `translateX(-${5 * i * 2}px)` }}
                    >
                      <Icon
                        className="tw-h-5 tw-w-5 lg:tw-h-6 lg:tw-w-6"
                        style={{ color: ICON_COLORS[Icon.name] || "#ffffff" }}
                      />
                    </div>
                  ))}
                </div>

                <div className="tw-flex tw-items-center tw-justify-center">
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-flex tw-text-sm tw-text-[#CBACF9] md:tw-text-xs lg:tw-text-xl"
                  >
                    Source Code
                  </a>
                  <FaLocationArrow className="tw-ms-3" color="#cbacf9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;
