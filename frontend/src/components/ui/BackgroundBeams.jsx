import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BackgroundBeams = ({ className }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
  ];

  return (
    <div
      className={cn(
        "absolute h-full w-full inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)] overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute h-full w-full pointer-events-none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "rgb(59, 130, 246)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke="url(#grad1)"
            strokeWidth="2"
            fill="none"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: index * 2,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
