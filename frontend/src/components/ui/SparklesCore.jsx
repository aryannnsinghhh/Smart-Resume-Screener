import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const SparklesCore = ({ 
  id = "sparkles",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 20,
  className,
  particleColor = "#FFFFFF"
}) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = Math.floor((width * height) / 10000) * particleDensity;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;

        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;

        this.opacity += (Math.random() - 0.5) * 0.02;
        this.opacity = Math.max(0, Math.min(1, this.opacity));
      }

      draw() {
        ctx.fillStyle = `${particleColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.clearRect(0, 0, width, height);
    };
  }, [particleColor, particleDensity, maxSize, minSize]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("absolute inset-0", className)}
      style={{ background }}
    />
  );
};
