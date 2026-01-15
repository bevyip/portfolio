import React, { useLayoutEffect } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayPageProvider } from "./contexts/PlayPageContext";
import Play from "./Play";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// Component to integrate Lenis with GSAP ScrollTrigger
const LenisScrollTriggerIntegration = () => {
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (!lenis) return;

    // Update ScrollTrigger on Lenis scroll to handle pinned elements correctly
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis for perfect sync
    // This requires autoRaf={false} on the ReactLenis component
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Disable lag smoothing to prevent stuttering during heavy calculations
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
};

function App() {
  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <LenisScrollTriggerIntegration />
      <PlayPageProvider>
        <HashRouter>
          <div className="app min-h-screen relative">
            <Routes>
              <Route path="/" element={<Navigate to="/play" replace />} />
              <Route path="/play" element={<Play />} />
            </Routes>
          </div>
        </HashRouter>
      </PlayPageProvider>
    </ReactLenis>
  );
}

export default App;
