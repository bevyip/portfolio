import React, { useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { GridBackground } from "../../components/GridBackground";
import CombinedBentoGrid from "../../components/Sandbox/CombinedBentoGrid";
import Footer from "../../components/Footer/Footer";
import { usePlayPage } from "../../contexts/PlayPageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const location = useLocation();
  const lenis = useLenis();
  const { setIsGridVisible: setContextGridVisible, setIsBentoVisible } =
    usePlayPage();
  const [isGridVisible, setIsGridVisible] = useState(true);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const leftTextRef = useRef(null);
  const delightfulRef = useRef(null);
  const rightTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const dashRef = useRef(null);
  const bentoRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    setIsBentoVisible(false);
    setIsGridVisible(true);
    setContextGridVisible(true);
    
    // Reset scroll position immediately
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Prevent ScrollTrigger from calculating until scroll is reset
    ScrollTrigger.refresh();
  }, [location.pathname, setContextGridVisible, setIsBentoVisible, lenis]);

  useLayoutEffect(() => {
    if (!contentRef.current || !dashRef.current || !bentoRef.current || !titleRef.current) return;

    // Kill all ScrollTriggers first to prevent conflicts
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Force scroll to 0 BEFORE any ScrollTrigger setup
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".bento-item", { opacity: 0 });
      gsap.set(".work-bento-item", { opacity: 0 });
      gsap.set(".sandbox-title-text", { 
        opacity: 0, 
        y: "100%" 
      });
      gsap.set(bentoRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      // Set dash initial size and position BEFORE ScrollTrigger
      gsap.set(dashRef.current, {
        width: "64px",
        height: "8px",
        backgroundColor: "#ffffff",
        position: "fixed",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
      });

      // Set initial states for text elements
      if (leftTextRef.current) {
        gsap.set(leftTextRef.current, { opacity: 0, x: -100 });
      }
      if (delightfulRef.current) {
        gsap.set(delightfulRef.current, { opacity: 0, x: 100 });
      }
      if (rightTextRef.current) {
        gsap.set(rightTextRef.current, { opacity: 0, x: -100 });
      }
      if (subtitleRef.current) {
        gsap.set(".sandbox-hero-subtitle-line-text", { 
          opacity: 0, 
          y: "100%" 
        });
      }

      // Initial fade-in animation
      const initialTl = gsap.timeline({ delay: 0.3 });
      
      // Fade in "I design" and "experiences that scale." from the left
      if (leftTextRef.current) {
        initialTl.to(leftTextRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power1.out",
        }, 0);
      }
      
      if (rightTextRef.current) {
        initialTl.to(rightTextRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power1.out",
        }, 0); // Start at the same time as "I design"
      }
      
      // Fade in "delightful" from the right
      if (delightfulRef.current) {
        initialTl.to(delightfulRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power1.out",
        }, 0); // Start at the same time
      }
      
      // Rise up subtitle lines from the bottom (same effect as "Where I've been")
      if (subtitleRef.current) {
        initialTl.to(".sandbox-hero-subtitle-line-text", {
          opacity: 1,
          y: "0%",
          duration: 1.2,
          ease: "power2.out", // Match "Where I've been" easing
        }, "-=0.1"); // Small delay after title starts
      }

      // CRITICAL: Wait for initial animations to set, then create ScrollTrigger
      initialTl.eventCallback("onComplete", () => {
        // Double-check scroll position before creating ScrollTrigger
        if (lenis) {
          lenis.scrollTo(0, { duration: 0, immediate: true });
        }
        window.scrollTo(0, 0);

        // Main scroll timeline - create AFTER initial state is set
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            fastScrollEnd: true, // Helps prevent jumping
            preventOverlaps: true, // Prevents conflicts with other ScrollTriggers
            onUpdate: (self) => {
              if (self.progress >= 0.5) {
                setIsGridVisible(false);
                setContextGridVisible(false);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.style.backgroundColor = "#fafafa";
                }
              } else {
                setIsGridVisible(true);
                setContextGridVisible(true);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.style.backgroundColor = "transparent";
                }
              }

              if (self.progress >= 0.1) {
                setIsBentoVisible(true);
              } else {
                setIsBentoVisible(false);
              }
            },
            onLeave: () => {
              // Dispatch custom event when pin completes so Footer can create ScrollTriggers
              // This ensures Footer ScrollTriggers are calculated after page length is final
              console.log("Pin completed - dispatching pinComplete event, scroll position:", window.scrollY, "document height:", document.documentElement.scrollHeight);
              window.dispatchEvent(new CustomEvent('pinComplete'));
              // Also refresh ScrollTrigger to recalculate all positions
              ScrollTrigger.refresh();
            },
          },
        });

        // Set visible state at timeline start
        tl.set([leftTextRef.current, rightTextRef.current, delightfulRef.current], {
          opacity: 1,
          x: 0,
        });
        tl.set(".sandbox-hero-subtitle-line-text", {
          opacity: 1,
          y: "0%",
        });

        // Fade out "I design" and "experiences that scale." to the left
        if (leftTextRef.current) {
          tl.to(leftTextRef.current, {
            opacity: 0,
            x: -150,
            duration: 1,
            ease: "power3.out",
          }, 0);
        }
        
        if (rightTextRef.current) {
          tl.to(rightTextRef.current, {
            opacity: 0,
            x: -150, // Fade out to the left (matching initial fade-in direction)
            duration: 1,
            ease: "power3.out",
          }, 0);
        }
        
        // Fade out "delightful" to the right
        if (delightfulRef.current) {
          tl.to(delightfulRef.current, {
            opacity: 0,
            x: 150,
            duration: 1,
            ease: "power3.out",
          }, 0);
        }
        
        // Fade out subtitle to the right
        if (subtitleRef.current) {
          tl.to(subtitleRef.current, {
            opacity: 0,
            x: 150,
            duration: 1,
            ease: "power3.out",
          }, 0);
        }

        // Expand white rectangle
        tl.to(dashRef.current, {
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fafafa",
          duration: 4,
          ease: "power2.inOut",
        }, 0.5);

        // Reveal bento content
        tl.fromTo(bentoRef.current, 
          { opacity: 0, pointerEvents: "none" },
          { opacity: 1, pointerEvents: "auto", duration: 2, ease: "power2.in" },
          2.5
        );

        tl.fromTo(".bento-item, .work-bento-item",
          { opacity: 0 },
          { opacity: 1, stagger: { each: 0.1, from: "start" }, duration: 1.5, ease: "power2.out" },
          3.2
        );

        // Animate title rising up when section is further up viewport
        gsap.to(".sandbox-title-text", {
          opacity: 1,
          y: "0%",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 50%", // Start when section is halfway up viewport
            end: "top 10%", // End when section is near top, giving longer scroll distance
            scrub: 1,
          },
        });
      });
    }, scrollContainerRef);

    return () => {
      ctx.revert();
    };
  }, [setIsBentoVisible, setContextGridVisible, lenis]);

  return (
    <>
      <div
        className="fixed inset-0 w-full"
        style={{
          display: "grid",
          gridTemplateAreas: '"overlay"',
          zIndex: 0,
          height: "100vh",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            gridArea: "overlay",
            zIndex: 2,
            height: "100%",
            backgroundColor: "#0f0f0f",
            position: "relative",
          }}
        >
          <GridBackground isVisible={isGridVisible} />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="relative w-full"
        style={{
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      >
        <div
          ref={contentRef}
          className="h-screen w-full flex items-center justify-center overflow-hidden relative z-10"
        >
          <div className="sandbox-hero-text-container">
            <h1 className="sandbox-hero-title">
              <span
                ref={leftTextRef}
                style={{
                  display: "inline-block",
                }}
              >
                I design
              </span>
              <span style={{ display: "inline-block", width: "0.15em" }}> </span>
              <span
                ref={delightfulRef}
                className="sandbox-hero-accent"
                style={{
                  display: "inline-block",
                }}
              >
                delightful
              </span>
              <span
                ref={rightTextRef}
                style={{
                  display: "inline-block",
                }}
              >
                {" "}
                experiences that scale.
              </span>
            </h1>

            <div
              ref={dashRef}
              className="sandbox-hero-dash bg-white w-16 h-2 relative z-20 flex items-center justify-center overflow-hidden"
              style={{ maxWidth: "100vw", maxHeight: "100vh" }}
            />

            <p
              ref={subtitleRef}
              className="sandbox-hero-subtitle"
            >
              <span className="sandbox-hero-subtitle-line">
                <span className="sandbox-hero-subtitle-line-text">I bridge design and engineering to craft</span>
              </span>
              <span className="sandbox-hero-subtitle-line">
                <span className="sandbox-hero-subtitle-line-text">accessible products of joyful interactions.</span>
              </span>
            </p>
          </div>
        </div>

        <section
          id="work"
          ref={bentoRef}
          className="relative z-30 min-h-screen flex flex-col opacity-0 pointer-events-none"
          style={{
            marginTop: "calc(-100vh - 700px)",
          }}
        >
          <div className="pt-12 md:pt-20 pb-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <h1 ref={titleRef} className="sandbox-title">
                <span className="sandbox-title-wrapper">
                  <span className="sandbox-title-text">
                    <span className="sandbox-title-featured">Featured</span>{" "}
                    <span className="sandbox-title-work">Work</span>
                  </span>
                </span>
              </h1>
              <CombinedBentoGrid />
            </div>
          </div>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default Home;
