import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLetterByLetterAnimation } from "../../hooks/useLetterByLetterAnimation";
import "./WorkSection.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "moodle-pain-detection",
    title: "Moodle: AI-Powered Feline Pain Detection for Cat Owners",
    role: "Product Designer",
    tags: ["Mobile", "UX/UI", "User Research", "AI/ML"],
    summary:
      "Making clinical-grade pain monitoring accessible to cat owners through intuitive mobile design and privacy-first AI.",
    video: "/work/moodle/thumbnail.mp4",
  },
  {
    id: "confido-approval-flow",
    title: "Rebuilding Confido's Approval Flow",
    role: "Product Designer & Developer",
    tags: ["Web", "UX/UI", "Design Systems", "Enterprise Software"],
    summary:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail.mp4",
  },
  {
    id: "venmo-privacy-controls",
    title: "Redesigning Venmo's Privacy Controls",
    role: "Product Designer",
    tags: ["Mobile", "UX/UI", "User Research", "FinTech"],
    summary:
      "Transforming Venmo's public-by-default privacy model to help users make informed choices without confusion.",
    video: "/work/venmo/thumbnail.mp4",
  },
  {
    id: "whole-foods-checkout",
    title: "Improving Whole Foods In-Store Checkout Experience",
    role: "Product Designer",
    tags: ["Mobile", "UX/UI", "User Research", "Retail Tech"],
    summary:
      "Surfacing a hidden checkout feature for an improved in-store experience by aligning interface design with user mental models.",
    video: "/work/wholefoods/thumbnail.mp4",
  },
];

const WorkSection = () => {
  const titleRef = useRef(null);
  const projectsGridRef = useRef(null);
  const projectCardRefs = useRef([]);
  const videoRefs = useRef([]);

  useLetterByLetterAnimation({
    titleRef,
    triggerRef: titleRef,
    start: "top 70%",
    end: "top 50%",
    scrub: 1.5,
    colorRanges: [{ start: 0, end: 7, color: "#7DD3FC" }],
  });

  // Ensure videos autoplay on mobile by programmatically playing them
  useEffect(() => {
    const validVideoRefs = videoRefs.current.filter((ref) => ref !== null);
    const cleanupFunctions = [];

    validVideoRefs.forEach((videoRef) => {
      if (videoRef) {
        // Force play on load to ensure autoplay works on mobile
        const handleCanPlay = () => {
          videoRef.play().catch((error) => {
            // Silently handle autoplay errors (some browsers may block autoplay)
            console.debug("Video autoplay prevented:", error);
          });
        };

        videoRef.addEventListener("canplay", handleCanPlay);
        cleanupFunctions.push(() => {
          videoRef.removeEventListener("canplay", handleCanPlay);
        });

        // Also try to play immediately if video is already loaded
        if (videoRef.readyState >= 3) {
          videoRef.play().catch(() => {});
        }
      }
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [projects.length]);

  // Animate project cards with lazy loading - fade up when in view
  useEffect(() => {
    if (!projectsGridRef.current) return;

    const validRefs = projectCardRefs.current.filter((ref) => ref !== null);
    if (validRefs.length === 0) return;

    const scrollTriggers = [];

    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();

      validRefs.forEach((cardRef) => {
        // Set initial state for each card
        gsap.set(cardRef, {
          opacity: 0,
          y: 40,
        });

        // Create individual timeline for each card
        const tl = gsap.timeline({ paused: true });
        tl.to(cardRef, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            // Clear GSAP's inline transform so CSS hover can work
            gsap.set(cardRef, { clearProps: "transform" });
          },
        });

        // Create ScrollTrigger that fires once when card enters view
        const scrollTrigger = ScrollTrigger.create({
          trigger: cardRef,
          start: "top 60%",
          once: true,
          onEnter: () => {
            tl.play();
          },
        });

        scrollTriggers.push(scrollTrigger);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      scrollTriggers.forEach((st) => st.kill());
    };
  }, [projects.length]);

  return (
    <section id="work" className="work-section">
      <div className="work-section-content">
        <h2 ref={titleRef} className="work-section-title">
          Featured Work
        </h2>
        <div ref={projectsGridRef} className="projects-grid">
          {projects.map((project, index) => {
            const CardContent = (
              <>
                <div className="project-image-container">
                  {project.video ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={project.video}
                      className="project-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      controls={false}
                      aria-label={project.title}
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-image"
                    />
                  )}
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-role">{project.role}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="project-summary">{project.summary}</p>
                </div>
              </>
            );

            // Make Venmo, Moodle, Whole Foods, and Confido projects clickable
            if (project.id === "venmo-privacy-controls") {
              return (
                <Link
                  key={project.id}
                  to="/venmo"
                  className="project-card-link"
                >
                  <div
                    className="project-card"
                    ref={(el) => {
                      projectCardRefs.current[index] = el;
                    }}
                  >
                    {CardContent}
                  </div>
                </Link>
              );
            }

            if (project.id === "moodle-pain-detection") {
              return (
                <Link
                  key={project.id}
                  to="/moodle"
                  className="project-card-link"
                >
                  <div
                    className="project-card"
                    ref={(el) => {
                      projectCardRefs.current[index] = el;
                    }}
                  >
                    {CardContent}
                  </div>
                </Link>
              );
            }

            if (project.id === "whole-foods-checkout") {
              return (
                <Link
                  key={project.id}
                  to="/wholefoods"
                  className="project-card-link"
                >
                  <div
                    className="project-card"
                    ref={(el) => {
                      projectCardRefs.current[index] = el;
                    }}
                  >
                    {CardContent}
                  </div>
                </Link>
              );
            }

            if (project.id === "confido-approval-flow") {
              return (
                <Link
                  key={project.id}
                  to="/confido"
                  className="project-card-link"
                >
                  <div
                    className="project-card"
                    ref={(el) => {
                      projectCardRefs.current[index] = el;
                    }}
                  >
                    {CardContent}
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={project.id}
                className="project-card"
                ref={(el) => {
                  projectCardRefs.current[index] = el;
                }}
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
