import React from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { BouncingBall } from "./BouncingBall";

export const Scene = ({
  onExpand,
  onComplete,
  onGridStart,
  shadowRef,
  isExpanded,
}) => {
  return (
    <div
      className="relative w-full"
      style={{ height: "100vh", minHeight: "100vh" }}
    >
      <Canvas
        dpr={[1, 2]}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none", // Allow clicks to pass through when expanded
        }}
      >
        {/* Camera Setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />

        {/* Background matches page background - dark when expanded, white otherwise */}
        <color
          attach="background"
          args={isExpanded ? ["#0a0a0a"] : ["#ffffff"]}
        />

        {/* Simple Studio Lighting */}
        <ambientLight intensity={0.8} />
        {/* Reduced intensity to 1.0 for less harsh lighting */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          color="#ffffff"
        />

        {/* The Bouncing Ball */}
        <BouncingBall
          onExpand={onExpand}
          onComplete={onComplete}
          onGridStart={onGridStart}
          shadowRef={shadowRef}
        />
      </Canvas>
      {/* 2D Shadow - synced with ball position */}
      <div
        ref={shadowRef}
        className="absolute left-1/2 w-32 h-8 bg-black rounded-[100%] blur-md hardware-accel pointer-events-none"
        style={{
          zIndex: 10,
          bottom: "180px", // Position at ground level where ball hits (moved up)
        }}
      />
    </div>
  );
};
