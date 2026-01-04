import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Light Mode Spotlight - Soft Blue Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:hidden"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
        }}
      />

      {/* Dark Mode Spotlight - Cyan Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden dark:block"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.2), transparent 50%)`,
        }}
      />

      {/* Subtle border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300"
        style={{
          opacity: opacity * 0.5,
          boxShadow: `inset 0 0 0 1px rgba(59, 130, 246, 0.1)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300 hidden dark:block"
        style={{
          opacity: opacity * 0.7,
          boxShadow: `inset 0 0 0 1px rgba(6, 182, 212, 0.2), 0 0 20px rgba(6, 182, 212, 0.1)`,
        }}
      />

      {children}
    </div>
  );
}
