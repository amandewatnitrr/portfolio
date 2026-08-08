import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "IoT Developer",
          "Cybersec Enthusiast",
          "Frontend Developer",
          "Open Source Contributor",
        ],
        autoStart: true,
        loop: true,
        delay: "natural",
        deleteSpeed: "natural",
      }}
    />
  );
}

export default Type;
