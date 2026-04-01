import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import "./DandiCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const DANDI_FLOWER_IMAGES = [1, 2, 3, 4, 5, 6].map(
  (n) => `/work/dandi/flower${n}.png`,
);

const DANDI_FEATURES = [
  {
    video: "/work/dandi/sol1.mp4",
    title: "Feature #1: Health tracking that feels like self-care",
    headlineLead: "Your garden ",
    headlineHighlight: "reflects your body",
    headlineTrail: ".",
    caption:
      "Heart rate, sleep, glucose, and body temp each visualized as an animated flower that blooms when you're thriving.",
  },
  {
    video: "/work/dandi/sol2.mp4",
    title: "Feature #2: Supplements delivered hands-free",
    headlineLead: "No pills. ",
    headlineHighlight: "No thinking",
    headlineTrail: ".",
    caption:
      "The earring reads your real-time biometrics and automatically micro-doses exactly what your body needs through the skin.",
  },
  {
    video: "/work/dandi/sol3.mp4",
    title: "Feature #3: See your whole health in one place",
    headlineLead: "Everything your body is doing, ",
    headlineHighlight: "at a glance",
    headlineTrail: ".",
    caption:
      "Key biometrics, medication intake, and cycle tracking — designed to feel like a morning check-in, not a medical dashboard.",
  },
  {
    video: "/work/dandi/sol4.mp4",
    title: "Feature #4: You are not alone",
    headlineLead: "Peer supported, ",
    headlineHighlight: "clinically vetted",
    headlineTrail: ".",
    caption:
      'A community forum where every post marked "Reviewed" has been verified by a medical and nutrition advisory team.',
  },
];

const DandiCaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  const contextWhatIsRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactStatementRef = useRef(null);
  const contextImpactPromptRef = useRef(null);
  const contextImpactImageRef = useRef(null);
  const whereWeBeganTitleRef = useRef(null);
  const whereWeBeganText1Ref = useRef(null);
  const whereWeBeganVideoRef = useRef(null);
  const whereWeBeganText2Ref = useRef(null);
  const whereWeBeganText3Ref = useRef(null);
  const whatWeFoundTitleRef = useRef(null);
  const whatWeFoundStatRef = useRef(null);
  const whatWeFoundStatsRef = useRef(null);
  const whatWeFoundBodyRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const visualIdentityRef = useRef(null);
  const physicalComponentRef = useRef(null);
  const featureItemRefs = useRef([]);
  const nextStepsTitleRef = useRef(null);
  const nextStepsItemRef = useRef(null);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemRef = useRef(null);
  const learnMoreTitleRef = useRef(null);
  const learnMoreEmbedRef = useRef(null);
  const learnMoreLinksRef = useRef(null);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

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
    scrollToElement(document.getElementById("solution-section"), {
      duration: 1.2,
    });
  };

  useEffect(() => {
    const scrollTriggers = [];

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
            delay,
          });
        },
      });
      scrollTriggers.push(trigger);
    };

    createScrollAnimation(contextWhatIsRef, 0.08);
    createScrollAnimation(contextMyRoleRef, 0.12);
    createScrollAnimation(contextImpactTitleRef, 0.18);
    createScrollAnimation(contextImpactStatementRef, 0.22);
    createScrollAnimation(contextImpactPromptRef, 0.24);
    createScrollAnimation(contextImpactImageRef, 0.28);
    createScrollAnimation(whereWeBeganTitleRef, 0.06);
    createScrollAnimation(whereWeBeganText1Ref, 0.1);
    createScrollAnimation(whereWeBeganVideoRef, 0.14);
    createScrollAnimation(whereWeBeganText2Ref, 0.18);
    createScrollAnimation(whereWeBeganText3Ref, 0.22);
    createScrollAnimation(whatWeFoundTitleRef, 0.06);
    createScrollAnimation(whatWeFoundStatRef, 0.1);
    createScrollAnimation(whatWeFoundStatsRef, 0.14);
    createScrollAnimation(whatWeFoundBodyRef, 0.18);
    createScrollAnimation(solutionTitleRef, 0.06);
    createScrollAnimation(visualIdentityRef, 0.1);
    createScrollAnimation(physicalComponentRef, 0.14);
    createScrollAnimation(nextStepsTitleRef, 0.06);
    createScrollAnimation(nextStepsItemRef, 0.1);
    createScrollAnimation(takeawaysTitleRef, 0.06);
    createScrollAnimation(takeawaysItemRef, 0.1);
    createScrollAnimation(learnMoreTitleRef, 0.06);
    createScrollAnimation(learnMoreEmbedRef, 0.1);
    createScrollAnimation(learnMoreLinksRef, 0.14);
    createScrollAnimation(seeNextTitleRef, 0.06);

    featureItemRefs.current.forEach((node, index) => {
      if (!node) return;
      gsap.set(node, { opacity: 0, y: 30 });
      const trigger = ScrollTrigger.create({
        trigger: node,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(node, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.06 + index * 0.04,
          });
        },
      });
      scrollTriggers.push(trigger);
    });

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="dandi-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <section className="dandi-hero-section">
        <div className="dandi-hero-image-container dandi-hero-before">
          <img
            src="/work/dandi/hero-before.png"
            alt="Dandi — bio-smart wearable for PCOS"
            className="dandi-hero-image"
          />
        </div>

        <div className="dandi-hero-content">
          <div className="dandi-hero-left">
            <div className="dandi-hero-title-group">
              <p className="dandi-hero-award">
                🏅 Most Impact Winner – FigBuild 2026
              </p>
              <h1 className="dandi-hero-title">
                Dandi: A Bio-Smart Wearable for PCOS
              </h1>
            </div>
            <div className="dandi-hero-details">
              <div className="dandi-hero-detail-item">
                <div className="dandi-hero-detail-label">ROLE</div>
                <div className="dandi-hero-detail-value">Product Designer</div>
              </div>
              <div className="dandi-hero-detail-item">
                <div className="dandi-hero-detail-label">DURATION</div>
                <div className="dandi-hero-detail-value">Mar 6–9, 2026</div>
              </div>
              <div className="dandi-hero-detail-item">
                <div className="dandi-hero-detail-label">TOOLS</div>
                <div className="dandi-hero-detail-value">
                  Figma, Figma Make, React, TypeScript
                </div>
              </div>
            </div>
          </div>

          <div className="dandi-hero-right">
            <p className="dandi-hero-subtitle">
              Making hormonal health accessible for women through
              emotionally-resonant design and real-time biosensing.
            </p>
            <div className="dandi-hero-tags">
              <span className="dandi-hero-tag">Mobile</span>
              <span className="dandi-hero-tag">Wearable</span>
              <span className="dandi-hero-tag">Women&apos;s Health</span>
            </div>
            <button
              type="button"
              className="dandi-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="dandi-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="dandi-skip-arrow"
                  aria-hidden
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
              <span className="dandi-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        <div className="dandi-hero-image-container dandi-hero-after">
          <img
            src="/work/dandi/hero-after.png"
            alt="Dandi — bio-smart wearable for PCOS"
            className="dandi-hero-image"
          />
        </div>
      </section>

      <section
        className="dandi-context-section"
        aria-labelledby="dandi-context-heading"
      >
        <div className="dandi-context-content">
          <div className="dandi-context-top">
            <div className="dandi-context-item" ref={contextWhatIsRef}>
              <h3 id="dandi-context-heading" className="dandi-context-title">
                What is Dandi?
              </h3>
              <p className="dandi-context-description">
                Dandi is a speculative bio-smart ear cuff and companion app that
                makes the invisible signals of Polycystic Ovary Syndrome (PCOS)
                visible — continuously tracking hormones, glucose, and sleep in
                real time, and translating them into clear patterns and
                actionable insights.
              </p>
            </div>
            <div className="dandi-context-item" ref={contextMyRoleRef}>
              <h3 className="dandi-context-title">My Role</h3>
              <p className="dandi-context-description">
                As part of a four-person team, I contributed to ideation and
                problem research, then led the design and development of the
                Insights page — iterating from lo-fi wireframes through hi-fi
                design to a coded prototype in React. I also helped put together
                the cross-feature prototype with Figma Make and code.
              </p>
            </div>
          </div>

          <div className="dandi-context-impact">
            <h3 className="dandi-impact-title" ref={contextImpactTitleRef}>
              Context
            </h3>
            <p
              className="dandi-context-impact-statement"
              ref={contextImpactStatementRef}
            >
              Dandi won <span className="dandi-accent-text">Most Impact</span>{" "}
              at{" "}
              <a
                href="https://figbuild2026.devpost.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dandi-context-impact-link"
              >
                FigBuild 2026
              </a>{" "}
              — Figma for Edu&apos;s annual student design competition — out of{" "}
              <span className="dandi-accent-text">688</span> submissions from{" "}
              <span className="dandi-accent-text">2,100+</span> students across
              the US, Canada, India, and Australia.
            </p>
            <p
              className="dandi-context-impact-prompt"
              ref={contextImpactPromptRef}
            >
              This year, FigBuild 2026 asked teams to design a speculative tool
              that tracks and influences something intangible about the human
              sensory experience, supporting wellness or behavioral change.
            </p>
            <div
              className="dandi-context-impact-image-container"
              ref={contextImpactImageRef}
            >
              <img
                src="/work/dandi/impact.png"
                alt="FigBuild 2026 Most Impact award for Dandi"
                className="dandi-context-impact-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="dandi-where-we-began-section"
        aria-labelledby="dandi-where-we-began-heading"
      >
        <div className="dandi-where-we-began-content">
          <h2
            id="dandi-where-we-began-heading"
            className="dandi-impact-title dandi-where-we-began-heading"
            ref={whereWeBeganTitleRef}
          >
            Where We Began
          </h2>
          <p
            className="dandi-where-we-began-body dandi-where-we-began-body--above-video"
            ref={whereWeBeganText1Ref}
          >
            She had always had irregular periods, stubborn acne, and a gut
            feeling something was wrong. For years she assumed,{" "}
            <span className="dandi-accent-text">
              &ldquo;This is just how my body is.&rdquo;
            </span>
          </p>
          <div
            className="dandi-where-we-began-video-wrap"
            ref={whereWeBeganVideoRef}
          >
            <video
              className="dandi-where-we-began-video"
              src="/work/dandi/jitter.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Ambient motion for the origin story"
            />
          </div>
          <p
            className="dandi-where-we-began-body dandi-where-we-began-body--below-video"
            ref={whereWeBeganText2Ref}
          >
            It wasn&apos;t until a routine checkup that a doctor mentioned PCOS
            almost in passing, but she still had{" "}
            <span className="dandi-accent-text">
              no real understanding of what it meant or why she had been feeling
              this way her whole life.
            </span>
          </p>
          <p
            className="dandi-where-we-began-body dandi-where-we-began-body--closing"
            ref={whereWeBeganText3Ref}
          >
            This story belonged to someone close to our team — and it became the
            foundation of Dandi.
          </p>
        </div>
      </section>

      <section
        className="dandi-what-we-found-section"
        aria-labelledby="dandi-what-we-found-heading"
      >
        <div className="dandi-what-we-found-content">
          <h2
            id="dandi-what-we-found-heading"
            className="dandi-impact-title"
            ref={whatWeFoundTitleRef}
          >
            What We Found
          </h2>
          <div
            className="dandi-what-we-found-statement-content"
            ref={whatWeFoundStatRef}
          >
            <p className="dandi-what-we-found-text">
              As of 2021, there are approximately{" "}
              <span className="dandi-accent-text">65.77 million</span> women
              worldwide living with PCOS.
            </p>
          </div>
          <div className="dandi-what-we-found-stats" ref={whatWeFoundStatsRef}>
            <figure className="dandi-what-we-found-stat dandi-what-we-found-stat--image-left">
              <div className="dandi-what-we-found-stat-media">
                <img
                  src="/work/dandi/stat-1.png"
                  alt="Illustration for diagnostic delay among women with PCOS"
                  className="dandi-what-we-found-stat-image"
                  loading="lazy"
                />
              </div>
              <figcaption className="dandi-what-we-found-stat-copy">
                <p className="dandi-what-we-found-stat-lead">Yet,</p>
                <p className="dandi-stat-metric-line">
                  <span className="dandi-stat-metric">1 in 2</span>
                </p>
                <p className="dandi-what-we-found-stat-body">
                  women see 3+ doctors before receiving a diagnosis,
                </p>
              </figcaption>
            </figure>
            <figure className="dandi-what-we-found-stat dandi-what-we-found-stat--text-left">
              <div className="dandi-what-we-found-stat-media">
                <img
                  src="/work/dandi/stat-2.png"
                  alt="Illustration for undiagnosed insulin resistance in PCOS"
                  className="dandi-what-we-found-stat-image"
                  loading="lazy"
                />
              </div>
              <figcaption className="dandi-what-we-found-stat-copy">
                <p className="dandi-what-we-found-stat-lead">and</p>
                <p className="dandi-stat-metric-line">
                  <span className="dandi-stat-metric">70%</span>
                </p>
                <p className="dandi-what-we-found-stat-body">
                  have insulin resistance without even knowing it.
                </p>
              </figcaption>
            </figure>
          </div>
          <p
            className="dandi-context-description dandi-what-we-found-lede"
            ref={whatWeFoundBodyRef}
          >
            The body of a person with PCOS is constantly sending signals. The
            problem is that{" "}
            <span className="dandi-accent-text">
              no tool has ever existed to read them.
            </span>
          </p>
        </div>
      </section>

      <section
        id="solution-section"
        className="dandi-solution-section"
        aria-labelledby="dandi-solution-heading"
      >
        <div className="dandi-solution-content">
          <h3
            id="dandi-solution-heading"
            className="dandi-solution-title"
            ref={solutionTitleRef}
          >
            SOLUTION
          </h3>

          <div
            className="dandi-visual-identity-overview"
            ref={visualIdentityRef}
          >
            <h4 className="dandi-visual-identity-subtitle">Visual Identity</h4>
            <p className="dandi-visual-identity-description">
              Dandi&apos;s visual identity uses an earthy palette of forest
              greens, warm creams, and coral pinks with hand-drawn floral motifs
              — designed to feel like self-care, not a doctor&apos;s office.
            </p>
            <div className="dandi-visual-identity-flowers">
              {DANDI_FLOWER_IMAGES.map((src, index) => (
                <div
                  key={src}
                  className="dandi-visual-identity-flower-wrap"
                  tabIndex={0}
                >
                  <img
                    src={src}
                    alt={`Hand-drawn floral motif ${index + 1} of 6`}
                    className="dandi-visual-identity-flower"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="dandi-physical-component" ref={physicalComponentRef}>
            <h4 className="dandi-visual-identity-subtitle">The Ear Cuff</h4>
            <p className="dandi-visual-identity-description">
              We designed Dandi as a wearable ear cuff so it could be
              fashionable enough to wear without a second thought, discreet
              enough to never signal a medical condition, and functional enough
              to deliver supplements directly into the bloodstream without any
              effort from the user.
            </p>
            <div className="dandi-physical-component-image-container">
              <img
                src="/work/dandi/ear-cuff.png"
                alt="Dandi wearable ear cuff concept"
                className="dandi-physical-component-image"
                loading="lazy"
              />
            </div>
          </div>

          {DANDI_FEATURES.map((feature, index) => (
            <div
              key={feature.video}
              className="dandi-feature-item"
              ref={(el) => {
                featureItemRefs.current[index] = el;
              }}
            >
              <h4 className="dandi-feature-item-title">{feature.title}</h4>
              <div className="dandi-feature-item-content">
                <p className="dandi-feature-item-headline">
                  {feature.headlineLead}
                  <span className="dandi-accent-text">
                    {feature.headlineHighlight}
                  </span>
                  {feature.headlineTrail}
                </p>
              </div>
              <div className="dandi-feature-media">
                <div className="dandi-feature-video-container">
                  <video
                    className="dandi-feature-video"
                    src={feature.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p className="dandi-feature-caption">{feature.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="dandi-next-steps-section">
        <div className="dandi-next-steps-content">
          <h3 className="dandi-solution-title" ref={nextStepsTitleRef}>
            WHAT&apos;S NEXT FOR DANDI
          </h3>
          <div className="dandi-next-steps-item" ref={nextStepsItemRef}>
            <h4 className="dandi-next-steps-title-text">
              Validate, expand, and scale.
            </h4>
            <p className="dandi-next-steps-description">
              The immediate next step is clinical validation — partnering with
              endocrinologists to test whether signal-based cycle prediction
              outperforms existing apps for irregular cycles. From there, we
              want to run a pilot with diagnosed PCOS patients and eventually
              expand Dandi&apos;s model to other conditions where the body
              signals continuously but the patient can&apos;t decode it:
              endometriosis, thyroid disorders, and perimenopause.
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaway Section */}
      <section className="dandi-takeaways-section">
        <div className="dandi-takeaways-content">
          <h3 className="dandi-solution-title" ref={takeawaysTitleRef}>
            KEY TAKEAWAY
          </h3>
          <div className="dandi-takeaways-item" ref={takeawaysItemRef}>
            <h4 className="dandi-takeaways-title-text">
              Data means nothing without clarity.
            </h4>
            <p className="dandi-takeaways-description">
              The hardest part wasn't collecting the biometrics — it was making
              them understandable. I learned that plain language and emotional
              design matter just as much as the technical architecture itself.
            </p>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="dandi-learn-more-section">
        <div className="dandi-learn-more-content">
          <div className="dandi-solution-learn-more">
            <h4
              className="dandi-feature-item-title dandi-solution-learn-more-title"
              ref={learnMoreTitleRef}
            >
              Learn More About Dandi
            </h4>
            <div
              className="dandi-solution-demo-embed"
              aria-label="Dandi demo video"
              ref={learnMoreEmbedRef}
            >
              <iframe
                src="https://www.youtube.com/embed/ARy32Mv2iKg"
                title="Dandi demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div
              className="dandi-solution-links"
              role="navigation"
              aria-label="Project links"
              ref={learnMoreLinksRef}
            >
              <a
                href="https://devpost.com/software/dandi-iczt68"
                className="dandi-solution-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="dandi-solution-link-icon-wrap"
                  aria-hidden="true"
                >
                  <img
                    src="/work/dandi/icon.png"
                    alt=""
                    className="dandi-solution-link-icon"
                  />
                </span>
                <span className="dandi-solution-link-label">Devpost</span>
              </a>
              <a
                href="https://figbuild-2026-dandi.vercel.app"
                className="dandi-solution-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="dandi-solution-link-icon-wrap"
                  aria-hidden="true"
                >
                  <img
                    src="/work/dandi/icon.png"
                    alt=""
                    className="dandi-solution-link-icon"
                  />
                </span>
                <span className="dandi-solution-link-label">Prototype</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="dandi-see-next-section">
        <div className="dandi-see-next-content">
          <h3 className="dandi-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div className="dandi-see-next-grid" ref={seeNextGridRef}>
            <Link
              to="/confido"
              className="dandi-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="dandi-see-next-card"
                ref={(el) => {
                  seeNextCardsRefs.current[0] = el;
                }}
              >
                <div className="dandi-see-next-image-container">
                  <video
                    src="/work/confido/thumbnail.mp4"
                    className="dandi-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="dandi-see-next-card-title">
                  Rebuilding Confido&apos;s Approval Flow
                </h4>
                <p className="dandi-see-next-card-description">
                  Redesigning approval workflows with smarter logic and clearer
                  audit trails for improved enterprise usability.
                </p>
              </div>
            </Link>
            <Link
              to="/moodle"
              className="dandi-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="dandi-see-next-card"
                ref={(el) => {
                  seeNextCardsRefs.current[1] = el;
                }}
              >
                <div className="dandi-see-next-image-container">
                  <video
                    src="/work/moodle/thumbnail.mp4"
                    className="dandi-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="dandi-see-next-card-title">
                  Moodle: AI-Powered Feline Pain Detection for Cat Owners
                </h4>
                <p className="dandi-see-next-card-description">
                  Making clinical-grade pain monitoring accessible to cat owners
                  through intuitive mobile design and privacy-first AI.
                </p>
              </div>
            </Link>
            <Link
              to="/venmo"
              className="dandi-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="dandi-see-next-card"
                ref={(el) => {
                  seeNextCardsRefs.current[2] = el;
                }}
              >
                <div className="dandi-see-next-image-container">
                  <video
                    src="/work/venmo/thumbnail.mp4"
                    className="dandi-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="dandi-see-next-card-title">
                  Redesigning Venmo&apos;s Privacy Controls
                </h4>
                <p className="dandi-see-next-card-description">
                  Transforming Venmo&apos;s public-by-default privacy model to
                  help users make informed choices without confusion.
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

export default DandiCaseStudy;
