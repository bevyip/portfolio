import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../../data/experiences";

import TimelineItem from "./TimelineItem";
import ExperienceArrow from "../Arrows/ExperienceArrow/ExperienceArrow";
import AwardsGrid from "../AwardsGrid/AwardsGrid";
import { useLetterByLetterAnimation } from "../../hooks/useLetterByLetterAnimation";
import "./ExperienceTimeline.css";

gsap.registerPlugin(ScrollTrigger);

const ExperienceTimeline = () => {
  const titleRef = useRef(null);
  const arrowRef = useRef(null);
  const headerRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const timelineItemRefs = useRef([]);

  // Animate "Where I've been" text letter-by-letter on scroll
  useLetterByLetterAnimation({
    titleRef,
    triggerRef: headerRef,
    start: "top 90%",
    end: "top 60%",
    scrub: 2,
    colorRanges: [
      { start: 6, end: Infinity, color: "#7DD3FC" }, // "I've been" starts after "Where " (6 characters)
    ],
    fontWeightRanges: [
      { start: 0, end: 5, fontWeight: "700" }, // "Where " (first 6 characters including space)
      { start: 6, end: Infinity, fontWeight: "500" }, // "I've been" starts after "Where " (6 characters)
    ],
  });

  // Animate ExperienceArrow path drawing in one scroll
  useEffect(() => {
    if (!arrowRef.current || !headerRef.current) return;

    let scrollTrigger;

    // Use a small delay to ensure SVG is fully rendered
    const timeoutId = setTimeout(() => {
      const svg = arrowRef.current.querySelector("svg");
      if (!svg) return;

      // Select the main curved path (not the marker's internal path)
      const path = svg.querySelector("#experience-arrow-path");
      if (!path) return;

      // Get the total length of the path
      const pathLength = path.getTotalLength();
      if (!pathLength || pathLength === 0) return;

      // Set up the initial state - hide the path initially
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0, // Hide path completely until animation starts
      });

      // Hide marker initially
      const marker = svg.querySelector("#arrow-left path");
      if (marker) {
        gsap.set(marker, {
          opacity: 0,
        });
      }

      // Force a refresh to ensure start/end positions are accurate
      ScrollTrigger.refresh();

      // Animate the path drawing - use the header as trigger (same as text animation)
      scrollTrigger = ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 90%",
        end: "top 60%",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update path drawing based on scroll progress
          gsap.set(path, {
            strokeDashoffset: pathLength * (1 - progress),
            opacity: progress > 0 ? 1 : 0, // Show path when animation starts
          });

          // Show arrowhead marker only when line is nearly complete (90% drawn)
          if (marker) {
            gsap.set(marker, {
              opacity: progress >= 0.9 ? 1 : 0, // Show marker when 90% complete
            });
          }
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, []);

  // Animate timeline items one by one from bottom to top, chained from title animation
  useEffect(() => {
    if (!timelineContainerRef.current || !headerRef.current) return;

    let timeline;

    // Wait a bit to ensure refs are populated
    const timeoutId = setTimeout(() => {
      // Filter out null refs
      const validRefs = timelineItemRefs.current.filter((ref) => ref !== null);
      if (validRefs.length === 0) return;

      // Set initial state for all items
      validRefs.forEach((itemRef) => {
        gsap.set(itemRef, {
          opacity: 0,
          y: 30,
        });
      });

      // Force ScrollTrigger refresh to ensure accurate positioning
      ScrollTrigger.refresh();

      // Create a single timeline that starts exactly when title ends (at "top 60%")
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 60%", // Start exactly when title ends (not "top 55%")
          end: "top 2%", // End when header is near the top (adjust for desired scroll distance)
          scrub: 1,
        },
      });

      // Add staggered animations to timeline - items appear one by one from top to bottom
      // Calculate total duration based on number of items
      const staggerDelay = 30; // Large delay between each item starting
      const itemDuration = 10; // Long duration for each item animation

      // Animate items in order (first item first, then second, etc.)
      validRefs.forEach((itemRef, index) => {
        const startTime = index * staggerDelay;
        timeline.to(
          itemRef,
          {
            opacity: 1,
            y: 0,
            duration: itemDuration,
            ease: "ease-out",
          },
          startTime // Position in timeline based on stagger
        );
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (timeline) {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      }
    };
  }, [experiences.length]); // Re-run if experiences change

  return (
    <section
      id="experience-timeline-section"
      className="experience-timeline-section"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <header ref={headerRef} className="md:mb-16">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <h2 ref={titleRef} className="experience-timeline-title">
              <span className="experience-timeline-title-where">Where</span>{" "}
              <span className="experience-timeline-title-ivebeen">
                I've been
              </span>
            </h2>
            {/* 
              The Arrow component:
              Shifted slightly up using negative margin to align its 'pointing tip' 
              with the baseline of the text it's targeting.
            */}
            <div ref={arrowRef} className="flex items-center -mt-6 md:-mt-12">
              <ExperienceArrow />
            </div>
          </div>
        </header>

        {/* 
          Timeline Grid: 
          - Column 1: Width determined by the longest date.
          - Column 2: 1px for the vertical line.
          - Column 3: Main content.
          - gap-x-10 (40px) for balanced spacing.
        */}
        <div
          ref={timelineContainerRef}
          className="grid grid-cols-1 md:grid-cols-[max-content_1px_1fr] md:gap-x-10"
        >
          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp.id}
              experience={exp}
              ref={(el) => {
                timelineItemRefs.current[index] = el;
              }}
            />
          ))}
        </div>

        {/* Awards and Certifications Grid */}
        <AwardsGrid />
      </div>
    </section>
  );
};

export default ExperienceTimeline;
