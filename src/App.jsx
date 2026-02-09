import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "./components/Nav/Nav";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop/BackToTop";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Work from "./pages/Work/Work";
import VenmoCaseStudy from "./pages/VenmoCaseStudy/VenmoCaseStudy";
import MoodleCaseStudy from "./pages/MoodleCaseStudy/MoodleCaseStudy";
import WholeFoodsCaseStudy from "./pages/WholeFoodsCaseStudy/WholeFoodsCaseStudy";
import ConfidoCaseStudy from "./pages/ConfidoCaseStudy/ConfidoCaseStudy";
import NotFound from "./pages/NotFound/NotFound";
import { PlayPageProvider } from "./contexts/PlayPageContext";
import "./App.css";

const LenisScrollTriggerIntegration = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);

      return () => {
        lenis.off("scroll", ScrollTrigger.update);
      };
    }
  }, [lenis]);

  return null;
};

function App() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false, // Keep native scroll on mobile
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <Router>
        <LenisScrollTriggerIntegration />
        <PlayPageProvider>
          <ScrollToTop />
          <BackToTop />
          <div className="app min-h-screen relative">
            {/* Nav - fixed at top, overlays all content */}
            <div
              className="fixed top-0 left-0 w-full"
              style={{
                zIndex: 100,
                pointerEvents: "none",
              }}
            >
              <div style={{ pointerEvents: "auto" }}>
                <Nav />
              </div>
            </div>
            {/* Routes - main content */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<Work />} />
              <Route path="/venmo" element={<VenmoCaseStudy />} />
              <Route path="/moodle" element={<MoodleCaseStudy />} />
              <Route path="/wholefoods" element={<WholeFoodsCaseStudy />} />
              <Route path="/confido" element={<ConfidoCaseStudy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </PlayPageProvider>
      </Router>
    </ReactLenis>
  );
}

export default App;
