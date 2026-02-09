import React, { useState, useRef, useLayoutEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { GridBackground } from "../../components/GridBackground";
import HomeBentoGrid from "../../components/Work/HomeBentoGrid";
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
  const seeMoreButtonRef = useRef(null);
  const seeMoreCircleRef = useRef(null);
  const seeMoreTlRef = useRef(null);

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
              window.dispatchEvent(new CustomEvent('pinComplete'));
              // ScrollTrigger.refresh();
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
            x: -150,
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

        // Reveal bento content (sooner since section is shorter)
        tl.fromTo(bentoRef.current, 
          { opacity: 0, pointerEvents: "none" },
          { opacity: 1, pointerEvents: "auto", duration: 2, ease: "power2.in" },
          1.0
        );

        tl.fromTo(".bento-item, .work-bento-item",
          { opacity: 0 },
          { opacity: 1, stagger: { each: 0.1, from: "start" }, duration: 1.5, ease: "power2.out" },
          1.5
        );

        // Animate title rising up when section is further up viewport (later trigger)
        gsap.to(".sandbox-title-text", {
          opacity: 1,
          y: "0%",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 30%",
            end: "top 10%",
            scrub: 1,
          },
        });
      });
    }, scrollContainerRef);

    return () => {
      ctx.revert();
    };
  }, [setIsBentoVisible, setContextGridVisible, lenis]);

  // Set up See More button animation (matching resume button)
  useLayoutEffect(() => {
    if (!seeMoreButtonRef.current || !seeMoreCircleRef.current) return;

    const setupAnimation = () => {
      const pill = seeMoreButtonRef.current;
      const circle = seeMoreCircleRef.current;
      if (!pill || !circle) return;

      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta =
        Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });

      const label = pill.querySelector(".pill-label");
      const white = pill.querySelector(".pill-label-hover");

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      seeMoreTlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(
        circle,
        {
          scale: 1.2,
          xPercent: -50,
          duration: 2,
          ease: "power3.easeOut",
          overwrite: "auto",
        },
        0
      );

      if (label) {
        tl.to(
          label,
          {
            y: -(h + 8),
            duration: 2,
            ease: "power3.easeOut",
            overwrite: "auto",
          },
          0
        );
      }

      if (white) {
        tl.to(
          white,
          {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: "power3.easeOut",
            overwrite: "auto",
          },
          0
        );
      }

      seeMoreTlRef.current = tl;
    };

    setupAnimation();

    const onResize = () => setupAnimation();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(setupAnimation).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", onResize);
      seeMoreTlRef.current?.kill();
    };
  }, []);

  const handleSeeMoreEnter = () => {
    const tl = seeMoreTlRef.current;
    if (!tl) return;
    tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleSeeMoreLeave = () => {
    const tl = seeMoreTlRef.current;
    if (!tl) return;
    tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  // Handle hash navigation AFTER ScrollTrigger is fully set up
  useLayoutEffect(() => {
    const hash = location.hash || window.location.hash;
    
    if (hash === '#work' && lenis) {
      // Wait for ScrollTrigger pin to be created
      const checkAndScroll = () => {
        const scrollTriggers = ScrollTrigger.getAll();
        const pinTrigger = scrollTriggers.find(st => st.pin === contentRef.current);
        
        if (pinTrigger) {
          const workSection = document.getElementById("work");
          if (workSection) {
            lenis.scrollTo(workSection, {
              offset: 0,
              duration: 0,
              immediate: true,
            });
            
            sessionStorage.removeItem("navigatingWithHash");
          }
        } else {
          setTimeout(checkAndScroll, 100);
        }
      };
      
      // Start checking after initial animations (0.3s delay + 1.2s animation = 1.5s total)
      const scrollToWork = setTimeout(checkAndScroll, 2000);
      
      return () => clearTimeout(scrollToWork);
    }
  }, [location.hash, lenis]);

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
              <HomeBentoGrid />
              <div className="flex flex-col items-center" style={{ marginTop: '5rem' }}>
                <Link
                  to="/work"
                  className="see-more-button pill"
                  ref={seeMoreButtonRef}
                  onMouseEnter={handleSeeMoreEnter}
                  onMouseLeave={handleSeeMoreLeave}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={seeMoreCircleRef}
                  />
                  <span className="label-stack">
                    <span className="pill-label">See All Work</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      See All Work
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default Home;
