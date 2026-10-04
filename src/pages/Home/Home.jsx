import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { gsap } from "gsap";
import Footer from "../../components/Footer/Footer";
import PlayBentoGridNatural from "../../components/Work/PlayBentoGrid";
import PixelCat from "../../components/PixelCat/PixelCat";
import {
  HOME_FILTERS,
  getHomeGridPositions,
  getHomeGridProjects,
} from "../../data/homeGrid";
import salesforceLogo from "../../assets/img/logo-stickers/salesforce-logo.png";
import confidoLogo from "../../assets/img/logo-stickers/confido-logo.png";
import googleLogo from "../../assets/img/logo-stickers/google-logo.png";
import "./Home.css";

const LANDING_FADE_DURATION = 1;
const LANDING_EASE = "power2.out";
// Pixel cat rises in with nav (matches Nav.jsx)
export const LANDING_NAV_DELAY = 0.85;
export const LANDING_NAV_DURATION = 0.7;

const Home = () => {
  const [projectFilter, setProjectFilter] = useState("all");
  const filterRef = useRef(null);
  const [filterIndicator, setFilterIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
  });
  const heroTitleRef = useRef(null);
  const bioRef = useRef(null);
  const landingCatRef = useRef(null);
  const homeGridProjects = useMemo(
    () => getHomeGridProjects(projectFilter),
    [projectFilter],
  );
  const homeGridPositions = useMemo(
    () => getHomeGridPositions(projectFilter),
    [projectFilter],
  );

  useLayoutEffect(() => {
    const root = filterRef.current;
    if (!root) return undefined;

    const measure = () => {
      const active = root.querySelector(".home-project-filter-btn.is-active");
      if (!active) return;
      setFilterIndicator({
        left: active.offsetLeft,
        top: active.offsetTop + active.offsetHeight - 1,
        width: active.offsetWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projectFilter]);

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
          duration: LANDING_NAV_DURATION,
          ease: LANDING_EASE,
        },
        LANDING_NAV_DELAY,
      );

    return () => tl.kill();
  }, []);

  const combinedWorkSection = (
    <section id="work" className="home-work home-work--combined">
      <div className="home-work-inner page-content-shell">
        <div
          ref={filterRef}
          className="home-project-filter"
          role="group"
          aria-label="Filter projects"
        >
          <span
            className="home-project-filter-indicator"
            style={{
              width: filterIndicator.width,
              transform: `translate(${filterIndicator.left}px, ${filterIndicator.top}px)`,
            }}
            aria-hidden="true"
          />
          {HOME_FILTERS.map((filter) => {
            const isActive = projectFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                className={`home-project-filter-btn${isActive ? " is-active" : ""}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  // A focused embed is still in the document when the grid
                  // swaps. React then refocuses it and the page scrolls.
                  if (document.activeElement instanceof HTMLIFrameElement) {
                    document.activeElement.blur();
                  }
                }}
                onClick={() => {
                  if (filter.id === projectFilter) return;
                  const grid = document.querySelector(
                    ".home-play-bento-grid-natural",
                  );
                  if (grid) grid.style.minHeight = `${grid.offsetHeight}px`;
                  setProjectFilter(filter.id);
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
        <div>
          <PlayBentoGridNatural
            projects={homeGridProjects}
            positions={homeGridPositions}
          />
        </div>
      </div>
    </section>
  );

  return (
    <>
      <main className="home" style={{ backgroundColor: "#fafafa" }}>
        <section id="landing" className="home-landing">
          <div className="home-landing-content page-content-shell">
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
                      Creative Technologist at{" "}
                      <a
                        href="https://the-brandidentity.com/interview/inside-google-creative-lab-how-a-small-team-helps-to-invent-the-future"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-company-with-logo home-landing-company-link"
                      >
                        <img
                          src={googleLogo}
                          alt=""
                          className="home-company-logo"
                          aria-hidden="true"
                        />
                        Google Creative Lab.
                      </a>
                      <br />
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

        {combinedWorkSection}

        <Footer />
      </main>
    </>
  );
};

export default Home;
