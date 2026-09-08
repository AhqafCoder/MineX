"use client";

import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";

interface InteractiveRoverProps {
  src: string;
  alt: string;
}

export default function InteractiveRover({ src, alt }: InteractiveRoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center of container (-1 to 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Max rotation in degrees
    const maxRotation = 15;

    setRotation({
      x: -y * maxRotation, // Move mouse up -> rotateX positive
      y: x * maxRotation,  // Move mouse right -> rotateY positive
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset to initial state with smooth transition
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "relative",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovering ? "scale(1.05)" : "scale(1)"}`,
          transition: isHovering ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow effect behind the image that shifts based on mouse */}
        <div
          style={{
            position: "absolute",
            inset: "-10%",
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)",
            opacity: isHovering ? 1 : 0,
            transform: `translateZ(-50px) translateX(${rotation.y * -2}px) translateY(${rotation.x * -2}px)`,
            transition: isHovering ? "opacity 0.3s ease-out, transform 0.1s ease-out" : "opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        />
        
        <Image
          src={src}
          alt={alt}
          width={600}
          height={450}
          priority
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
            display: "block",
            position: "relative",
            zIndex: 1,
            filter: `drop-shadow(${rotation.y * -1}px ${rotation.x * 1 + 15}px 25px rgba(0,0,0,0.25))`,
            transition: isHovering ? "filter 0.1s ease-out" : "filter 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
