/**
 * Card.jsx
 * Reusable card component with hover effects
 */
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Card({ 
  children, 
  className = "",
  hover = true,
  padding = "lg",
  as: Component = "div",
  ...props 
}) {
  const baseStyles = "rounded-2xl transition-all duration-300 overflow-hidden";
  const glass = "bg-black/40 backdrop-blur-xl border border-white/8 text-neutral-100";
  const hoverStyles = hover ? "hover:shadow-2xl hover:scale-[1.01]" : "";
  
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <motion.div
      as={Component}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        baseStyles,
        glass,
        hoverStyles,
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
