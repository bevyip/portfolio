import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BentoItem from "../Play/BentoItem";
import WorkBentoItem from "./WorkBentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";
import FilterPills from "./FilterPills";

// Work projects data
const workProjects = [
  {
    id: "confido-approval-flow",
    title: "Rebuilding Confido's Approval Flow",
    role: "Product Designer & Developer",
    tags: ["Web", "Design Systems", "Enterprise Software"],
    summary:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail1.mp4",
    category: "case-study",
  },
  {
    id: "moodle-pain-detection",
    title: "Moodle: AI-Powered Feline Pain Detection for Cat Owners",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "AI/ML"],
    summary:
      "Making clinical-grade pain monitoring accessible to cat owners through intuitive mobile design and privacy-first AI.",
    video: "/work/moodle/thumbnail1.mp4",
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
    category: "case-study",
  },
  {
    id: "whole-foods-checkout",
    title: "Improving Whole Foods In-Store Checkout Experience",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "Retail Tech"],
    summary:
      "Surfacing a hidden checkout feature for an improved in-store experience by aligning interface design with user mental models.",
    video: "/work/wholefoods/thumbnail1.mp4",
    category: "case-study",
  },
];

// Grid position maps for each filter state
// ALL FILTER - Original positions (work + play projects mixed)
const allWorkPositions = {
  "moodle-pain-detection": { col: 3, rowStart: 2, rowEnd: 4 },
  "confido-approval-flow": { col: 2, rowStart: 1, rowEnd: 3 },
  "venmo-privacy-controls": { col: 1, rowStart: 3, rowEnd: 5 },
  "whole-foods-checkout": { col: 2, rowStart: 5, rowEnd: 7 },
};

const allPlayPositions = {
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 },
  "im-listening": { col: 1, rowStart: 5, rowEnd: 7 },
  "cat-box": { col: 1, rowStart: 7, rowEnd: 8 },
  "sprite-map": { col: 1, rowStart: 8, rowEnd: 9 },
  "liquid-silk": { col: 1, rowStart: 9, rowEnd: 11 },
  "sticker-cats": { col: 1, rowStart: 11, rowEnd: 13 },
  "eye-see-you": { col: 1, rowStart: 13, rowEnd: 15 },
  "reflections-of-monet": { col: 1, rowStart: 15, rowEnd: 17 },
  "puzzle-feeder": { col: 1, rowStart: 17, rowEnd: 18 },
  "blend-your-cursor": { col: 1, rowStart: 18, rowEnd: 20 },
  "spherical-shopping": { col: 2, rowStart: 3, rowEnd: 5 },
  "binary-pool": { col: 2, rowStart: 7, rowEnd: 9 },
  "photo-collage-reveal": { col: 2, rowStart: 9, rowEnd: 11 },
  snowflake: { col: 2, rowStart: 11, rowEnd: 13 },
  "neumorphic-buttons": { col: 2, rowStart: 13, rowEnd: 14 },
  "bouncing-ball": { col: 2, rowStart: 14, rowEnd: 16 },
  "cat-figurine": { col: 2, rowStart: 16, rowEnd: 17 },
  "temple-of-fortune": { col: 2, rowStart: 17, rowEnd: 18 },
  "black-market": { col: 2, rowStart: 18, rowEnd: 20 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "gravity-text": { col: 3, rowStart: 4, rowEnd: 6 },
  "ball-slide": { col: 3, rowStart: 6, rowEnd: 8 },
  "emoji-ascii-art": { col: 3, rowStart: 8, rowEnd: 9 },
  "picture-distortion": { col: 3, rowStart: 9, rowEnd: 11 },
  "image-to-sprite": { col: 3, rowStart: 11, rowEnd: 13 },
  "five-identical-fishes": { col: 3, rowStart: 13, rowEnd: 14 },
  "pixel-trail": { col: 3, rowStart: 14, rowEnd: 16 },
  "starry-night": { col: 3, rowStart: 16, rowEnd: 17 },
  "whack-a-mouse": { col: 3, rowStart: 17, rowEnd: 18 },
  "words-unseen": { col: 3, rowStart: 18, rowEnd: 20 },
};

// CASE STUDIES FILTER - Only the 4 work projects
const caseStudyWorkPositions = {
  "confido-approval-flow": { col: 1, rowStart: 1, rowEnd: 3 },
  "moodle-pain-detection": { col: 2, rowStart: 1, rowEnd: 3 },
  "venmo-privacy-controls": { col: 3, rowStart: 1, rowEnd: 3 },
  "whole-foods-checkout": { col: 1, rowStart: 3, rowEnd: 5 },
};

// DIGITAL FILTER - Creative coding projects only
const digitalPlayPositions = {
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 },
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "im-listening": { col: 1, rowStart: 3, rowEnd: 5 },
  "binary-pool": { col: 2, rowStart: 3, rowEnd: 5 },
  "gravity-text": { col: 3, rowStart: 2, rowEnd: 4 },
  "ball-slide": { col: 3, rowStart: 4, rowEnd: 6 },
  "snowflake": { col: 1, rowStart: 5, rowEnd: 7 },
  "emoji-ascii-art": { col: 2, rowStart: 5, rowEnd: 6 },
  "sprite-map": { col: 2, rowStart: 6, rowEnd: 7 },
  "photo-collage-reveal": { col: 1, rowStart: 7, rowEnd: 9 },
  "picture-distortion": { col: 2, rowStart: 7, rowEnd: 9 },
  "liquid-silk": { col: 3, rowStart: 6, rowEnd: 8 },
  "neumorphic-buttons": { col: 3, rowStart: 8, rowEnd: 9 },
  "image-to-sprite": { col: 1, rowStart: 9, rowEnd: 11 },
  "sticker-cats": { col: 2, rowStart: 9, rowEnd: 11 },
  "bouncing-ball": { col: 3, rowStart: 9, rowEnd: 11 },
  "eye-see-you": { col: 1, rowStart: 11, rowEnd: 13 },
  "pixel-trail": { col: 2, rowStart: 11, rowEnd: 13 },
  "reflections-of-monet": { col: 3, rowStart: 11, rowEnd: 13 },
  "blend-your-cursor": { col: 1, rowStart: 13, rowEnd: 15 },
  "starry-night": { col: 2, rowStart: 13, rowEnd: 14 },
  "words-unseen": { col: 3, rowStart: 13, rowEnd: 15 },
};

// PHYSICAL FILTER - Fabrication + Temple of Fortune + Black Market
const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 3, rowStart: 2, rowEnd: 3 },
  "black-market": { col: 1, rowStart: 3, rowEnd: 5 },
};

const WorkBentoGrid = ({ onProjectClick }) => {
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const gridRef = useRef(null);
  const filterPillsRef = useRef(null);
  const lenis = useLenis();

  // Filter projects based on active filter
  let filteredWorkProjects = workProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "case-study") return project.category === "case-study";
    return false; // Work projects only show in "all" or "case-study"
  });

  let filteredPlayProjects = playProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "digital") return project.category === "digital";
    if (activeFilter === "physical") return project.category === "physical";
    return false;
  });

  // Select appropriate position maps based on active filter
  const getWorkPositions = () => {
    if (activeFilter === "case-study") return caseStudyWorkPositions;
    return allWorkPositions;
  };

  const getPlayPositions = () => {
    if (activeFilter === "digital") return digitalPlayPositions;
    if (activeFilter === "physical") return physicalPlayPositions;
    return allPlayPositions;
  };

  const workPositions = getWorkPositions();
  const playPositions = getPlayPositions();

  const handleFilterChange = (newFilter) => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true, force: true });
    }
    
    setActiveFilter(newFilter);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true, force: true });
    }
  }, [activeFilter, lenis]);

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      if (lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true, force: true });
      }
    };

    resetScroll();

    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(() => {
        resetScroll();
      });
    });

    const timeoutId = setTimeout(() => {
      resetScroll();
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        resetScroll();
      });
    }, 100);

    let frameCount = 0;
    const maxFrames = 120;

    const preventScrollJump = () => {
      if (frameCount >= maxFrames) return;

      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > 0) {
        resetScroll();
      }

      frameCount++;
      requestAnimationFrame(preventScrollJump);
    };

    const monitorTimeoutId = setTimeout(() => {
      requestAnimationFrame(preventScrollJump);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(monitorTimeoutId);
    };
  }, [activeFilter, lenis]);

  return (
    <>
      <CursorPill isHovering={isHoveringWorkCard} text="View case study" />
      <div ref={filterPillsRef}>
        <FilterPills activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>
      <div
        ref={gridRef}
        className="
          grid
          grid-cols-1
          min-[1026px]:grid-cols-3
          gap-4
          w-full
          auto-rows-[480px]
          min-[1026px]:auto-rows-[220px]
          bento-grid-filtered
        "
      >
        {filteredWorkProjects.map((project) => {
          const position = workPositions[project.id];
          return (
            <WorkBentoItem
              key={project.id}
              project={project}
              gridPosition={position}
              onHoverChange={setIsHoveringWorkCard}
            />
          );
        })}

        {filteredPlayProjects.map((project) => {
          const position = playPositions[project.id];
          if (!position) return null;
          return (
            <BentoItem
              key={project.id}
              project={project}
              onClick={onProjectClick}
              gridPosition={position}
            />
          );
        })}
      </div>
    </>
  );
};

export default WorkBentoGrid;
