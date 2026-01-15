import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineScene({ onLoadComplete }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (spline) => {
    // Wait a bit more to ensure lighting is fully rendered
    setTimeout(() => {
      setIsLoaded(true);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 200); // Small delay to ensure lighting is fully rendered
  };

  return (
    <div
      className="w-full h-full"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Spline
        className="w-full h-full"
        scene="https://prod.spline.design/eNKjcezqd6RoKRwL/scene.splinecode"
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
