import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import Footer from "../../components/Footer/Footer";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import PlayBentoGrid from "../../components/Work/PlayBentoGrid";
import PixelCat from "../../components/PixelCat/PixelCat";
import salesforceLogo from "../../assets/img/logo-stickers/salesforce-logo.png";
import confidoLogo from "../../assets/img/logo-stickers/confido-logo.png";
import "./Home.css";

const LANDING_FADE_DURATION = 1;
const LANDING_EASE = "power2.out";
// Nav floats in a little before landing fade finishes
export const LANDING_NAV_DELAY = 0.85;

/** Placeholder grid matching .home-case-study-grid layout for skeleton state */
function SkeletonWorkGrid() {
  return (
    <div className="home-case-study-grid home-work-skeleton" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="home-work-skeleton-card" />
      ))}
    </div>
  );
}

const Home = () => {
  const location = useLocation();
  const lenis = useLenis();
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);
  const [isWorkLoading, setIsWorkLoading] = useState(true);
  const heroTitleRef = useRef(null);
  const bioRef = useRef(null);
  const landingCatRef = useRef(null);
  const workGridRef = useRef(null);
  const hasScrolledToPlayRef = useRef(false);

  // When navigated from another page with scrollToPlay, scroll to play once when layout is ready (work grid loaded).
  // We don't replace state so ScrollToTop keeps skipping and doesn't scroll to 0 after we scroll here.
  useEffect(() => {
    if (
      location.state?.scrollToPlay !== true ||
      isWorkLoading ||
      !lenis ||
      hasScrolledToPlayRef.current
    )
      return;
    const el = document.getElementById("play");
    if (!el) return;
    hasScrolledToPlayRef.current = true;
    lenis.scrollTo(el, { offset: 0, duration: 0, immediate: true });
  }, [location.state?.scrollToPlay, isWorkLoading, lenis]);

  // Reset so a future navigation with scrollToPlay can scroll again (e.g. About -> Play again)
  useEffect(() => {
    if (location.pathname !== "/" || location.state?.scrollToPlay !== true) {
      hasScrolledToPlayRef.current = false;
    }
  }, [location.pathname, location.state?.scrollToPlay]);

  // Landing: rise-from-baseline for title and bio (same style as Play), start on mount to avoid lag
  useEffect(() => {
    const titleEl = heroTitleRef.current;
    const bioEl = bioRef.current;
    const cat = landingCatRef.current;
    if (!titleEl || !bioEl || !cat) return;

    const titleLines = titleEl.querySelectorAll(".home-hero-line-inner");
    const bioLine = bioEl.querySelector(".home-bio-line-inner");
    if (!titleLines.length || !bioLine) return;

    gsap.set(titleLines, { y: "100%" });
    gsap.set(bioLine, { y: "100%" });

    const tl = gsap.timeline();
    tl.to(titleLines, {
      y: 0,
      duration: LANDING_FADE_DURATION,
      ease: LANDING_EASE,
      stagger: 0.1,
    })
      .to(
        bioLine,
        {
          y: 0,
          duration: LANDING_FADE_DURATION,
          ease: LANDING_EASE,
        },
        "-=0.2",
      )
      .to(
        cat,
        {
          opacity: 1,
          y: 0,
          duration: LANDING_FADE_DURATION,
          ease: LANDING_EASE,
        },
        "-=0.2",
      );

    return () => tl.kill();
  }, []);

  const scrollToPlaySection = () => {
    const el = document.getElementById("play");
    if (el && lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="home" style={{ backgroundColor: "#fafafa" }}>
      <section id="landing" className="home-landing">
        <div className="home-landing-content">
          <div className="home-landing-grid">
            <div className="home-landing-inner">
              <h1 ref={heroTitleRef} className="home-hero">
                <span className="home-hero-line">
                  <span className="home-hero-line-inner">
                    I'm Beverly, a designer
                  </span>
                </span>
                <span className="home-hero-line">
                  <span className="home-hero-line-inner">
                    built on <em>engineering</em>.
                  </span>
                </span>
              </h1>
              <p ref={bioRef} className="home-bio">
                <span className="home-bio-line">
                  <span className="home-bio-line-inner">
                    Previously coded at{" "}
                    <a
                      href="https://www.salesforce.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-company-with-logo home-landing-company-link"
                    >
                      <img
                        src={salesforceLogo}
                        alt=""
                        className="home-company-logo"
                        aria-hidden="true"
                      />
                      Salesforce
                    </a>
                    , designed at{" "}
                    <a
                      href="https://www.confidotech.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-company-with-logo home-landing-company-link"
                    >
                      <img
                        src={confidoLogo}
                        alt=""
                        className="home-company-logo"
                        aria-hidden="true"
                      />
                      Confido
                    </a>
                    .
                    <br />
                    <span className="home-bio-second-line">
                      Interested in product design, design engineering, and
                      creative technology roles.
                    </span>
                  </span>
                </span>
              </p>
            </div>
            <div ref={landingCatRef} className="home-landing-cat">
              <PixelCat />
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="home-work">
        <div className="home-work-inner home-work-loading-wrapper">
          <div
            style={{
              opacity: isWorkLoading ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
              position: isWorkLoading ? "relative" : "absolute",
              inset: 0,
            }}
          >
            <SkeletonWorkGrid />
          </div>
          <div
            style={{
              opacity: isWorkLoading ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            <WorkBentoGrid
              gridClassName="home-case-study-grid"
              onHoverChange={setIsHoveringWorkCard}
              isHoveringWorkCard={isHoveringWorkCard}
              containerRef={workGridRef}
              onReady={() => setIsWorkLoading(false)}
            />
          </div>
        </div>
      </section>

      <section id="play" className="home-play">
        <div className="home-play-inner">
          <h2 className="home-play-title">
            <span className="home-play-title-line">
              <span className="home-play-title-line-inner">
                Experiments & Artifacts
              </span>
            </span>
          </h2>
          <p className="home-play-subtitle">
            <span className="home-play-subtitle-line">
              <span className="home-play-subtitle-line-inner">
                Designing and coding have always been inseparable to me. I
                bounce between Figma and Cursor until something feels right, all
                in pursuit of one question:{" "}
                <span className="play-question">
                  how do we make even the most boring tool spark joy?
                </span>
              </span>
            </span>
          </p>
          <PlayBentoGrid onProjectClick={scrollToPlaySection} />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
