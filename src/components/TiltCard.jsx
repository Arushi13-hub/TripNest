import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.03,
  glare = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-performance smooth Framer Motion springs (stiffness: 260, damping: 20)
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });

  // 3D rotation transforms: moving mouse up tilts card forward, moving down tilts backward (up to ±12deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic light glare gradient coordinates (0% to 100%)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly reset rotation to 0deg on onMouseLeave via springs
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-[1000px] w-full h-full" style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        animate={{
          scale: isHovered ? scale : 1,
        }}
        transition={{
          scale: { duration: 0.25, ease: 'easeOut' },
        }}
        className={`relative select-none ${className}`}
        {...props}
      >
        {/* Card Content with 3D preservation */}
        <div 
          style={{ 
            transformStyle: 'preserve-3d',
          }} 
          className="h-full w-full"
        >
          {children}
        </div>

        {/* Soft radial light glare following cursor: rgba(242, 218, 206, 0.18) */}
        {glare && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-30 transition-opacity duration-300 overflow-hidden"
            style={{
              transform: 'translateZ(35px)',
              transformStyle: 'preserve-3d',
              opacity: isHovered ? 1 : 0,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 300px at ${gx} ${gy}, rgba(242, 218, 206, 0.18) 0%, rgba(242, 218, 206, 0) 70%)`
              ),
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
