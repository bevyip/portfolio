import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WorkBentoItem.css";

const WorkBentoItem = ({ project, gridPosition, onHoverChange }) => {
  const videoRef = useRef(null);
  // Set CSS custom properties for grid positioning
  const gridStyle = gridPosition
    ? {
        "--grid-col": gridPosition.col,
        "--grid-row-start": gridPosition.rowStart,
        "--grid-row-end": gridPosition.rowEnd,
      }
    : {};

  // Determine if project is clickable
  const isClickable =
    project.id === "venmo-privacy-controls" ||
    project.id === "moodle-pain-detection" ||
    project.id === "whole-foods-checkout" ||
    project.id === "confido-approval-flow";

  const routeMap = {
    "venmo-privacy-controls": "/venmo",
    "moodle-pain-detection": "/moodle",
    "whole-foods-checkout": "/wholefoods",
    "confido-approval-flow": "/confido",
  };

  const CardContent = (
    <>
      <img
        src="/label.png"
        alt="Featured project"
        className="work-bento-label"
      />
      <div className="work-bento-image-container">
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            className="work-bento-image"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            controls={false}
            aria-label={project.title}
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="work-bento-image"
            loading="lazy"
          />
        )}
      </div>
      <div className="work-bento-content">
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

  const handleMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverChange?.(false);
  };

  // Lazy load video when it comes into viewport
  useEffect(() => {
    if (!videoRef.current || !project.video) return;

    const video = videoRef.current;
    const isMobile = window.innerWidth <= 768;
    const rootMargin = isMobile ? "100px" : "200px"; // Load earlier on desktop

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load and play video when visible
            video.load();
            video.play().catch(() => {
              // Autoplay may fail, that's okay
            });
            observer.unobserve(video);
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [project.video]);

  const cardClassName = "work-bento-item group relative overflow-hidden rounded-lg bg-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out h-full min-h-[200px] min-[1026px]:row-span-2 flex flex-col";

  if (isClickable) {
    return (
      <Link
        to={routeMap[project.id]}
        className={cardClassName}
        style={gridStyle}
        data-project-id={project.id}
        data-grid-col={gridPosition?.col}
        data-grid-row-start={gridPosition?.rowStart}
        data-grid-row-end={gridPosition?.rowEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div
      className={cardClassName}
      style={gridStyle}
      data-project-id={project.id}
      data-grid-col={gridPosition?.col}
      data-grid-row-start={gridPosition?.rowStart}
      data-grid-row-end={gridPosition?.rowEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {CardContent}
    </div>
  );
};

export default WorkBentoItem;
