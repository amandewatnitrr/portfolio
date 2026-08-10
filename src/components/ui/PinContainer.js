import React, { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "tw-group/pin tw-relative tw-z-50 tw-cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="tw-absolute tw-left-1/2 tw-top-1/2 tw-ml-[0.09375rem] tw-mt-4 tw--translate-x-1/2 tw--translate-y-1/2"
      >
        <div
          style={{ transform }}
          className="tw-absolute tw-left-1/2 tw-top-1/2 tw-flex tw-items-start tw-justify-start tw-overflow-hidden tw-rounded-2xl tw-border tw-border-white/[0.1] tw-p-4 tw-shadow-[0_8px_16px_rgb(0_0_0/0.4)] tw-transition tw-duration-700 group-hover/pin:tw-border-white/[0.2]"
        >
          <div className={cn("tw-relative tw-z-50", className)}>
            {children}
          </div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({ title, href }) => {
  return (
    <motion.div className="tw-z-[60] tw-flex tw-h-80 tw-w-full tw-items-center tw-justify-center tw-opacity-0 tw-transition tw-duration-500 group-hover/pin:tw-opacity-100">
      <div className="tw-inset-0 tw--mt-7 tw-h-full tw-w-full tw-flex-none">
        <div className="tw-absolute tw-inset-x-0 tw-top-0 tw-flex tw-justify-center">
          <a
            href={href || "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="tw-relative tw-z-10 tw-flex tw-items-center tw-space-x-2 tw-rounded-full tw-bg-zinc-950 tw-px-4 tw-py-0.5 tw-ring-1 tw-ring-white/10"
          >
            <span className="tw-relative tw-z-20 tw-inline-block tw-py-0.5 tw-text-xs tw-font-bold tw-text-white">
              {title}
            </span>
            <span
              aria-hidden
              className="tw-absolute tw--bottom-0 tw-left-[1.125rem] tw-h-px tw-w-[calc(100%-2.25rem)] tw-bg-gradient-to-r tw-from-emerald-400/0 tw-via-emerald-400/90 tw-to-emerald-400/0 tw-transition-opacity tw-duration-500 group-hover/btn:tw-opacity-40"
            />
          </a>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="tw-absolute tw-left-1/2 tw-top-1/2 tw-ml-[0.09375rem] tw-mt-4 tw--translate-x-1/2 tw--translate-y-1/2"
        >
          {[0, 2, 4].map((delay) => (
            <motion.div
              key={delay}
              initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: 1, z: 0 }}
              transition={{ duration: 6, repeat: Infinity, delay }}
              className="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-[11.25rem] tw-w-[11.25rem] tw-rounded-[50%] tw-bg-sky-500/[0.08] tw-shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              aria-hidden
            />
          ))}
        </div>

        <>
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-h-20 tw-w-px tw-translate-y-[14px] tw-bg-gradient-to-b tw-from-transparent tw-to-cyan-500 tw-blur-[2px] group-hover/pin:tw-h-40"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-h-20 tw-w-px tw-translate-y-[14px] tw-bg-gradient-to-b tw-from-transparent tw-to-cyan-500 group-hover/pin:tw-h-40"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-z-40 tw-h-[4px] tw-w-[4px] tw-translate-x-[1.5px] tw-translate-y-[14px] tw-rounded-full tw-bg-cyan-600 tw-blur-[3px]"
          />
          <motion.div
            aria-hidden
            className="tw-absolute tw-bottom-1/2 tw-right-1/2 tw-z-40 tw-h-[2px] tw-w-[2px] tw-translate-x-[0.5px] tw-translate-y-[14px] tw-rounded-full tw-bg-cyan-300"
          />
        </>
      </div>
    </motion.div>
  );
};

export default PinContainer;
