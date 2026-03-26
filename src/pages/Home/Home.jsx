import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isHomePath, isGoogleCreativePath } from "../../constants/homeRoutes";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer/Footer";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import PlayBentoGrid, {
  PLAY_BENTO_LAYOUT,
} from "../../components/Work/PlayBentoGrid";
import PixelCat from "../../components/PixelCat/PixelCat";
import PokemonIntro from "../../components/PokemonIntro/PokemonIntro";
import salesforceLogo from "../../assets/img/logo-stickers/salesforce-logo.png";
import confidoLogo from "../../assets/img/logo-stickers/confido-logo.png";
import "./Home.css";

const HERO_OPEN_ROLES_LINE =
  "Interested in product design, design engineering, and creative technology roles.";

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
  const isGoogleCreative = isGoogleCreativePath(location.pathname);
  const [pokemonIntroDone, setPokemonIntroDone] = useState(
    () => !isGoogleCreativePath(location.pathname),
  );
  const { scrollToTop, scrollToElement } = useLenisScroll();
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);
  const [isWorkLoading, setIsWorkLoading] = useState(true);
  const heroTitleRef = useRef(null);
  const bioRef = useRef(null);
  const landingCatRef = useRef(null);
  const workGridRef = useRef(null);
  const hasScrolledToPlayRef = useRef(false);

  useEffect(() => {
    setPokemonIntroDone(!isGoogleCreative);
  }, [isGoogleCreative]);

  // When navigated from another page with scrollToPlay, scroll to play once when layout is ready (work grid loaded).
  useEffect(() => {
    if (
      location.state?.scrollToPlay !== true ||
      isWorkLoading ||
      hasScrolledToPlayRef.current
    )
      return;
    const el = document.getElementById("play");
    if (!el) return;
    hasScrolledToPlayRef.current = true;
    scrollToElement(el, { offset: 0, immediate: true });
  }, [location.state?.scrollToPlay, isWorkLoading, scrollToElement]);

  // Reset so a future navigation with scrollToPlay can scroll again (e.g. About -> Play again)
  useEffect(() => {
    if (
      !isHomePath(location.pathname) ||
      location.state?.scrollToPlay !== true
    ) {
      hasScrolledToPlayRef.current = false;
    }
  }, [location.pathname, location.state?.scrollToPlay]);

  // After the play grid is in view and images have started loading,
  // refresh ScrollTrigger so the footer trigger recalculates correctly
  useEffect(() => {
    if (isWorkLoading) return;
    // Small delay to let the Play grid finish its layout pass
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(t);
  }, [isWorkLoading]);

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
  }, [isGoogleCreative]);

  const scrollToPlaySection = () => {
    scrollToElement(document.getElementById("play"), {
      offset: 0,
      duration: 1.2,
    });
  };

  const defaultPlayIntro = (
    <>
      <div className="home-play-title-row">
        <h2 className="home-play-title">Experiments & Artifacts</h2>
      </div>
      <p className="home-play-subtitle">
        Designing and coding have always been inseparable to me. I bounce
        between Figma and Cursor until something feels right, all in pursuit of
        one question:{" "}
        <span className="play-question">
          how do we make even the most boring tool spark joy?
        </span>
      </p>
    </>
  );

  const playBentoLayout = isGoogleCreative
    ? PLAY_BENTO_LAYOUT.googleCreative
    : PLAY_BENTO_LAYOUT.home;

  const playSection = (
    <section id="play" className="home-play">
      <div className="home-play-inner">
        {!isGoogleCreative ? defaultPlayIntro : null}
        <PlayBentoGrid
          key={playBentoLayout.id}
          bentoLayout={playBentoLayout}
          onProjectClick={scrollToPlaySection}
        />
      </div>
    </section>
  );

  const workSection = (
    <section id="work" className="home-work">
      <div className="home-work-inner">
        {isGoogleCreative ? (
          <div className="home-work-section-intro">
            <h2 className="home-play-title">Design Case Studies</h2>
            <p className="home-play-subtitle">
              <span className="play-question">
                How I balance real user needs and business goals
              </span>{" "}
              — from research to shipped, across fintech, health AI, and
              enterprise.
            </p>
          </div>
        ) : null}
        <div className="home-work-loading-wrapper">
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
      </div>
    </section>
  );

  return (
    <>
      {isGoogleCreative && !pokemonIntroDone ? (
        <PokemonIntro
          onComplete={() => {
            scrollToTop({ immediate: true });
            setPokemonIntroDone(true);
          }}
        />
      ) : null}
      <main
        className={`home${isGoogleCreative ? " home-google-creative" : ""}`}
        style={{ backgroundColor: "#fafafa" }}
      >
        <section id="landing" className="home-landing">
          <div className="home-landing-content">
            <div className="home-landing-grid">
              <div className="home-landing-inner">
                <h1 ref={heroTitleRef} className="home-hero">
                  <span className="home-hero-line">
                    <span className="home-hero-line-inner">
                      I&apos;m Beverly, a designer
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
                      {isGoogleCreative ? (
                        <>
                          I love building and experimenting — asking{" "}
                          <strong>'what if?'</strong> through tools, artifacts,
                          and everything in between.
                        </>
                      ) : (
                        HERO_OPEN_ROLES_LINE
                      )}
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

        {isGoogleCreative ? (
          <>
            {playSection}
            {workSection}
          </>
        ) : (
          <>
            {workSection}
            {playSection}
          </>
        )}

        <Footer />
      </main>
    </>
  );
};

export default Home;
