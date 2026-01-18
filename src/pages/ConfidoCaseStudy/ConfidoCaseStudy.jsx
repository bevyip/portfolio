import React, { useRef, useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import "./ConfidoCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const ConfidoCaseStudy = () => {
  // Reset scroll position to top when page loads/refreshes
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);

  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);

  // Refs for scroll animations
  const heroContentRef = useRef(null);
  const contextWhatIsConfidoRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactMetricsRefs = useRef([]);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const contextImageRef = useRef(null);
  const problem1TitleRef = useRef(null);
  const problem1ContentRef = useRef(null);
  const problem1VideoRef = useRef(null);
  const problem2TitleRef = useRef(null);
  const problem2ContentRef = useRef(null);
  const problem2ImageRef = useRef(null);
  const problem3TitleRef = useRef(null);
  const problem3ContentRef = useRef(null);
  const problem3ImageRef = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const researchOverviewImageRef = useRef(null);
  const researchFindingTitleRef = useRef(null);
  const researchFindingContentRef = useRef(null);
  const researchFindingImageRef = useRef(null);
  const designApproachTitleRef = useRef(null);
  const designApproach1TitleRef = useRef(null);
  const designApproach1ContentRef = useRef(null);
  const designApproach1ImageRef = useRef(null);
  const designApproach2TitleRef = useRef(null);
  const designApproach2ContentRef = useRef(null);
  const designApproach2Image1Ref = useRef(null);
  const designApproach2Image2Ref = useRef(null);
  const designApproach3TitleRef = useRef(null);
  const designApproach3ContentRef = useRef(null);
  const designApproach3ImageRef = useRef(null);
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
  const solution4TitleRef = useRef(null);
  const solution4ContentRef = useRef(null);
  const solution4VideoRef = useRef(null);
  const solution4CaptionRef = useRef(null);
  const reflectionTitleRef = useRef(null);
  const reflectionContentRef = useRef(null);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

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
      { value: 41, prefix: "", suffix: "%", elementRef: metricRefs, index: 0 },
      { value: 27, prefix: "", suffix: "%", elementRef: metricRefs, index: 1 },
      { value: 61, prefix: "", suffix: "%", elementRef: metricRefs, index: 2 },
    ],
    []
  );

  useCountupAnimation(impactSectionRef, metrics);

  // Scroll-triggered animations for hero section
  useEffect(() => {
    // Match hero section animation exactly: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1)
    // Initial: opacity: 0, transform: translateY(30px)
    // Final: opacity: 1, transform: translateY(0)
    if (heroContentRef.current) {
      gsap.set(heroContentRef.current, { opacity: 0, y: 30 });
      gsap.to(heroContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 1.2,
      });
    }

    // Scroll-triggered animations for context section
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
    createScrollAnimation(contextWhatIsConfidoRef);
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
    createScrollAnimation(contextImageRef, 0.2);

    // Problem Section
    // Problem 1
    createScrollAnimation(problem1TitleRef);
    createScrollAnimation(problem1ContentRef, 0.1);
    createScrollAnimation(problem1VideoRef, 0.2);
    // Problem 2
    createScrollAnimation(problem2TitleRef);
    createScrollAnimation(problem2ContentRef, 0.1);
    createScrollAnimation(problem2ImageRef, 0.2);
    // Problem 3
    createScrollAnimation(problem3TitleRef);
    createScrollAnimation(problem3ContentRef, 0.1);
    createScrollAnimation(problem3ImageRef, 0.2);

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);
    createScrollAnimation(researchOverviewImageRef, 0.2);
    createScrollAnimation(researchFindingTitleRef);
    createScrollAnimation(researchFindingContentRef, 0.1);
    createScrollAnimation(researchFindingImageRef, 0.2);

    // Design Approach Section
    createScrollAnimation(designApproachTitleRef);
    // Design Approach 1
    createScrollAnimation(designApproach1TitleRef);
    createScrollAnimation(designApproach1ContentRef, 0.1);
    createScrollAnimation(designApproach1ImageRef, 0.2);
    // Design Approach 2
    createScrollAnimation(designApproach2TitleRef);
    createScrollAnimation(designApproach2ContentRef, 0.1);
    createScrollAnimation(designApproach2Image1Ref, 0.2);
    createScrollAnimation(designApproach2Image2Ref, 0.3);
    // Design Approach 3
    createScrollAnimation(designApproach3TitleRef);
    createScrollAnimation(designApproach3ContentRef, 0.1);
    createScrollAnimation(designApproach3ImageRef, 0.2);

    // Solution Section
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
    // Solution 4
    createScrollAnimation(solution4TitleRef);
    createScrollAnimation(solution4ContentRef, 0.1);
    createScrollAnimation(solution4VideoRef, 0.2);
    createScrollAnimation(solution4CaptionRef, 0.3);

    // Reflection Section
    createScrollAnimation(reflectionTitleRef);
    createScrollAnimation(reflectionContentRef, 0.1);

    // See Next Section
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="confido-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      {/* Hero Section */}
      <section className="confido-hero-section">
        {/* Hero Before Image - Visual welcome */}
        <div className="confido-hero-image-container confido-hero-before">
          <img
            src="/work/confido/hero-before.png"
            alt="Confido Approval Flow Redesign"
            className="confido-hero-image"
          />
        </div>

        {/* Hero Text Content */}
        <div className="confido-hero-content" ref={heroContentRef}>
          {/* Left Column */}
          <div className="confido-hero-left">
            <h1 className="confido-hero-title">
              Rebuilding Confido's Approval Flow
            </h1>
            <div className="confido-hero-details">
              <div className="confido-hero-detail-item">
                <div className="confido-hero-detail-label">ROLE</div>
                <div className="confido-hero-detail-value">
                  Product Designer & Developer
                </div>
              </div>
              <div className="confido-hero-detail-item">
                <div className="confido-hero-detail-label">DURATION</div>
                <div className="confido-hero-detail-value">
                  June — August 2025 (8 weeks)
                </div>
              </div>
              <div className="confido-hero-detail-item">
                <div className="confido-hero-detail-label">TOOLS</div>
                <div className="confido-hero-detail-value">
                  Figma, React, TypeScript, Node.js, Ruby, PostgreSQL
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="confido-hero-right">
            <p className="confido-hero-subtitle">
              Redesigning approval workflows with smarter logic and clearer
              audit trails for improved enterprise usability.
            </p>
            <div className="confido-hero-tags">
              <span className="confido-hero-tag">Web</span>
              <span className="confido-hero-tag">Design Systems</span>
              <span className="confido-hero-tag">Enterprise Software</span>
            </div>
            <button
              className="confido-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="confido-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="confido-skip-arrow"
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
              <span className="confido-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        {/* Hero After Image - After all text */}
        <div className="confido-hero-image-container confido-hero-after">
          <img
            src="/work/confido/hero-after.png"
            alt="Confido Approval Flow Redesign"
            className="confido-hero-image"
          />
        </div>
      </section>

      {/* Context Section */}
      <section className="confido-context-section">
        <div className="confido-context-content">
          {/* Top Row - Two Columns */}
          <div className="confido-context-top">
            <div className="confido-context-item" ref={contextWhatIsConfidoRef}>
              <h2 className="confido-context-title">What is Confido?</h2>
              <p className="confido-context-description">
                Confido is a B2B SaaS platform that helps CPG brands manage and
                resolve promotional deductions and chargebacks. The platform
                streamlines the complex process of reviewing, approving, and
                disputing promotional claims between retailers and suppliers.
              </p>
            </div>
            <div className="confido-context-item" ref={contextMyRoleRef}>
              <h2 className="confido-context-title">My Role</h2>
              <p className="confido-context-description">
                As the only designer at Confido, I led this complete 0→1
                redesign while also developing the implementation. I conducted
                user research with accounting teams at brands like Olipop and
                Unbun Foods, analyzed competitors, and designed and built the
                entire new workflow system.
              </p>
            </div>
          </div>

          {/* Bottom Row - Impact Metrics */}
          <div className="confido-context-impact" ref={impactSectionRef}>
            <h3 className="confido-impact-title" ref={contextImpactTitleRef}>
              Impact
            </h3>
            <div className="confido-impact-metrics">
              <div
                className="confido-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
              >
                <div
                  className="confido-impact-value"
                  ref={(el) => (metricRefs.current[0] = el)}
                >
                  0%
                </div>
                <div className="confido-impact-label">
                  reduction in approval time
                </div>
              </div>
              <div
                className="confido-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
              >
                <div
                  className="confido-impact-value"
                  ref={(el) => (metricRefs.current[1] = el)}
                >
                  0%
                </div>
                <div className="confido-impact-label">
                  decrease in user errors and rework
                </div>
              </div>
              <div
                className="confido-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
              >
                <div
                  className="confido-impact-value"
                  ref={(el) => (metricRefs.current[2] = el)}
                >
                  0%
                </div>
                <div className="confido-impact-label">
                  improvement in analyst satisfaction scores
                </div>
              </div>
            </div>
          </div>

          {/* Context Statement Section */}
          <div className="confido-context-statement">
            <h3
              className="confido-context-statement-title"
              ref={contextStatementTitleRef}
            >
              CONTEXT
            </h3>
            <div
              className="confido-context-statement-content"
              ref={contextStatementContentRef}
            >
              <p className="confido-context-statement-text">
                Every Approval Was Taking{" "}
                <span className="confido-accent-text">3+ Days</span>.
              </p>
              <p className="confido-context-statement-description">
                The existing approval system caused <i>35% of deductions</i> to
                cycle back for reviews, creating costly delays across the
                organization.
              </p>
            </div>
            <div
              className="confido-context-image-container"
              ref={contextImageRef}
            >
              <img
                src="/work/confido/existing-problem.png"
                alt="Existing approval problem"
                className="confido-context-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="confido-problem-section">
        <div className="confido-problem-content">
          {/* Problem #1 */}
          <div className="confido-problem-item">
            <h4 className="confido-problem-item-title" ref={problem1TitleRef}>
              Problem #1
            </h4>
            <div
              className="confido-problem-item-content"
              ref={problem1ContentRef}
            >
              <p className="confido-problem-item-description">
                Approval panels were{" "}
                <span className="confido-accent-text">
                  buried 3 levels deep
                </span>
                .
              </p>
              <p className="confido-problem-item-text">
                Users{" "}
                <span style={{ fontWeight: 600 }}>
                  couldn't find where to approve, reject, or reassign
                </span>{" "}
                without clicking through multiple screens.
              </p>
            </div>
            <div
              className="confido-problem-media-container"
              ref={problem1VideoRef}
            >
              <video
                src="/work/confido/problem-1.mp4"
                className="confido-problem-media"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* Problem #2 */}
          <div className="confido-problem-item">
            <h4 className="confido-problem-item-title" ref={problem2TitleRef}>
              Problem #2
            </h4>
            <div
              className="confido-problem-item-content"
              ref={problem2ContentRef}
            >
              <p className="confido-problem-item-description">
                Rejecting a deduction created{" "}
                <span className="confido-accent-text">endless cycles</span>.
              </p>
              <p className="confido-problem-item-text">
                Auto-reassignment logic sent rejected deductions back to the
                same user with no explanation,{" "}
                <span style={{ fontWeight: 600 }}>
                  causing confusion and wasted time
                </span>
                .
              </p>
            </div>
            <div
              className="confido-problem-image-container"
              ref={problem2ImageRef}
            >
              <img
                src="/work/confido/problem-2.png"
                alt="Problem 2: Endless cycles"
                className="confido-problem-image"
              />
            </div>
          </div>

          {/* Problem #3 */}
          <div className="confido-problem-item">
            <h4 className="confido-problem-item-title" ref={problem3TitleRef}>
              Problem #3
            </h4>
            <div
              className="confido-problem-item-content"
              ref={problem3ContentRef}
            >
              <p className="confido-problem-item-description">
                Analysts were{" "}
                <span className="confido-accent-text">
                  missing important context
                </span>
                .
              </p>
              <p className="confido-problem-item-text">
                Without detailed audit trails or change history, analysts
                couldn't understand{" "}
                <span style={{ fontWeight: 600 }}>what had changed</span> or{" "}
                <span style={{ fontWeight: 600 }}>
                  why a deduction required their attention
                </span>
                .
              </p>
            </div>
            <div
              className="confido-problem-image-container"
              ref={problem3ImageRef}
            >
              <img
                src="/work/confido/problem-3.png"
                alt="Problem 3: Missing context"
                className="confido-problem-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="confido-research-section">
        <div className="confido-research-content">
          <h3 className="confido-research-title" ref={researchTitleRef}>
            RESEARCH
          </h3>

          <div className="confido-research-overview">
            <div
              className="confido-research-overview-content"
              ref={researchOverviewSubtitleRef}
            >
              <h4 className="confido-research-subtitle">
                What's <span className="confido-accent-text">really</span> going
                on?
              </h4>
              <p className="confido-research-overview-text">
                Through user interviews with accounting teams at brands like
                Olipop and Unbun Foods, I combined qualitative insights with
                competitive analysis to understand the full scope of the issue.
              </p>
            </div>
            <div
              className="confido-research-image-container"
              ref={researchOverviewImageRef}
            >
              <img
                src="/work/confido/research-intro.png"
                alt="Research Introduction"
                className="confido-research-image"
              />
            </div>
          </div>

          {/* Research Finding */}
          <div className="confido-research-finding">
            <div
              className="confido-research-finding-content"
              ref={researchFindingContentRef}
            >
              <h4
                className="confido-research-finding-title"
                ref={researchFindingTitleRef}
              >
                Approvals were an{" "}
                <span className="confido-accent-text">afterthought</span>.
              </h4>
              <p className="confido-research-finding-text">
                After analyzing how competitors approached approval workflows, I
                realized{" "}
                <span style={{ fontWeight: 600 }}>
                  these weren't isolated UI issues—the entire approval system
                  had been treated as a secondary feature
                </span>{" "}
                rather than designed as a core workflow.
              </p>
            </div>
            <div
              className="confido-research-image-container"
              ref={researchFindingImageRef}
            >
              <img
                src="/work/confido/comparison-matrix.png"
                alt="Comparison Matrix"
                className="confido-research-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Approach Section */}
      <section className="confido-design-approach-section">
        <div className="confido-design-approach-content">
          <h3
            className="confido-design-approach-title"
            ref={designApproachTitleRef}
          >
            DESIGN APPROACH
          </h3>

          {/* Design Approach #1 */}
          <div className="confido-design-approach-item">
            <div
              className="confido-design-approach-item-content confido-design-approach-item-content-narrow"
              ref={designApproach1ContentRef}
            >
              <h4
                className="confido-design-approach-item-title"
                ref={designApproach1TitleRef}
              >
                Redesigning the Approval Flow
              </h4>
              <p className="confido-design-approach-item-text">
                The redesigned flow introduces{" "}
                <span style={{ fontWeight: 600 }}>clear terminal states</span>{" "}
                for all rejection paths and{" "}
                <span style={{ fontWeight: 600 }}>
                  fallback user assignments
                </span>{" "}
                to prevent workflow breakdowns.
              </p>
            </div>
            <div
              className="confido-design-approach-image-container"
              ref={designApproach1ImageRef}
            >
              <img
                src="/work/confido/redesigned-approval-flowchart.png"
                alt="Redesigned Approval Flowchart"
                className="confido-design-approach-image"
              />
            </div>
          </div>

          {/* Design Approach #2 */}
          <div className="confido-design-approach-item">
            <div
              className="confido-design-approach-item-content"
              ref={designApproach2ContentRef}
            >
              <h4
                className="confido-design-approach-item-title"
                ref={designApproach2TitleRef}
              >
                From Research to Design
              </h4>
              <p className="confido-design-approach-item-text">
                To address the systemic issues, I moved approvals from buried
                modals to{" "}
                <span style={{ fontWeight: 600 }}>
                  its own dedicated section with full navigation and visibility
                </span>
                .
              </p>
            </div>
            <div
              className="confido-design-approach-image-container"
              ref={designApproach2Image1Ref}
            >
              <img
                src="/work/confido/annotated-wireframe-1.png"
                alt="Annotated Wireframe 1"
                className="confido-design-approach-image"
              />
            </div>
            <div
              className="confido-design-approach-image-container"
              ref={designApproach2Image2Ref}
            >
              <img
                src="/work/confido/annotated-wireframe-2.png"
                alt="Annotated Wireframe 2"
                className="confido-design-approach-image"
              />
            </div>
          </div>

          {/* Design Approach #3 */}
          <div className="confido-design-approach-item">
            <div
              className="confido-design-approach-item-content"
              ref={designApproach3ContentRef}
            >
              <h4
                className="confido-design-approach-item-title"
                ref={designApproach3TitleRef}
              >
                Validating Through Iteration
              </h4>
              <p className="confido-design-approach-item-text">
                Over 3 weeks of weekly validation sessions with users and
                stakeholders, I iterated my designs over 4 critical areas based
                on the feedback I received:
              </p>
            </div>
            <div
              className="confido-design-approach-image-container"
              ref={designApproach3ImageRef}
            >
              <img
                src="/work/confido/iteration-grid.png"
                alt="Iteration Grid"
                className="confido-design-approach-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="confido-solution-section">
        <div className="confido-solution-content">
          {/* Solution #1 */}
          <div className="confido-solution-item">
            <h4 className="confido-solution-item-title" ref={solution1TitleRef}>
              Solution #1: Dedicated Approval Section
            </h4>
            <div
              className="confido-solution-item-content"
              ref={solution1ContentRef}
            >
              <p className="confido-solution-item-description">
                All approval actions live in{" "}
                <span className="confido-accent-text">one interface</span>.
              </p>
            </div>
            <div className="confido-solution-media">
              <div
                className="confido-solution-video-container"
                ref={solution1VideoRef}
              >
                <video
                  src="/work/confido/sol-1.mp4"
                  className="confido-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="confido-solution-caption" ref={solution1CaptionRef}>
                The dedicated approval section reduced navigation from{" "}
                <span style={{ fontWeight: 600 }}>5+ clicks to 1</span>, cutting
                discovery time by{" "}
                <span className="confido-solution-caption-bold">73%</span>.
              </p>
            </div>
          </div>

          {/* Solution #2 */}
          <div className="confido-solution-item">
            <h4 className="confido-solution-item-title" ref={solution2TitleRef}>
              Solution #2: Visual Multi-Tier Flow Builder
            </h4>
            <div
              className="confido-solution-item-content"
              ref={solution2ContentRef}
            >
              <p className="confido-solution-item-description">
                The flow builder transforms from single-step logic to{" "}
                <span className="confido-accent-text">
                  flexible, multi-tier approval chains
                </span>
                .
              </p>
            </div>
            <div className="confido-solution-media">
              <div
                className="confido-solution-video-container"
                ref={solution2VideoRef}
              >
                <video
                  src="/work/confido/sol-2.mp4"
                  className="confido-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="confido-solution-caption" ref={solution2CaptionRef}>
                The visual flow builder prevents workflow breakdowns by making
                complex approval logic{" "}
                <span style={{ fontWeight: 600 }}>
                  transparent and manageable
                </span>
                .
              </p>
            </div>
          </div>

          {/* Solution #3 */}
          <div className="confido-solution-item">
            <h4 className="confido-solution-item-title" ref={solution3TitleRef}>
              Solution #3: Comprehensive Audit Trails
            </h4>
            <div
              className="confido-solution-item-content"
              ref={solution3ContentRef}
            >
              <p className="confido-solution-item-description">
                Every deduction displays{" "}
                <span className="confido-accent-text">complete history</span>{" "}
                with timestamps, actions, and decision context.
              </p>
            </div>
            <div className="confido-solution-media">
              <div
                className="confido-solution-video-container"
                ref={solution3VideoRef}
              >
                <video
                  src="/work/confido/sol-3.mp4"
                  className="confido-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="confido-solution-caption" ref={solution3CaptionRef}>
                Comprehensive audit trails eliminated guesswork by giving
                analysts{" "}
                <span style={{ fontWeight: 600 }}>
                  full context at a glance
                </span>
                .
              </p>
            </div>
          </div>

          {/* Solution #4 */}
          <div className="confido-solution-item">
            <h4 className="confido-solution-item-title" ref={solution4TitleRef}>
              Solution #4: Stopping Endless Cycles
            </h4>
            <div
              className="confido-solution-item-content"
              ref={solution4ContentRef}
            >
              <p className="confido-solution-item-description">
                Users can{" "}
                <span className="confido-accent-text">
                  flag misassigned deductions
                </span>{" "}
                and <span className="confido-accent-text">reroute</span> them.
              </p>
            </div>
            <div className="confido-solution-media">
              <div
                className="confido-solution-video-container"
                ref={solution4VideoRef}
              >
                <video
                  src="/work/confido/sol-4.mp4"
                  className="confido-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="confido-solution-caption" ref={solution4CaptionRef}>
                <span style={{ fontWeight: 600 }}>
                  Clear misassignment handling
                </span>{" "}
                eliminated the confusion that caused 35% of deductions to cycle
                back for multiple reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reflection Section */}
      <section className="confido-reflection-section">
        <div className="confido-reflection-content">
          <h3 className="confido-reflection-title" ref={reflectionTitleRef}>
            REFLECTION
          </h3>
          <div className="confido-reflection-item" ref={reflectionContentRef}>
            <h4 className="confido-reflection-title-text">
              This was my first design role as Confido's only designer, handling
              both product design and development.
            </h4>
            <p className="confido-reflection-description">
              Without design mentorship in an unfamiliar domain (CPG brands) and
              learning Ruby on the fly, I had to define my own pace and trust my
              instincts—a stark shift from structured internships. Collaborating
              directly with engineering and customer success also taught me to
              communicate design decisions effectively and gave me genuine input
              on product direction. This environment proved I could bridge
              design and development while delivering a complete 0→1 overhaul.{" "}
              <span style={{ fontWeight: 600 }}>Thank you Confido!</span>
            </p>
          </div>
        </div>
      </section>

      {/* See Next Section */}
      <section className="confido-see-next-section">
        <div className="confido-see-next-content">
          <h3 className="confido-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div className="confido-see-next-grid" ref={seeNextGridRef}>
            <Link
              to="/moodle"
              className="confido-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="confido-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[0] = el)}
              >
                <div className="confido-see-next-image-container">
                  <video
                    src="/work/moodle/thumbnail.mp4"
                    className="confido-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="confido-see-next-card-title">
                  Moodle: AI-Powered Feline Pain Detection for Cat Owners
                </h4>
                <p className="confido-see-next-card-description">
                  Making clinical-grade pain monitoring accessible to cat owners
                  through intuitive mobile design and privacy-first AI.
                </p>
              </div>
            </Link>
            <Link
              to="/venmo"
              className="confido-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="confido-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="confido-see-next-image-container">
                  <video
                    src="/work/venmo/thumbnail.mp4"
                    className="confido-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="confido-see-next-card-title">
                  Redesigning Venmo's Privacy Model
                </h4>
                <p className="confido-see-next-card-description">
                  Shifting from public-by-default to private-by-default with
                  privacy controls surfaced where users make decisions.
                </p>
              </div>
            </Link>
            <Link
              to="/wholefoods"
              className="confido-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="confido-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[2] = el)}
              >
                <div className="confido-see-next-image-container">
                  <video
                    src="/work/wholefoods/thumbnail.mp4"
                    className="confido-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="confido-see-next-card-title">
                  Improving Whole Foods In-Store Checkout Experience
                </h4>
                <p className="confido-see-next-card-description">
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

export default ConfidoCaseStudy;
