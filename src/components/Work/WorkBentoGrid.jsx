import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CursorPill from "../CursorPill/CursorPill";
import "./WorkBentoGrid.css";
import "./WorkBentoItem.css";

// Work projects data (4 case studies only)
// thumbnailImage: used as thumbnail in mobile view instead of video
const workProjects = [
  {
    id: "confido-approval-flow",
    title: "Rebuilding Confido's Approval Flow",
    role: "Product Designer & Developer",
    tags: ["Web", "Design Systems", "Enterprise Software"],
    summary:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail.mp4",
    thumbnailImage: "/work/confido/thumbnail-frame.jpg",
    category: "case-study",
  },
  {
    id: "moodle-pain-detection",
    title: "Moodle: AI-Powered Feline Pain Detection for Cat Owners",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "AI/ML"],
    summary:
      "Making clinical-grade pain monitoring accessible to cat owners through intuitive mobile design and privacy-first AI.",
    video: "/work/moodle/thumbnail.mp4",
    thumbnailImage: "/work/moodle/thumbnail-frame.jpg",
    category: "case-study",
  },
  {
    id: "venmo-privacy-controls",
    title: "Redesigning Venmo's Privacy Controls",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "FinTech"],
    summary:
      "Transforming Venmo's public-by-default privacy model to help users make informed choices without confusion.",
    video: "/work/venmo/thumbnail1.mp4",
    thumbnailImage: "/work/venmo/thumbnail-frame.jpg",
    category: "case-study",
  },
  {
    id: "whole-foods-checkout",
    title: "Improving Whole Foods In-Store Checkout Experience",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "Retail Tech"],
    summary:
      "Surfacing a hidden checkout feature for an improved in-store experience by aligning interface design with user mental models.",
    video: "/work/wholefoods/thumbnail.mp4",
    thumbnailImage: "/work/wholefoods/thumbnail-frame.jpg",
    category: "case-study",
  },
];

const routeMap = {
  "venmo-privacy-controls": "/venmo",
  "moodle-pain-detection": "/moodle",
  "whole-foods-checkout": "/wholefoods",
  "confido-approval-flow": "/confido",
};

/** Single work card (same visuals as before, inlined from WorkBentoItem) */
function WorkCard({ project, onHoverChange, onVideoReady }) {
  const videoRef = useRef(null);
  const readyFired = useRef(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVideoReady = () => {
    if (readyFired.current) return;
    readyFired.current = true;
    onVideoReady?.();
  };

  const isClickable =
    project.id === "venmo-privacy-controls" ||
    project.id === "moodle-pain-detection" ||
    project.id === "whole-foods-checkout" ||
    project.id === "confido-approval-flow";

  const videoSource = project.video;
  const useThumbnailImage = isMobile && project.thumbnailImage;

  useEffect(() => {
    if (useThumbnailImage) {
      handleVideoReady();
    }
  }, [useThumbnailImage]);

  useEffect(() => {
    if (useThumbnailImage || !videoRef.current || !videoSource) return;
    const video = videoRef.current;
    const rootMargin = isMobile ? "100px" : "200px";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.load();
            video.play().catch(() => {});
            observer.unobserve(video);
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoSource, useThumbnailImage, isMobile]);

  const cardClassName =
    "work-bento-item group relative overflow-hidden rounded-[8px] bg-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out h-full min-h-[200px] flex flex-col case-study-card";

  const content = (
    <>
      <div className="work-bento-image-container">
        {useThumbnailImage ? (
          <img
            src={project.thumbnailImage}
            alt={project.title}
            className="work-bento-image"
            loading="lazy"
          />
        ) : videoSource ? (
          <video
            ref={videoRef}
            src={videoSource}
            className="work-bento-image"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            controls={false}
            aria-label={project.title}
            onCanPlay={handleVideoReady}
            onLoadedData={handleVideoReady}
          />
        ) : (
          project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="work-bento-image"
              loading="lazy"
            />
          )
        )}
      </div>
      <div className="work-bento-content case-study-visible">
        <h3 className="work-bento-title">{project.title}</h3>
        <p className="work-bento-role">{project.role}</p>
        <div className="work-bento-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="work-bento-tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="work-bento-summary">{project.summary}</p>
      </div>
    </>
  );

  const hoverProps = {
    onMouseEnter: () => onHoverChange?.(true),
    onMouseLeave: () => onHoverChange?.(false),
  };

  if (isClickable) {
    return (
      <Link
        to={routeMap[project.id]}
        className={cardClassName}
        data-project-id={project.id}
        {...hoverProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName} data-project-id={project.id} {...hoverProps}>
      {content}
    </div>
  );
}

/**
 * Simple 2x2 grid (full width) or single column on small devices.
 * Renders the 4 case study cards only. No filters, no play projects.
 */
const WorkBentoGrid = ({
  onHoverChange,
  isHoveringWorkCard: controlledHover,
  gridClassName = "work-bento-grid",
  containerRef,
  onReady,
}) => {
  const [localHover, setLocalHover] = useState(false);
  const isHovering = controlledHover !== undefined ? controlledHover : localHover;
  const handleHover = (hovered) => (onHoverChange ?? setLocalHover)(hovered);

  const readyCountRef = useRef(0);
  const readyCalledRef = useRef(false);

  const fireReady = useCallback(() => {
    if (readyCalledRef.current) return;
    readyCalledRef.current = true;
    onReady?.();
  }, [onReady]);

  const handleVideoReady = useCallback(() => {
    readyCountRef.current += 1;
    if (readyCountRef.current >= workProjects.length) {
      fireReady();
    }
  }, [fireReady]);

  useEffect(() => {
    if (!onReady) return;
    const fallback = setTimeout(fireReady, 3000);
    return () => clearTimeout(fallback);
  }, [onReady, fireReady]);

  return (
    <div ref={containerRef} className={gridClassName} aria-label="Case studies">
      <CursorPill isHovering={isHovering} text="View case study" />
      {workProjects.map((project) => (
        <WorkCard
          key={project.id}
          project={project}
          onHoverChange={handleHover}
          onVideoReady={handleVideoReady}
        />
      ))}
    </div>
  );
};

export default WorkBentoGrid;
