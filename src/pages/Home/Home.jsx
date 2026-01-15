import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import Footer from "../../components/Footer/Footer";
import LandingSection from "../../components/LandingSection/LandingSection";
import WorkSection from "../../components/WorkSection/WorkSection";

const Home = () => {
  const { hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Handle hash fragments on page load/refresh
    if (hash) {
      const targetId = hash.substring(1); // Remove the #
      // Use a longer delay to ensure DOM and layout are fully ready
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          if (lenis) {
            lenis.scrollTo(targetElement, {
              offset: 0,
              duration: 0, // Instant scroll on page load
            });
          } else {
            targetElement.scrollIntoView({ behavior: "instant" });
          }
        }
      }, 200); // Delay to ensure DOM and layout calculations are ready

      return () => clearTimeout(timer);
    }
  }, [hash, lenis]);

  return (
    <div className="relative w-full">
      {/* 
        Section 1: Fixed Landing Section 
        It stays fixed at the top (z-0) 
      */}
      <LandingSection />

      {/* 
        Section 2: Work Section Curtain
        It has a margin-top of 100vh so it starts below the viewport.
        As the user scrolls, this 'relative' container moves up, covering the fixed Landing.
        This achieves the requested parallax curtain effect naturally and performantly.
      */}
      <div className="relative z-10 mt-[100vh] bg-[#0f0f0f]">
        <WorkSection />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
