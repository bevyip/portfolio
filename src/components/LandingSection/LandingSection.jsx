import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import SplineScene from "./SplineScene";
import "./LandingSection.css";

gsap.registerPlugin(SplitText);

const LandingSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentRef = useRef(null);
  const splineContainerRef = useRef(null);
  const leftTextRef = useRef(null);
  const delightfulRef = useRef(null);
  const rightTextRef = useRef(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const animationStartedRef = useRef(false);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  useEffect(() => {
    // Check if we're on the landing page (home page)
    const isLandingPage = window.location.pathname === "/";
    if (!isLandingPage) return;

    if (
      !splineContainerRef.current ||
      !contentRef.current ||
      animationStartedRef.current
    )
      return;

    // Set initial states
    gsap.set(subtitleRef.current, {
      opacity: 0,
    });

    gsap.set(splineContainerRef.current, {
      opacity: 0,
      scale: 0.3, // Start very small for dramatic rush-forward effect
    });

    // Set initial states for title parts
    // "I design" and "experiences that scale." slide from left together
    if (leftTextRef.current) {
      gsap.set(leftTextRef.current, {
        opacity: 0,
        x: -100, // Start from left
      });
    }
    if (rightTextRef.current) {
      gsap.set(rightTextRef.current, {
        opacity: 0,
        x: -100, // Start from left
      });
    }
    // "delightful" slides from right
    if (delightfulRef.current) {
      gsap.set(delightfulRef.current, {
        opacity: 0,
        x: 100, // Start from right
      });
    }

    // Wait for Spline to load before starting animations
    if (!splineLoaded) return;

    animationStartedRef.current = true;

    // Create timeline for landing animation
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    // Step 1: Fade in and dramatically scale up Spline (rushing towards viewer)
    tl.to(splineContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power2.out",
    });

    // Step 2: Animate title parts sliding in together
    // "I design" and "experiences that scale." slide from left together
    if (leftTextRef.current && rightTextRef.current) {
      tl.to(
        [leftTextRef.current, rightTextRef.current],
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power2.out",
        },
        "-=0.5" // Start slightly before Spline completes
      );
    }

    // Delightful: slides in from right simultaneously
    if (delightfulRef.current) {
      tl.to(
        delightfulRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power2.out",
        },
        "-=1.0" // Start at the same time as other title parts
      );
    }

    // Step 3: Fade in subtitle after title animation completes
    tl.to(
      subtitleRef.current,
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.3" // Start slightly before title completes
    );

    return () => {
      tl.kill();
    };
  }, [splineLoaded]);

  return (
    <section
      id="landing"
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 overflow-hidden z-0"
    >
      {/* Background Layer: Spline Scene (z-0)
          - pointer-events-none disables mouse interaction (orbit, pan, etc.) with the Spline scene
      */}
      <div
        ref={splineContainerRef}
        data-spline-container
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
          opacity: 0,
          transform: "scale(0.3)",
        }}
      >
        <SplineScene onLoadComplete={handleSplineLoad} />
        {/* Cover for Spline watermark in bottom right */}
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            width: "160px",
            height: "50px",
            backgroundColor: "#fafafa",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Foreground Layer: Text Content (z-10) */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[70%] sm:max-w-[85%] md:max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] min-[1440px]:max-w-[1008px] mx-auto text-center"
        style={{
          transformOrigin: "center center",
        }}
      >
        <h1
          ref={titleRef}
          className="landing-title max-[320px]:text-[3.2rem] text-[3.6rem] sm:text-[4rem] md:text-7xl lg:text-8xl xl:text-[6.5rem] mb-4 leading-[1.05] sm:leading-tight text-[#0f0f0f]"
        >
          <span
            ref={leftTextRef}
            style={{
              display: "inline-block",
              opacity: 0,
              transform: "translateX(-100px)",
            }}
          >
            I design
          </span>
          <span style={{ display: "inline-block", width: "0.15em" }}> </span>
          <span
            ref={delightfulRef}
            className="text-[#7DD3FC] italic"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              display: "inline-block",
              opacity: 0,
              transform: "translateX(100px)",
            }}
          >
            delightful
          </span>
          <span
            ref={rightTextRef}
            style={{
              display: "inline-block",
              opacity: 0,
              transform: "translateX(-100px)",
            }}
          >
            {" "}
            experiences that scale.
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className="max-[320px]:text-[0.8rem] text-[0.9rem] sm:text-[0.96875rem] md:text-md lg:text-xl xl:text-xl font-light text-[#0f0f0f] tracking-normal leading-relaxed sm:max-w-[65%] mx-auto"
          style={{ opacity: 0 }}
        >
          I bridge design and engineering to create accessible products with
          motion that brings them to life.
        </p>
      </div>
    </section>
  );
};

export default LandingSection;
