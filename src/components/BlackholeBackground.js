import React from "react";

// Reusable hero glow — same markup Home uses, dropped at the top of every
// page's hero section so the blackhole isn't Home-exclusive anymore.
function BlackholeBackground() {
  return (
    <video autoPlay muted loop playsInline className="blackhole-video">
      <source src="/videos/blackhole.webm" type="video/webm" />
    </video>
  );
}

export default BlackholeBackground;
