import React, { useRef, useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import "./MoodleCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const MoodleCaseStudy = () => {
  // Reset scroll position to top when page loads/refreshes
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);

  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);

  // Refs for scroll animations
  const contextWhatIsMoodleRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactMetricsRefs = useRef([]);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const contextImage1Ref = useRef(null);
  const contextImage2Ref = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const researchOverviewImage1Ref = useRef(null);
  const researchBenchmarkingTextContainerRef = useRef(null);
  const researchOverviewImage2Ref = useRef(null);
  const researchFinding1TitleRef = useRef(null);
  const researchFinding1ContentRef = useRef(null);
  const researchFinding1ImageRef = useRef(null);
  const researchFinding2TitleRef = useRef(null);
  const researchFinding2ContentRef = useRef(null);
  const researchFinding2ImageRef = useRef(null);
  const researchFinding3TitleRef = useRef(null);
  const researchFinding3ContentRef = useRef(null);
  const researchFinding3ImageRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionVisualIdentitySubtitleRef = useRef(null);
  const solutionVisualIdentityContentRef = useRef(null);
  const solutionVisualIdentityImage1Ref = useRef(null);
  const solutionVisualIdentityImage2Ref = useRef(null);
  const solutionVisualIdentityImage3Ref = useRef(null);
  const solutionKeyFeaturesSubtitleRef = useRef(null);
  const solution1TitleRef = useRef(null);
  const solution1ContentRef = useRef(null);
  const solution1VideoRef = useRef(null);
  const solution1CaptionRef = useRef(null);
  const solution2TitleRef = useRef(null);
  const solution2ContentRef = useRef(null);
  const solution2VideoRef = useRef(null);
  const solution2CaptionRef = useRef(null);
  const solution3TitleRef = useRef(null);
  const solution3ContentRef = useRef(null);
  const solution3VideoRef = useRef(null);
  const solution3CaptionRef = useRef(null);
  const validationTitleRef = useRef(null);
  const validationContentRef = useRef(null);
  const validationImageRef = useRef(null);
  const validationMethodsRef = useRef(null);
  const validationResultsTitleRef = useRef(null);
  const validationResultsImageRef = useRef(null);
  const validationResultsTextRef = useRef(null);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemsRefs = useRef([]);
  const nextStepsTitleRef = useRef(null);
  const nextStepsItemsRefs = useRef([]);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  const handleSkipToSolution = () => {
    // Scroll to solution section (to be implemented later)
    const solutionSection = document.getElementById("solution-section");
    if (solutionSection) {
      solutionSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Countup animation for metrics - memoize to prevent hook re-runs
  const metrics = useMemo(
    () => [
      {
        value: 133,
        prefix: "",
        suffix: "%",
        elementRef: metricRefs,
        index: 0,
      },
      {
        value: 82,
        prefix: "",
        suffix: "",
        elementRef: metricRefs,
        index: 1,
      },
      {
        value: 16.7,
        prefix: "",
        suffix: "%",
        elementRef: metricRefs,
        index: 2,
      },
    ],
    []
  );

  useCountupAnimation(impactSectionRef, metrics);

  // Use card unfurling hook for See Next section
  useCardUnfurling({
    gridRef: seeNextGridRef,
    cardRefs: seeNextCardsRefs,
    options: {
      peekOffset: 40,
      start: "top 70%",
      end: "top 20%",
      minWidth: 768,
      layoutDelay: 100,
    },
  });

  // Scroll-triggered animations for context section
  useEffect(() => {
    const scrollTriggers = [];

    // Helper function to create scroll trigger animation
    const createScrollAnimation = (ref, delay = 0) => {
      if (!ref || !ref.current) return;
      gsap.set(ref.current, { opacity: 0, y: 30 });
      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: delay,
          });
        },
      });
      scrollTriggers.push(trigger);
    };

    // Context Section
    createScrollAnimation(contextWhatIsMoodleRef);
    createScrollAnimation(contextMyRoleRef, 0.1);
    createScrollAnimation(contextImpactTitleRef, 0.2);
    // Impact metrics with stagger
    contextImpactMetricsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: 0.3 + index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });
    createScrollAnimation(contextStatementTitleRef);
    createScrollAnimation(contextStatementContentRef, 0.1);
    createScrollAnimation(contextImage1Ref, 0.2);
    createScrollAnimation(contextImage2Ref, 0.3);

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);
    createScrollAnimation(researchOverviewImage1Ref, 0.2);
    createScrollAnimation(researchBenchmarkingTextContainerRef, 0.25);
    createScrollAnimation(researchOverviewImage2Ref, 0.3);
    // Finding 1
    createScrollAnimation(researchFinding1TitleRef);
    createScrollAnimation(researchFinding1ContentRef, 0.1);
    createScrollAnimation(researchFinding1ImageRef, 0.2);
    // Finding 2
    createScrollAnimation(researchFinding2TitleRef);
    createScrollAnimation(researchFinding2ContentRef, 0.1);
    createScrollAnimation(researchFinding2ImageRef, 0.2);
    // Finding 3
    createScrollAnimation(researchFinding3TitleRef);
    createScrollAnimation(researchFinding3ContentRef, 0.1);
    createScrollAnimation(researchFinding3ImageRef, 0.2);

    // Solution Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionVisualIdentitySubtitleRef, 0.1);
    createScrollAnimation(solutionVisualIdentityContentRef, 0.2);
    createScrollAnimation(solutionVisualIdentityImage1Ref, 0.3);
    createScrollAnimation(solutionVisualIdentityImage2Ref, 0.4);
    createScrollAnimation(solutionVisualIdentityImage3Ref, 0.35);
    createScrollAnimation(solutionKeyFeaturesSubtitleRef);
    // Solution 1
    createScrollAnimation(solution1TitleRef);
    createScrollAnimation(solution1ContentRef, 0.1);
    createScrollAnimation(solution1VideoRef, 0.2);
    createScrollAnimation(solution1CaptionRef, 0.3);
    // Solution 2
    createScrollAnimation(solution2TitleRef);
    createScrollAnimation(solution2ContentRef, 0.1);
    createScrollAnimation(solution2VideoRef, 0.2);
    createScrollAnimation(solution2CaptionRef, 0.3);
    // Solution 3
    createScrollAnimation(solution3TitleRef);
    createScrollAnimation(solution3ContentRef, 0.1);
    createScrollAnimation(solution3VideoRef, 0.2);
    createScrollAnimation(solution3CaptionRef, 0.3);

    // Validation Study Section
    createScrollAnimation(validationTitleRef);
    createScrollAnimation(validationContentRef, 0.1);
    createScrollAnimation(validationImageRef, 0.2);
    createScrollAnimation(validationMethodsRef, 0.3);
    createScrollAnimation(validationResultsTitleRef);
    createScrollAnimation(validationResultsImageRef, 0.1);
    createScrollAnimation(validationResultsTextRef, 0.2);

    // Key Takeaways Section
    createScrollAnimation(takeawaysTitleRef);
    takeawaysItemsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });

    // Next Steps Section
    createScrollAnimation(nextStepsTitleRef);
    nextStepsItemsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="moodle-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      {/* Hero Section */}
      <section className="moodle-hero-section">
        {/* Hero Before Image - Visual welcome */}
        <div className="moodle-hero-image-container moodle-hero-before">
          <img
            src="/work/moodle/hero-before.png"
            alt="Moodle AI-Powered Feline Pain Detection"
            className="moodle-hero-image"
          />
        </div>

        {/* Hero Text Content */}
        <div className="moodle-hero-content">
          {/* Left Column */}
          <div className="moodle-hero-left">
            <h1 className="moodle-hero-title">
              Moodle: AI-Powered Feline Pain Detection for Cat Owners
            </h1>
            <div className="moodle-hero-details">
              <div className="moodle-hero-detail-item">
                <div className="moodle-hero-detail-label">ROLE</div>
                <div className="moodle-hero-detail-value">Product Designer</div>
              </div>
              <div className="moodle-hero-detail-item">
                <div className="moodle-hero-detail-label">DURATION</div>
                <div className="moodle-hero-detail-value">
                  Oct — Dec 2025 (7 Weeks)
                </div>
              </div>
              <div className="moodle-hero-detail-item">
                <div className="moodle-hero-detail-label">TOOLS</div>
                <div className="moodle-hero-detail-value">Figma</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="moodle-hero-right">
            <p className="moodle-hero-subtitle">
              Making clinical-grade pain monitoring accessible to cat owners
              through intuitive mobile design and privacy-first AI.
            </p>
            <div className="moodle-hero-tags">
              <span className="moodle-hero-tag">Mobile</span>
              <span className="moodle-hero-tag">UX/UI</span>
              <span className="moodle-hero-tag">User Research</span>
              <span className="moodle-hero-tag">AI/ML</span>
            </div>
            <button
              className="moodle-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="moodle-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="moodle-skip-arrow"
                >
                  <path
                    d="M10 5V15M10 15L5 10M10 15L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="moodle-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        {/* Hero After Image - After all text */}
        <div className="moodle-hero-image-container moodle-hero-after">
          <img
            src="/work/moodle/hero-after.png"
            alt="Moodle AI-Powered Feline Pain Detection"
            className="moodle-hero-image"
          />
        </div>
      </section>

      {/* Context Section */}
      <section className="moodle-context-section">
        <div className="moodle-context-content">
          {/* Top Row - Two Columns */}
          <div className="moodle-context-top">
            <div className="moodle-context-item" ref={contextWhatIsMoodleRef}>
              <h2 className="moodle-context-title">What is Moodle?</h2>
              <p className="moodle-context-description">
                Moodle is an AI-powered mobile app that brings the validated
                Feline Grimace Scale to cat owners, turning smartphones into
                clinical-grade pain monitoring tools.
              </p>
            </div>
            <div className="moodle-context-item" ref={contextMyRoleRef}>
              <h2 className="moodle-context-title">My Role</h2>
              <p className="moodle-context-description">
                As the Product Designer of a two-person team, I led all user
                research (6 formative interviews, 7-participant user evaluation
                study), designed the core user flows (photo analysis, historical
                tracking, and search), and defined privacy-first design
                principles that shaped our technical architecture.
              </p>
            </div>
          </div>

          {/* Bottom Row - Impact Metrics */}
          <div className="moodle-context-impact" ref={impactSectionRef}>
            <h3 className="moodle-impact-title" ref={contextImpactTitleRef}>
              Impact
            </h3>
            <div className="moodle-impact-metrics">
              <div
                className="moodle-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
              >
                <div
                  className="moodle-impact-value"
                  ref={(el) => (metricRefs.current[0] = el)}
                >
                  0%
                </div>
                <div className="moodle-impact-label">
                  confidence increase for novice cat owners in pain assessment
                  accuracy
                </div>
              </div>
              <div
                className="moodle-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
              >
                <div
                  className="moodle-impact-value"
                  ref={(el) => (metricRefs.current[1] = el)}
                >
                  0
                </div>
                <div className="moodle-impact-label">
                  SUS score achieved (above the <i>excellent</i> usability
                  threshold of 80.3)
                </div>
              </div>
              <div
                className="moodle-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
              >
                <div
                  className="moodle-impact-value"
                  ref={(el) => (metricRefs.current[2] = el)}
                >
                  0%
                </div>
                <div className="moodle-impact-label">
                  less mental effort required when using AI assistance
                </div>
              </div>
            </div>
          </div>

          {/* Context Statement Section */}
          <div className="moodle-context-statement">
            <h3
              className="moodle-context-statement-title"
              ref={contextStatementTitleRef}
            >
              CONTEXT
            </h3>
            <div
              className="moodle-context-image-container"
              ref={contextImage1Ref}
            >
              <img
                src="/work/moodle/two-cats.png"
                alt="Can you tell which cat is in pain?"
                className="moodle-context-image"
              />
            </div>
            <div
              className="moodle-context-statement-content"
              ref={contextStatementContentRef}
            >
              <div className="moodle-context-statement-question-group">
                <p className="moodle-context-statement-text">
                  Can you tell
                  <span className="moodle-accent-text">
                    which cat is in pain
                  </span>
                  ?
                </p>
                <p className="moodle-context-statement-answer">
                  (It's the right one!)
                </p>
              </div>
              <p className="moodle-context-statement-bold">
                <span className="moodle-accent-text">
                  Most cat owners can't either.
                </span>
              </p>
              <p className="moodle-context-statement-description">
                Cats are famously good at hiding their pain, leaving{" "}
                <i>95 million</i> U.S. cat owners facing unnecessary expensive
                vet visits or preventable disease progression in their cats.
              </p>
              <p className="moodle-context-statement-description">
                Veterinarians use the{" "}
                <span className="moodle-context-statement-medium-bold">
                  Feline Grimace Scale
                </span>{" "}
                to objectively detect pain through facial features. But cat
                owners don't have access to this clinical knowledge.
              </p>
            </div>
            <div
              className="moodle-context-image-container"
              ref={contextImage2Ref}
            >
              <img
                src="/work/moodle/FGS.png"
                alt="Feline Grimace Scale"
                className="moodle-context-image"
              />
              <p className="moodle-context-image-caption">
                So we simplified the clinical Feline Grimace Scale into an{" "}
                <span className="moodle-context-statement-medium-bold">
                  accessible
                </span>{" "}
                format for everyday cat owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="moodle-research-section">
        <div className="moodle-research-content">
          <h3 className="moodle-research-title" ref={researchTitleRef}>
            RESEARCH
          </h3>

          <div className="moodle-research-overview">
            <h4
              className="moodle-research-subtitle"
              ref={researchOverviewSubtitleRef}
            >
              Discovery Phase
            </h4>
            <div className="moodle-research-benchmarking">
              <div
                className="moodle-research-image-container"
                ref={researchOverviewImage1Ref}
              >
                <img
                  src="/work/moodle/technical-benchmarking.png"
                  alt="Technical Benchmarking"
                  className="moodle-research-image"
                />
              </div>
              <div
                className="moodle-research-benchmarking-text-container"
                ref={researchBenchmarkingTextContainerRef}
              >
                <p className="moodle-research-benchmarking-title">
                  Technical Benchmarking
                </p>
                <p className="moodle-research-benchmarking-text">
                  Evaluated existing cat pain detection tools to identify gaps
                  in accuracy, usability, and user trust.
                </p>
              </div>
            </div>
            <div
              className="moodle-research-image-container"
              ref={researchOverviewImage2Ref}
            >
              <img
                src="/work/moodle/research-participants.png"
                alt="6 Formative Interviews"
                className="moodle-research-image"
              />
            </div>
          </div>

          {/* Key Finding #1 */}
          <div className="moodle-research-finding">
            <h4
              className="moodle-research-finding-title"
              ref={researchFinding1TitleRef}
            >
              Key Finding #1: The tool needs to build confidence, not just
              provide answers.
            </h4>
            <div
              className="moodle-research-finding-content"
              ref={researchFinding1ContentRef}
            >
              <p className="moodle-research-finding-description">
                100% of participants{" "}
                <span className="moodle-accent-text">struggled</span> to
                identify pain in their cats, even after years of ownership.
              </p>
            </div>
            <div
              className="moodle-research-image-container"
              ref={researchFinding1ImageRef}
            >
              <img
                src="/work/moodle/finding-1.png"
                alt="Key Finding #1"
                className="moodle-research-image"
              />
            </div>
          </div>

          {/* Key Finding #2 */}
          <div className="moodle-research-finding">
            <h4
              className="moodle-research-finding-title"
              ref={researchFinding2TitleRef}
            >
              Key Finding #2: Show users the "why" behind every score, not just
              the result.
            </h4>
            <div
              className="moodle-research-finding-content"
              ref={researchFinding2ContentRef}
            >
              <p className="moodle-research-finding-description">
                When asked about using AI to assess their cat's health,
                participants{" "}
                <span className="moodle-accent-text">expressed skepticism</span>
                .
              </p>
            </div>
            <div
              className="moodle-research-image-container"
              ref={researchFinding2ImageRef}
            >
              <img
                src="/work/moodle/finding-2.png"
                alt="Key Finding #2"
                className="moodle-research-image"
              />
            </div>
          </div>

          {/* Key Finding #3 */}
          <div className="moodle-research-finding">
            <h4
              className="moodle-research-finding-title"
              ref={researchFinding3TitleRef}
            >
              Key Finding #3: Historical Tracking Matters More Than Individual
              Scores
            </h4>
            <div
              className="moodle-research-finding-content"
              ref={researchFinding3ContentRef}
            >
              <p className="moodle-research-finding-description">
                Participants valued seeing{" "}
                <span className="moodle-accent-text">patterns over time</span>{" "}
                more than individual pain scores.
              </p>
            </div>
            <div
              className="moodle-research-image-container"
              ref={researchFinding3ImageRef}
            >
              <img
                src="/work/moodle/finding-3.png"
                alt="Key Finding #3"
                className="moodle-research-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="moodle-solution-section">
        <div className="moodle-solution-content">
          <h3 className="moodle-solution-title" ref={solutionTitleRef}>
            SOLUTION
          </h3>

          {/* Visual Identity */}
          <div className="moodle-solution-visual-identity">
            <h4
              className="moodle-solution-subtitle"
              ref={solutionVisualIdentitySubtitleRef}
            >
              Design System
            </h4>
            <div
              className="moodle-solution-visual-identity-content"
              ref={solutionVisualIdentityContentRef}
            >
              <p className="moodle-solution-visual-identity-text">
                I designed Moodle's visual identity to feel{" "}
                <span className="moodle-solution-visual-identity-medium-bold">
                  approachable yet trustworthy
                </span>
                —balancing medical reliability with friendly design.
              </p>
            </div>
            <div className="moodle-solution-visual-identity-grid">
              <div
                className="moodle-solution-image-container moodle-solution-image-left"
                ref={solutionVisualIdentityImage1Ref}
              >
                <img
                  src="/work/moodle/design-1.png"
                  alt="Moodle Visual Identity"
                  className="moodle-solution-image"
                />
              </div>
              <div className="moodle-solution-visual-identity-right-column">
                <div
                  className="moodle-solution-image-container moodle-solution-image-right-top"
                  ref={solutionVisualIdentityImage3Ref}
                >
                  <img
                    src="/work/moodle/design-3.png"
                    alt="Moodle Visual Identity"
                    className="moodle-solution-image"
                  />
                </div>
                <div
                  className="moodle-solution-image-container moodle-solution-image-right-bottom"
                  ref={solutionVisualIdentityImage2Ref}
                >
                  <img
                    src="/work/moodle/design-2.png"
                    alt="Moodle Visual Identity"
                    className="moodle-solution-image"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="moodle-solution-key-features">
            <h4
              className="moodle-solution-subtitle"
              ref={solutionKeyFeaturesSubtitleRef}
            >
              Key Features
            </h4>

            {/* Solution #1 */}
            <div className="moodle-solution-item">
              <h4
                className="moodle-solution-item-title"
                ref={solution1TitleRef}
              >
                Feature #1: Analysis That Reveals the Why
              </h4>
              <div
                className="moodle-solution-item-content"
                ref={solution1ContentRef}
              >
                <p className="moodle-solution-item-description">
                  Users{" "}
                  <span className="moodle-accent-text">see exactly how</span>{" "}
                  the AI measures pain through eyes, ears, and muzzle analysis.
                </p>
              </div>
              <div className="moodle-solution-media">
                <div
                  className="moodle-solution-video-container"
                  ref={solution1VideoRef}
                >
                  <video
                    src="/work/moodle/sol-1.mp4"
                    className="moodle-solution-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p
                  className="moodle-solution-caption"
                  ref={solution1CaptionRef}
                >
                  Built-in image guidelines and expandable score breakdowns
                  address two critical needs: teaching users{" "}
                  <span className="moodle-solution-caption-bold">
                    what makes a good photo
                  </span>{" "}
                  and showing{" "}
                  <span className="moodle-solution-caption-bold">
                    how every score is calculated
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Solution #2 */}
            <div className="moodle-solution-item">
              <h4
                className="moodle-solution-item-title"
                ref={solution2TitleRef}
              >
                Feature #2: Search That Surfaces Patterns
              </h4>
              <div
                className="moodle-solution-item-content"
                ref={solution2ContentRef}
              >
                <p className="moodle-solution-item-description">
                  Search past entries to{" "}
                  <span className="moodle-accent-text">
                    quickly find relevant
                  </span>{" "}
                  symptoms and health events.
                </p>
              </div>
              <div className="moodle-solution-media">
                <div
                  className="moodle-solution-video-container"
                  ref={solution2VideoRef}
                >
                  <video
                    src="/work/moodle/sol-2.mp4"
                    className="moodle-solution-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p
                  className="moodle-solution-caption"
                  ref={solution2CaptionRef}
                >
                  Search enables users to{" "}
                  <span className="moodle-solution-caption-semi-bold">
                    track recurring issues
                  </span>{" "}
                  across time—turning scattered observations into actionable
                  health patterns.
                </p>
              </div>
            </div>

            {/* Solution #3 */}
            <div className="moodle-solution-item">
              <h4
                className="moodle-solution-item-title"
                ref={solution3TitleRef}
              >
                Feature #3: Calendar That Reveals Trends
              </h4>
              <div
                className="moodle-solution-item-content"
                ref={solution3ContentRef}
              >
                <p className="moodle-solution-item-description">
                  Filter historical records by critical factors to{" "}
                  <span className="moodle-accent-text">
                    visualize patterns at a glance
                  </span>
                  .
                </p>
              </div>
              <div className="moodle-solution-media">
                <div
                  className="moodle-solution-video-container"
                  ref={solution3VideoRef}
                >
                  <video
                    src="/work/moodle/sol-3.mp4"
                    className="moodle-solution-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p
                  className="moodle-solution-caption"
                  ref={solution3CaptionRef}
                >
                  Calendar view with filtering transforms point-in-time
                  assessments into longitudinal insights—enabling users to{" "}
                  <span className="moodle-solution-caption-semi-bold">
                    spot trends
                  </span>{" "}
                  over weeks and months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Study Section */}
      <section className="moodle-validation-section">
        <div className="moodle-validation-content">
          <h3 className="moodle-validation-title" ref={validationTitleRef}>
            VALIDATION STUDY
          </h3>

          <div className="moodle-validation-intro" ref={validationContentRef}>
            <h4 className="moodle-validation-intro-title">Measuring Impact</h4>
          </div>

          <div
            className="moodle-validation-image-container"
            ref={validationImageRef}
          >
            <img
              src="/work/moodle/subject-study.png"
              alt="Validation Study"
              className="moodle-validation-image"
            />
          </div>

          <div
            className="moodle-validation-image-container"
            ref={validationMethodsRef}
          >
            <img
              src="/work/moodle/method-analysis.png"
              alt="Methods and Analysis"
              className="moodle-validation-image"
            />
          </div>

          <div className="moodle-validation-results">
            <h4
              className="moodle-validation-results-title"
              ref={validationResultsTitleRef}
            >
              Results
            </h4>
            <div className="moodle-validation-results-content">
              <div
                className="moodle-validation-results-image-container"
                ref={validationResultsImageRef}
              >
                <img
                  src="/work/moodle/sus-score.png"
                  alt="SUS Score Results"
                  className="moodle-validation-results-image"
                />
              </div>
              <div
                className="moodle-validation-results-text"
                ref={validationResultsTextRef}
              >
                <p className="moodle-validation-results-description">
                  Moodle achieved strong usability with the greatest impact on{" "}
                  <span className="moodle-validation-results-medium-bold moodle-accent-text">
                    novice owners
                  </span>{" "}
                  who saw over{" "}
                  <span className="moodle-validation-results-medium-bold moodle-accent-text">
                    133%
                  </span>{" "}
                  <span className="moodle-validation-results-medium-bold moodle-accent-text">
                    confidence gains
                  </span>
                  .
                </p>
                <p className="moodle-validation-results-description">
                  However, our validation study confirmed early concerns—
                  <span className="moodle-validation-results-medium-bold">
                    6 out of 7 users wouldn't fully trust AI without veterinary
                    validation.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="moodle-next-steps-section">
        <div className="moodle-next-steps-content">
          <h3 className="moodle-next-steps-title" ref={nextStepsTitleRef}>
            WHERE MOODLE GOES FROM HERE
          </h3>
          <ul className="moodle-next-steps-list">
            <li
              className="moodle-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[0] = el)}
            >
              <span style={{ fontWeight: 600 }}>Partner</span> with veterinary
              clinics to validate AI scores and build user trust through
              professional endorsement
            </li>
            <li
              className="moodle-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[1] = el)}
            >
              <span style={{ fontWeight: 600 }}>Add</span> image-specific
              explanations that show users exactly what the AI detected in their
              cat's photo
            </li>
            <li
              className="moodle-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[2] = el)}
            >
              <span style={{ fontWeight: 600 }}>Expand</span> tracking features
              with symptom clustering, trend charts, and behavioral notes
            </li>
            <li
              className="moodle-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[3] = el)}
            >
              <span style={{ fontWeight: 600 }}>Connect</span> users to vets
              through telehealth integration for high pain scores
            </li>
          </ul>
        </div>
      </section>

      {/* Key Takeaways Section */}
      <section className="moodle-takeaways-section">
        <div className="moodle-takeaways-content">
          <h3 className="moodle-takeaways-title" ref={takeawaysTitleRef}>
            KEY TAKEAWAYS
          </h3>
          <div
            className="moodle-takeaways-item"
            ref={(el) => (takeawaysItemsRefs.current[0] = el)}
          >
            <h4 className="moodle-takeaways-title-text">
              Design for the least confident users, not the most experienced.
            </h4>
            <p className="moodle-takeaways-description">
              Moodle's impact varied dramatically by expertise—novice owners saw
              significant confidence gains, while experienced owners still
              relied on their own judgment. Designing for those who struggle
              most creates the greatest value and impact.
            </p>
          </div>
          <div
            className="moodle-takeaways-item"
            ref={(el) => (takeawaysItemsRefs.current[1] = el)}
          >
            <h4 className="moodle-takeaways-title-text">
              Usability alone doesn't build trust in health apps.
            </h4>
            <p className="moodle-takeaways-description">
              Despite achieving an 82 SUS score, almost every user wouldn't
              fully trust AI without veterinary validation. I learned that in
              medical applications, clinical endorsement is essential—excellent
              design can't overcome trust barriers without professional backing.
            </p>
          </div>
        </div>
      </section>

      {/* See Next Section */}
      <section className="moodle-see-next-section">
        <div className="moodle-see-next-content">
          <h3 className="moodle-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div className="moodle-see-next-grid" ref={seeNextGridRef}>
            <Link
              to="/venmo"
              className="moodle-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="moodle-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[0] = el)}
              >
                <div className="moodle-see-next-image-container">
                  <video
                    src="/work/venmo/thumbnail.mp4"
                    className="moodle-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="moodle-see-next-card-title">
                  Redesigning Venmo's Privacy Controls
                </h4>
                <p className="moodle-see-next-card-description">
                  Transforming Venmo's public-by-default privacy model to help
                  users make informed choices without confusion.
                </p>
              </div>
            </Link>
            <Link
              to="/confido"
              className="moodle-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="moodle-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="moodle-see-next-image-container">
                  <video
                    src="/work/confido/thumbnail.mp4"
                    className="moodle-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="moodle-see-next-card-title">
                  Rebuilding Confido's Approval Flow
                </h4>
                <p className="moodle-see-next-card-description">
                  Redesigning approval workflows with smarter logic and clearer
                  audit trails for improved enterprise usability.
                </p>
              </div>
            </Link>
            <Link
              to="/wholefoods"
              className="moodle-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="moodle-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[2] = el)}
              >
                <div className="moodle-see-next-image-container">
                  <video
                    src="/work/wholefoods/thumbnail.mp4"
                    className="moodle-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="moodle-see-next-card-title">
                  Improving Whole Foods In-Store Checkout Experience
                </h4>
                <p className="moodle-see-next-card-description">
                  Surfacing a hidden checkout feature for an improved in-store
                  experience by aligning interface design with user mental
                  models.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MoodleCaseStudy;
