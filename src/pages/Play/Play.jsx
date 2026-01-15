import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { GridBackground } from "../../components/GridBackground";
import BentoGrid from "../../components/Play/BentoGrid";
import Footer from "../../components/Footer/Footer";
import { usePlayPage } from "../../contexts/PlayPageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./Play.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Play = () => {
  const location = useLocation();
  const lenis = useLenis();
  const { setIsGridVisible: setContextGridVisible, setIsBentoVisible } =
    usePlayPage();
  const [animationStatus, setAnimationStatus] = useState("CONTENT_VISIBLE");
  const [isGridVisible, setIsGridVisible] = useState(false);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const dashRef = useRef(null);
  const bentoRef = useRef(null);
  const playTitleRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useLayoutEffect(() => {
    setIsBentoVisible(false);
    setAnimationStatus("CONTENT_VISIBLE");
    setIsGridVisible(false);
    setContextGridVisible(false);
  }, [location.pathname, setContextGridVisible, setIsBentoVisible]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

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


  // Separate effect to aggressively prevent scroll jumps
  useEffect(() => {
    if (animationStatus !== "CONTENT_VISIBLE") return;

    let frameCount = 0;
    const maxFrames = 120; // Monitor for 2 seconds at 60fps
    let isFirstFrame = true;

    const preventScrollJump = () => {
      if (frameCount >= maxFrames) return;

      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

      // If scroll position is not 0, force it back
      if (currentScroll > 0) {
        if (lenis) {
          lenis.scrollTo(0, { duration: 0, immediate: true });
        } else {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }

        // Also force ScrollTrigger to update immediately
        if (scrollTriggerRef.current && !isFirstFrame) {
          scrollTriggerRef.current.update();
        }
      }

      isFirstFrame = false;
      frameCount++;
      requestAnimationFrame(preventScrollJump);
    };

    // Start monitoring
    requestAnimationFrame(preventScrollJump);
  }, [animationStatus, lenis]);

  useLayoutEffect(() => {
    if (animationStatus !== "CONTENT_VISIBLE" || !contentRef.current) {
      return;
    }

    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    if (contentRef.current && scrollContainerRef.current) {
      void contentRef.current.offsetHeight;
      void scrollContainerRef.current.offsetHeight;
    }

    let leftTextSplit = null;
    let rightTextSplit = null;
    let textScrollTrigger = null;

    const ctx = gsap.context(() => {
      if (!contentRef.current || !dashRef.current || !bentoRef.current) return;

      // Set initial states for all animated elements
      gsap.set(".bento-item", { opacity: 0 });
      gsap.set(playTitleRef.current, { opacity: 0 });
      gsap.set(bentoRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      // CRITICAL: Set dash to its starting state immediately
      gsap.set(dashRef.current, {
        width: "10",
        height: "1",
        backgroundColor: "#ffffff",
        clearProps: "width,height", // Clear any inline styles first
      });

      // On desktop, set proper starting dimensions
      if (window.innerWidth >= 768) {
        gsap.set(dashRef.current, {
          width: "64px", // md:w-16 = 4rem = 64px
          height: "8px", // md:h-2 = 0.5rem = 8px
        });
      } else {
        gsap.set(dashRef.current, {
          width: "40px", // w-10 = 2.5rem = 40px
          height: "4px", // h-1 = 0.25rem = 4px
        });
      }

      if (leftTextRef.current && rightTextRef.current) {
        leftTextSplit = new SplitText(leftTextRef.current, {
          type: "chars",
        });
        rightTextSplit = new SplitText(rightTextRef.current, {
          type: "chars",
        });

        gsap.set(leftTextSplit.chars, { opacity: 0, y: 20, x: 0 });
        gsap.set(rightTextSplit.chars, { opacity: 0, y: 20, x: 0 });
        gsap.set(leftTextRef.current, { opacity: 1, y: 0, x: 0 });
        gsap.set(rightTextRef.current, { opacity: 1, y: 0, x: 0 });

        const fadeInTl = gsap.timeline({ delay: 0.3 });
        fadeInTl
          .to(leftTextSplit.chars, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power3.out",
          })
          .to(
            rightTextSplit.chars,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.02,
              ease: "power3.out",
            },
            ">"
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
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
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
                scrollContainerRef.current.style.backgroundColor = "#fafafa";
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

      // Store the ScrollTrigger instance
      scrollTriggerRef.current = tl.scrollTrigger;

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

      ScrollTrigger.refresh();

      if (lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true });
        ScrollTrigger.update();
      } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        ScrollTrigger.update();
      }
    }, scrollContainerRef);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
      if (textScrollTrigger) {
        textScrollTrigger.kill();
      }
      if (leftTextSplit) {
        try {
          leftTextSplit.revert();
        } catch (e) {}
      }
      if (rightTextSplit) {
        try {
          rightTextSplit.revert();
        } catch (e) {}
      }
    };
  }, [animationStatus, setIsBentoVisible, setContextGridVisible, lenis]);

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
          }}
        >
          <GridBackground isVisible={isGridVisible} />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="relative w-full"
        style={{
          backgroundColor:
            animationStatus === "CONTENT_VISIBLE" ? "transparent" : "#0f0f0f",
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
                  className="order-1 md:order-none md:absolute md:right-[calc(100%+2rem)] play-welcome-text text-center min-[1025px]:text-right whitespace-nowrap"
                >
                  Welcome to my playground
                </span>

                <div
                  ref={dashRef}
                  className="order-2 md:order-none bg-white w-10 h-1 md:w-16 md:h-2 relative z-20 flex items-center justify-center overflow-hidden"
                  style={{ maxWidth: "100vw", maxHeight: "100vh" }}
                />

                <span
                  ref={rightTextRef}
                  className="order-3 md:order-none md:absolute md:left-[calc(100%+2rem)] play-welcome-text text-center min-[1025px]:text-left whitespace-nowrap"
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
                  <h1 ref={playTitleRef} className="play-title">
                    <span className="play-title-word play-title-design">
                      Designs that spark{" "}
                    </span>
                    <span className="play-title-word play-title-joy">joy</span>
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
