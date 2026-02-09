import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import "./FilterPills.css";

const FilterPills = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "case-study", label: "Case Studies" },
    { id: "digital", label: "Digital" },
    { id: "physical", label: "Physical" },
  ];

  const pillRefs = useRef([]);
  const circleRefs = useRef([]);
  const timelineRefs = useRef([]);

  // Set up animation for each pill (matching See All Work button)
  useLayoutEffect(() => {
    const setupAnimations = () => {
      pillRefs.current.forEach((pill, index) => {
        if (!pill) return;
        const circle = circleRefs.current[index];
        if (!circle) return;

        const isActive = activeFilter === filters[index].id;

        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        // Kill existing timeline and any active tweens first
        timelineRefs.current[index]?.kill();
        if (circle) gsap.killTweensOf(circle);
        if (label) gsap.killTweensOf(label);
        if (white) gsap.killTweensOf(white);

        // Reset animation state - always start from default state
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        // Only create timeline for non-active pills
        if (!isActive) {
          const tl = gsap.timeline({ paused: true });

          tl.to(
            circle,
            {
              scale: 1.2,
              xPercent: -50,
              duration: 2,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );

          if (label) {
            tl.to(
              label,
              {
                y: -(h + 8),
                duration: 2,
                ease: "power3.easeOut",
                overwrite: "auto",
              },
              0
            );
          }

          if (white) {
            tl.to(
              white,
              {
                y: 0,
                opacity: 1,
                duration: 2,
                ease: "power3.easeOut",
                overwrite: "auto",
              },
              0
            );
          }

          timelineRefs.current[index] = tl;
        } else {
          // Active pill - no timeline, ensure it's in default state
          timelineRefs.current[index] = null;
        }
      });
    };

    setupAnimations();

    const onResize = () => setupAnimations();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(setupAnimations).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", onResize);
      timelineRefs.current.forEach((tl) => tl?.kill());
    };
  }, [activeFilter]);

  const handleEnter = (index) => {
    const isActive = activeFilter === filters[index].id;
    if (isActive) return;
    
    const tl = timelineRefs.current[index];
    if (!tl) return;
    tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (index) => {
    const isActive = activeFilter === filters[index].id;
    if (isActive) return;
    
    const tl = timelineRefs.current[index];
    if (!tl) return;
    // Always revert to 0 (default state) when mouse leaves
    tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  return (
    <div className="filter-pills-container">
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            ref={(el) => {
              pillRefs.current[index] = el;
            }}
            className={`filter-pill pill ${isActive ? "active" : ""}`}
            onClick={() => !isActive && onFilterChange(filter.id)}
            disabled={isActive}
            aria-pressed={isActive}
            onMouseEnter={() => !isActive && handleEnter(index)}
            onMouseLeave={() => !isActive && handleLeave(index)}
          >
            <span
              className="hover-circle"
              aria-hidden="true"
              ref={(el) => {
                circleRefs.current[index] = el;
              }}
            />
            <span className="label-stack">
              <span className="pill-label">{filter.label}</span>
              <span className="pill-label-hover" aria-hidden="true">
                {filter.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
