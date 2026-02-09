import React, { useState, useRef } from "react";
import BentoItem from "../Play/BentoItem";
import WorkBentoItem from "./WorkBentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

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

// Home page preview positions - Featured projects only
const homePreviewPositions = {
  // Row 1
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 }, // jukebox (tall)
  "confido-approval-flow": { col: 2, rowStart: 1, rowEnd: 3 }, // confido case study (tall)
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 }, // emotional canvas (short)
  
  // Row 2
  "venmo-privacy-controls": { col: 1, rowStart: 3, rowEnd: 5 }, // venmo case study (tall)
  "spherical-shopping": { col: 2, rowStart: 3, rowEnd: 5 }, // spherical shopping (tall)
  "moodle-pain-detection": { col: 3, rowStart: 2, rowEnd: 4 }, // moodle case study (tall)
  
  // Row 3
  "gravity-text": { col: 1, rowStart: 5, rowEnd: 7 }, // gravity text (tall)
  "whole-foods-checkout": { col: 2, rowStart: 5, rowEnd: 7 }, // wholefoods case study (tall)
  "binary-pool": { col: 3, rowStart: 4, rowEnd: 6 }, // binary pool (tall)
  
  // Row 4
  "cat-box": { col: 1, rowStart: 7, rowEnd: 8 }, // cat-box (short)
  "snowflake": { col: 2, rowStart: 7, rowEnd: 9 }, // snowflake (tall)
  "picture-distortion": { col: 3, rowStart: 6, rowEnd: 8 }, // picture-distortion (tall)
  
  // Row 5
  "emoji-ascii-art": { col: 1, rowStart: 8, rowEnd: 9 }, // ascii art (short)
  "neumorphic-buttons": { col: 3, rowStart: 8, rowEnd: 9 }, // neumorphic buttons (short) - third column bottom
};

const HomeBentoGrid = ({ onProjectClick }) => {
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);
  const gridRef = useRef(null);

  // Featured projects in specific order for home page
  const featuredWorkIds = [
    "confido-approval-flow",
    "venmo-privacy-controls",
    "moodle-pain-detection",
    "whole-foods-checkout",
  ];
  const featuredPlayIds = [
    "floral-jukebox",
    "emotional-canvas",
    "spherical-shopping",
    "gravity-text",
    "binary-pool",
    "cat-box",
    "snowflake",
    "picture-distortion",
    "emoji-ascii-art",
    "neumorphic-buttons",
  ];
  
  // Filter to only show featured projects in the specified order
  const filteredWorkProjects = featuredWorkIds
    .map(id => workProjects.find(p => p.id === id))
    .filter(Boolean);
  const filteredPlayProjects = featuredPlayIds
    .map(id => playProjects.find(p => p.id === id))
    .filter(Boolean);

  return (
    <>
      <CursorPill isHovering={isHoveringWorkCard} text="View case study" />
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
        "
      >
        {/* Work Items - rendered first so they appear on top */}
        {filteredWorkProjects.map((project) => {
          const position = homePreviewPositions[project.id];
          return (
            <WorkBentoItem
              key={project.id}
              project={project}
              gridPosition={position}
              onHoverChange={setIsHoveringWorkCard}
            />
          );
        })}

        {/* Play Items - rendered after work items */}
        {filteredPlayProjects.map((project) => {
          const position = homePreviewPositions[project.id];
          // Only render if position is defined
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

export default HomeBentoGrid;
