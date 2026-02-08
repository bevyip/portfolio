import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer/Footer";
import StickerPeel from "../../components/StickerPeel/StickerPeel";
import ArrowToOpenToWork from "../../components/Arrows/ArrowToOpenToWork/ArrowToOpenToWork";
import PhotoGrid from "../../components/PhotoGrid/PhotoGrid";
import ExperienceTimeline from "../../components/ExperienceTimeline/ExperienceTimeline";
import CursorPill from "../../components/CursorPill/CursorPill";
import useScrollReset from "../../hooks/useScrollReset";
import { useLetterByLetterAnimation } from "../../hooks/useLetterByLetterAnimation";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);
import purdueLogo from "../../assets/img/logo-stickers/purdue-logo.png";
import salesforceLogo from "../../assets/img/logo-stickers/salesforce-logo.png";
import nyuLogo from "../../assets/img/logo-stickers/nyu-logo.png";
import confidoLogo from "../../assets/img/logo-stickers/confido-logo.png";
import reactLogo from "../../assets/img/logo-stickers/react-logo.png";
import figmaLogo from "../../assets/img/logo-stickers/figma-logo.png";

const About = () => {
  const titleRef = useRef(null);
  const howIGotHereTitleRef = useRef(null);
  const arrowStartRef = useRef(null);
  const rolePillsRef = useRef(null);
  const openToWorkBadgeRef = useRef(null);
  const [isHoveringSticker, setIsHoveringSticker] = useState(false);

  // Reset scroll position to top when page loads/refreshes
  useScrollReset();

  // Animate "How I got here" title with rising up animation (like home page subtitle)
  useEffect(() => {
    const titleElement = howIGotHereTitleRef.current;
    if (!titleElement) return;

    const titleText = titleElement.querySelector(".about-title-text");
    if (!titleText) return;

    // Set initial state - text starts below (like home page subtitle)
    gsap.set(titleText, {
      opacity: 0,
      y: "100%",
    });

    // Animate on scroll with rising up effect (like home page subtitle)
    const scrollTrigger = ScrollTrigger.create({
      trigger: titleElement,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(titleText, {
          opacity: 1,
          y: "0%",
          duration: 1.2,
          ease: "power2.out",
        });
      },
    });

    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, []);

  // Animate photo grid title with letter-by-letter animation
  useLetterByLetterAnimation({
    titleRef: titleRef,
    triggerRef: titleRef,
    start: "top 55%",
    end: "top 20%",
    scrub: 2,
    colorRanges: [
      { start: 9, end: 11, color: "#7DD3FC" }, // "not" should be blue (positions 9-11 after "When I'm ")
    ],
  });

  // Show arrow anchor point after photo-grid pin ends
  useEffect(() => {
    const arrowStartPoint = arrowStartRef.current;
    const photoGridSection = document.getElementById("photo-grid-section");

    if (!arrowStartPoint || !photoGridSection) return;

    // Initially hide the anchor point (keep height for positioning calculations)
    gsap.set(arrowStartPoint, {
      opacity: 0,
    });

    // Pin duration matches PhotoGrid component
    const pinDuration = window.innerHeight * 2.5;

    // Show the anchor point when the pin ends
    const scrollTrigger = ScrollTrigger.create({
      trigger: photoGridSection,
      start: `top+=${Math.round(pinDuration)}px top`, // When pin ends
      onEnter: () => {
        gsap.to(arrowStartPoint, {
          opacity: 1,
          duration: 0.3,
        });
      },
      onLeaveBack: () => {
        gsap.to(arrowStartPoint, {
          opacity: 0,
          duration: 0.3,
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <>
      <CursorPill isHovering={isHoveringSticker} text="Peel me!" />
      <main
        className="min-h-screen relative"
        style={{ backgroundColor: "#0f0f0f" }}
      >
        <ArrowToOpenToWork />
        <section
          id="about-me-section"
          className="min-h-screen flex items-center justify-center py-20 md:py-32"
        >
          <div className="max-w-[700px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="space-y-6 md:space-y-8 about-content">
              {/* Title */}
              <h1 ref={howIGotHereTitleRef} className="about-title">
                <span className="about-title-wrapper">
                  <span className="about-title-text">
                    <span className="about-title-word about-title-how">How </span>
                    <span className="about-title-word about-title-igothere">
                      I got here
                    </span>
                  </span>
                </span>
                <span className="about-scroll-hint about-fade-in">
                  (scroll down ↓)
                </span>
              </h1>

              {/* First paragraph */}
              <div className="about-paragraph-wrapper">
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={purdueLogo}
                    rotate={-10}
                    width={70}
                    className="about-sticker-purdue"
                  />
                </div>
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={salesforceLogo}
                    rotate={10}
                    width={80}
                    className="about-sticker-salesforce"
                  />
                </div>
                <p
                  className="text-[14px] md:text-[16px] leading-[1.5] md:leading-[1.6] font-normal"
                  style={{ color: "#fafafa" }}
                >
                  <span
                    className="font-semibold about-subtitle about-fade-in"
                    style={{ color: "#7DD3FC" }}
                  >
                    I didn't start out in the creative space.
                  </span>{" "}
                  <span className="about-paragraph-1 about-fade-in">
                    I spent eight years in software engineering — studying
                    Computer Science at{" "}
                    <a
                      href="https://www.purdue.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold about-company-link"
                    >
                      Purdue University
                    </a>
                    , then building tools like Flow Builder at{" "}
                    <a
                      href="https://www.salesforce.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold about-company-link"
                    >
                      Salesforce
                    </a>{" "}
                    and leading accessibility in my team. I was good at it. But
                    somewhere along the way, I realized I cared just as much
                    about{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#7DD3FC" }}
                    >
                      how people felt using it
                    </span>{" "}
                    as how the code worked.
                  </span>
                </p>
              </div>

              {/* Second paragraph */}
              <div className="about-paragraph-wrapper">
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={nyuLogo}
                    rotate={10}
                    width={70}
                    className="about-sticker-nyu"
                  />
                </div>
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={confidoLogo}
                    rotate={-15}
                    width={60}
                    className="about-sticker-confido"
                  />
                </div>
                <p
                  className="text-[14px] md:text-[16px] leading-[1.5] md:leading-[1.6] font-normal about-paragraph-2 about-fade-in"
                  style={{ color: "#fafafa" }}
                >
                  That led me to{" "}
                  <a
                    href="https://itp.nyu.edu/itp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium about-company-link"
                  >
                    NYU’s Interactive Telecommunications Program
                  </a>{" "}
                  to study Human-Computer Interaction — to explore how design
                  and engineering could work together to make technology more
                  accessible and intuitive. During my time there, I joined{" "}
                  <a
                    href="https://www.confidotech.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium about-company-link"
                  >
                    Confido
                  </a>{" "}
                  as both Product Designer and Full-Stack Developer, where I
                  stopped choosing between the two roles and finally became
                  both. I designed the interfaces and built them too, which
                  proved that{" "}
                  <span className="font-medium" style={{ color: "#7DD3FC" }}>
                    the best solutions come to life when you know what it takes
                    to build it
                  </span>
                  .
                </p>
              </div>

              {/* Third paragraph */}
              <div className="about-paragraph-wrapper">
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={reactLogo}
                    rotate={-10}
                    width={70}
                    className="about-sticker-react"
                  />
                </div>
                <div
                  onMouseEnter={() => setIsHoveringSticker(true)}
                  onMouseLeave={() => setIsHoveringSticker(false)}
                >
                  <StickerPeel
                    imageSrc={figmaLogo}
                    rotate={10}
                    width={80}
                    className="about-sticker-figma"
                  />
                </div>
                <p
                  id="last-blurb-paragraph"
                  className="text-[14px] md:text-[16px] leading-[1.5] md:leading-[1.6] font-normal about-paragraph-3 about-fade-in"
                  style={{ color: "#fafafa" }}
                >
                  I still write code. I still ship products. But now every
                  decision starts with the person on the other side of the
                  screen. I'm not just designing interfaces — I'm designing
                  systems that are as{" "}
                  <span className="font-medium" style={{ color: "#7DD3FC" }}>
                    thoughtful
                  </span>{" "}
                  as they are{" "}
                  <span className="font-medium" style={{ color: "#7DD3FC" }}>
                    scalable
                  </span>
                  , as{" "}
                  <span className="font-medium" style={{ color: "#7DD3FC" }}>
                    beautiful
                  </span>{" "}
                  as they are{" "}
                  <span className="font-medium" style={{ color: "#7DD3FC" }}>
                    functional
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Role Pills Section - Wider than intro content */}
        <section
          id="open-to-work-section"
          className="pt-20 pb-10 md:pt-32 md:pb-16"
        >
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="about-role-section">
              {/* Open to Work Badge */}
              <div
                ref={openToWorkBadgeRef}
                id="open-to-work-badge"
                className="about-open-badge-container"
              >
                <span className="about-open-badge-dot"></span>
                <span className="about-open-badge-text">OPEN TO WORK</span>
              </div>
              {/* Role Pills */}
              <div ref={rolePillsRef} className="about-role-pills">
                <span id="product-designer-pill" className="about-role-pill">
                  Product Designer
                </span>
                <span className="about-role-pill">Design Engineer</span>
                <span className="about-role-pill">Creative Technologist</span>
                <span id="ux-engineer-pill" className="about-role-pill">
                  UX Engineer
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Grid Section */}
        <section id="photo-grid-section" className="pt-0">
          <div
            id="photo-grid-container"
            className="max-w-[700px] mx-auto px-6 sm:px-8 lg:px-12"
            style={{
              paddingTop: "2rem" /* Equal to title's margin-bottom */,
              marginTop: "2rem" /* Padding between yellow and green top */,
              marginBottom:
                "2rem" /* Padding between yellow and green bottom */,
            }}
          >
            <h2
              ref={titleRef}
              style={{
                fontFamily: '"Crimson Pro", serif',
                fontSize: "2.5rem",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#fafafa",
                marginBottom: "2rem",
                lineHeight: 1.2,
              }}
              className="photo-grid-title"
            >
              <span className="photo-grid-title-wrapper">
                <span className="photo-grid-title-text">
                  When I'm <span style={{ color: "#7DD3FC" }}>not</span> coding or
                  designing,
                </span>
              </span>
            </h2>
            <PhotoGrid />
          </div>
          {/* Anchor point for arrow - appears after pin ends, centered below container */}
          <div
            ref={arrowStartRef}
            id="photo-grid-arrow-start"
            className="max-w-[700px] mx-auto"
            style={{
              height: "1px",
              width: "100%",
              opacity: 0,
            }}
          ></div>
        </section>

        {/* Experience Timeline Section */}
        <ExperienceTimeline />
      </main>
      <Footer />
    </>
  );
};

export default About;
