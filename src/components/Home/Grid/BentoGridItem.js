import React from "react";
import GridGlobe from "./GridGlobe";
import techIcons from "./techIcons";
import { techStack } from "./gridData";

function BentoGridItem({
  id,
  className,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}) {
  return (
    <div className={["bento-item", className].filter(Boolean).join(" ")}>
      <div className="bento-item-inner">
        <div className="bento-item-bg">
          {img && <img src={img} alt="" className={imgClassName} />}
        </div>

        {spareImg && (
          <div className={["bento-spare-img", id === 5 && "bento-spare-img-5"].filter(Boolean).join(" ")}>
            <img src={spareImg} alt="" />
          </div>
        )}

        <div className={["bento-item-content", titleClassName].filter(Boolean).join(" ")}>
          {description && <div className="bento-item-description">{description}</div>}
          <div className="bento-item-title">{title}</div>

          {id === 2 && <GridGlobe />}

          {id === 3 && (
            <div className="tech-pills">
              {techStack.map((item) => {
                const Icon = techIcons[item];
                return (
                  <span key={item} className="tech-pill">
                    {Icon && <Icon className="tech-pill-icon" />}
                    {item}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BentoGridItem;
