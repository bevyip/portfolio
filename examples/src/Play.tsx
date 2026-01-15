import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { Scene } from "./components/Scene";
import { GridBackground } from "./components/GridBackground";
import BentoGrid from "./components/Play/BentoGrid";
import Footer from "./components/Footer/Footer";
import { usePlayPage } from "./contexts/PlayPageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Note: SplitText is a premium plugin.
// We will simulate the behavior with standard GSAP to ensure this code runs for everyone.
// import { SplitText } from "gsap/SplitText";

// Register plugins
gsap.registerPlugin(ScrollTrigger);

const Play = () => {
  const location = useLocation();
  const lenis = useLenis();
  const { setIsGridVisible: setContextGridVisible, setIsBentoVisible } =
    usePlayPage();
  const [animationStatus, setAnimationStatus] = useState("PLAYING");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLSpanElement>(null);
  const rightTextRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLElement>(null);
  const playTitleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    // Check if user has seen the animation before
    const hasSeenAnimation = localStorage.getItem("hasSeenPlayAnimation");

    setIsExpanded(false);
    setIsBentoVisible(false);
    setGameKey((prev) => prev + 1);

    if (hasSeenAnimation) {
      // Skip animation and go directly to content
      setAnimationStatus("CONTENT_VISIBLE");
      setIsGridVisible(false);
      setContextGridVisible(false);
    } else {
      // First time - show animation
      setAnimationStatus("PLAYING");
      // Show grid immediately to avoid white flash
      setIsGridVisible(true);
      setContextGridVisible(true);
    }
  }, [location.pathname, setContextGridVisible, setIsBentoVisible]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // CRITICAL: Reset scroll using Lenis BEFORE ScrollTrigger is created
    // This must happen immediately when navigating to Play
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Also reset after a frame to ensure it sticks
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true });
      } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    });

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, [location.pathname, lenis]);

  const handleGridStart = useCallback(() => {
    setIsGridVisible(true);
    setContextGridVisible(true);
  }, [setContextGridVisible]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setIsGridVisible(true);
    setContextGridVisible(true);
    setAnimationStatus("EXPANDED");
  }, [setContextGridVisible]);

  const handleComplete = useCallback(() => {
    // Mark animation as seen in localStorage
    localStorage.setItem("hasSeenPlayAnimation", "true");

    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      setAnimationStatus("CONTENT_VISIBLE");
    }, 500);
  }, []);

  useLayoutEffect(() => {
    if (animationStatus !== "CONTENT_VISIBLE" || !contentRef.current) {
      return;
    }

    // CRITICAL: Reset scroll to 0 and wait for layout to settle BEFORE creating ScrollTrigger
    // ScrollTrigger calculates pin position based on element position relative to viewport
    // If scroll isn't at 0, the pin will start at the wrong position
    const resetScroll = () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true });
      } else {
        window.scrollTo(0, 0);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Reset immediately
    resetScroll();

    // Force layout recalculation
    if (contentRef.current && scrollContainerRef.current) {
      void contentRef.current.offsetHeight;
      void scrollContainerRef.current.offsetHeight;
    }

    // Wait for next frame to ensure scroll reset has taken effect
    // Then create ScrollTrigger with scroll guaranteed at 0
    let cleanupFn: (() => void) | null = null;
    const rafId = requestAnimationFrame(() => {
      // Double-check scroll is at 0
      resetScroll();

      // Wait one more frame to ensure scroll reset is fully applied
      requestAnimationFrame(() => {
        // Final scroll reset check
        resetScroll();

        // Refresh ScrollTrigger to clear any stale calculations
        ScrollTrigger.refresh();

        let textScrollTrigger: ScrollTrigger | null = null;

        const ctx = gsap.context(() => {
          if (!contentRef.current || !dashRef.current || !bentoRef.current)
            return;

          // CRITICAL: Verify contentRef is at the top of the document
          // If it's not, force scroll to 0 and recalculate
          const contentRect = contentRef.current.getBoundingClientRect();
          const scrollY = lenis
            ? lenis.scroll
            : window.scrollY || document.documentElement.scrollTop;

          // If content is not at the top (within 10px tolerance), reset scroll
          if (Math.abs(contentRect.top) > 10 || Math.abs(scrollY) > 10) {
            resetScroll();
            // Wait for scroll to settle
            requestAnimationFrame(() => {
              resetScroll();
            });
          }

          gsap.set(".bento-item", { opacity: 0 });
          gsap.set(playTitleRef.current, { opacity: 0 });
          gsap.set(bentoRef.current, {
            opacity: 0,
            pointerEvents: "none",
          });

          if (leftTextRef.current && rightTextRef.current) {
            // Modified logic to avoid SplitText dependency
            gsap.set(leftTextRef.current, { opacity: 0, y: 20, x: 0 });
            gsap.set(rightTextRef.current, { opacity: 0, y: 20, x: 0 });

            const fadeInTl = gsap.timeline({ delay: 0.3 });
            fadeInTl
              .to(leftTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              })
              .to(
                rightTextRef.current,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                },
                "<0.2"
              );

            const fadeOutTl = gsap.timeline({ paused: true });
            fadeOutTl
              .to(leftTextRef.current, {
                opacity: 0,
                x: -150,
                duration: 0.6,
                ease: "power3.out",
              })
              .to(
                rightTextRef.current,
                {
                  opacity: 0,
                  x: 150,
                  duration: 0.6,
                  ease: "power3.out",
                },
                "<"
              );

            textScrollTrigger = ScrollTrigger.create({
              trigger: contentRef.current,
              start: "top top",
              end: "top+=50 top",
              onEnter: () => {
                fadeOutTl.play();
              },
              onLeaveBack: () => {
                fadeOutTl.reverse();
              },
            });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top top",
              end: "+=300%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                // Ensure scroll is at 0 whenever ScrollTrigger refreshes
                resetScroll();
              },
              onUpdate: (self) => {
                // Type assertion for custom label properties
                const dashCompleteTime = tl.labels.dashComplete;
                const totalDuration = tl.duration();
                const dashCompleteProgress =
                  totalDuration > 0 && dashCompleteTime !== undefined
                    ? dashCompleteTime / totalDuration
                    : 0;

                if (
                  self.progress >= dashCompleteProgress &&
                  dashCompleteProgress > 0
                ) {
                  setIsGridVisible(false);
                  setContextGridVisible(false);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.backgroundColor =
                      "#fafafa";
                  }
                } else {
                  setIsGridVisible(true);
                  setContextGridVisible(true);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.backgroundColor =
                      "transparent";
                  }
                }

                if (self.progress >= 0.1) {
                  setIsBentoVisible(true);
                } else {
                  setIsBentoVisible(false);
                }
              },
            },
          });

          tl.to(
            dashRef.current,
            {
              width: "100vw",
              height: "100vh",
              backgroundColor: "#fafafa",
              duration: 4,
              ease: "power2.inOut",
            },
            "-=1"
          );
          tl.addLabel("dashComplete");

          tl.fromTo(
            bentoRef.current,
            { opacity: 0, pointerEvents: "none" },
            {
              opacity: 1,
              pointerEvents: "auto",
              duration: 5,
              ease: "power2.in",
            },
            "-=2.5"
          );

          tl.fromTo(
            playTitleRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 2,
              ease: "power2.out",
            },
            "-=2.5"
          );

          tl.fromTo(
            ".bento-item",
            { opacity: 0 },
            {
              opacity: 1,
              stagger: { each: 0.15, from: "start" },
              duration: 2,
              ease: "power2.out",
            },
            "-=2.4"
          );

          // After all ScrollTriggers are created, refresh to ensure correct calculations
          ScrollTrigger.refresh();

          // CRITICAL: Reset scroll multiple times with proper timing
          // ScrollTrigger pin can affect scroll position, so we need to force it back to 0
          resetScroll();

          // Wait for ScrollTrigger to finish its refresh calculations
          requestAnimationFrame(() => {
            resetScroll();
            ScrollTrigger.update();

            // One more reset after ScrollTrigger update
            requestAnimationFrame(() => {
              resetScroll();
              // Force ScrollTrigger to recalculate with scroll at 0
              ScrollTrigger.refresh();
              resetScroll();
            });
          });
        }, scrollContainerRef);

        cleanupFn = () => {
          ctx.revert();
          if (textScrollTrigger) {
            textScrollTrigger.kill();
          }
          // Cleanup for split text if we were using it
        };
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [animationStatus, setIsBentoVisible, lenis]);

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
        {(animationStatus === "PLAYING" || animationStatus === "EXPANDED") && (
          <div
            style={{
              gridArea: "overlay",
              zIndex: isExpanded ? 1 : 3,
              pointerEvents: "none",
              height: "100%",
            }}
          >
            <Scene
              key={gameKey}
              onExpand={handleExpand}
              onComplete={handleComplete}
              onGridStart={handleGridStart}
              shadowRef={shadowRef}
              isExpanded={isExpanded}
            />
          </div>
        )}

        <div
          style={{
            gridArea: "overlay",
            zIndex: 2,
            height: "100%",
            pointerEvents: "none",
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
        {animationStatus === "CONTENT_VISIBLE" && (
          <>
            <div
              ref={contentRef}
              className="h-screen w-full flex items-center justify-center overflow-hidden relative z-10"
            >
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
                <span
                  ref={leftTextRef}
                  className="order-1 md:order-none md:absolute md:right-[calc(100%+2rem)] text-2xl md:text-4xl font-light tracking-wide text-gray-800 text-center min-[1025px]:text-right whitespace-nowrap"
                >
                  Welcome to my playground
                </span>

                <div
                  ref={dashRef}
                  className="order-2 md:order-none bg-white w-10 h-1 md:w-16 md:h-2 relative z-20 flex items-center justify-center overflow-hidden shadow-sm"
                  style={{ maxWidth: "100vw", maxHeight: "100vh" }}
                />

                <span
                  ref={rightTextRef}
                  className="order-3 md:order-none md:absolute md:left-[calc(100%+2rem)] text-2xl md:text-4xl font-light tracking-wide text-gray-800 text-center min-[1025px]:text-left whitespace-nowrap"
                >
                  where I design for pure delight
                </span>
              </div>
            </div>

            <section
              ref={bentoRef}
              className="relative z-30 min-h-screen flex flex-col opacity-0 pointer-events-none"
              style={{
                marginTop: "calc(-100vh - 700px)",
              }}
            >
              <div className="pt-12 md:pt-20 pb-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                  <h1
                    ref={playTitleRef}
                    className="text-5xl md:text-7xl font-black mb-12 tracking-tight"
                  >
                    <span className="text-gray-900">Designs that spark </span>
                    <span className="text-blue-600">joy</span>
                  </h1>
                  <BentoGrid />
                </div>
              </div>
              <Footer />
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Play;
