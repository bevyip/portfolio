import React, { useEffect } from "react";

interface SceneProps {
  onExpand: () => void;
  onComplete: () => void;
  onGridStart: () => void;
  shadowRef: React.RefObject<any>;
  isExpanded: boolean;
}

export const Scene: React.FC<SceneProps> = ({ onComplete, isExpanded }) => {
  // Simulating the intro animation logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Simulate a 2s intro sequence

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`w-full h-full flex items-center justify-center bg-black transition-opacity duration-500 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Intro Animation Scene</h2>
        <p className="text-gray-400">Loading experience...</p>
        <div className="mt-4 w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};