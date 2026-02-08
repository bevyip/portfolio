import React, { useState } from "react";
import BentoItem from "../Play/BentoItem";
import WorkBentoItem from "./WorkBentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

// Work projects data (from WorkSection)
const workProjects = [
  {
    id: "confido-approval-flow",
    title: "Rebuilding Confido's Approval Flow",
    role: "Product Designer & Developer",
    tags: ["Web", "Design Systems", "Enterprise Software"],
    summary:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail1.mp4",
  },
  {
    id: "moodle-pain-detection",
    title: "Moodle: AI-Powered Feline Pain Detection for Cat Owners",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "AI/ML"],
    summary:
      "Making clinical-grade pain monitoring accessible to cat owners through intuitive mobile design and privacy-first AI.",
    video: "/work/moodle/thumbnail1.mp4",
  },
  {
    id: "venmo-privacy-controls",
    title: "Redesigning Venmo's Privacy Controls",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "FinTech"],
    summary:
      "Transforming Venmo's public-by-default privacy model to help users make informed choices without confusion.",
    video: "/work/venmo/thumbnail1.mp4",
  },
  {
    id: "whole-foods-checkout",
    title: "Improving Whole Foods In-Store Checkout Experience",
    role: "Product Designer",
    tags: ["Mobile", "User Research", "Retail Tech"],
    summary:
      "Surfacing a hidden checkout feature for an improved in-store experience by aligning interface design with user mental models.",
    video: "/work/wholefoods/thumbnail1.mp4",
  },
];

// Grid positions for work items (tall size - 2 rows)
// Pattern: play work play / work play work / play work play
const workGridPositions = {
  "moodle-pain-detection": { col: 3, rowStart: 2, rowEnd: 4 }, // Row 2: work play work (moved up)
  "confido-approval-flow": { col: 2, rowStart: 1, rowEnd: 3 }, // Row 1: play work play
  "venmo-privacy-controls": { col: 1, rowStart: 3, rowEnd: 5 }, // Row 2: work play work
  "whole-foods-checkout": { col: 2, rowStart: 5, rowEnd: 7 }, // Row 3: play work play
};

// Grid positions for play items
// Pattern: play work play / work play work / play work play / rest of play
const playGridPositions = {
  // Column 1
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 }, // Row 1: play work play
  "im-listening": { col: 1, rowStart: 5, rowEnd: 7 }, // Row 3: play work play
  "cat-box": { col: 1, rowStart: 7, rowEnd: 8 },
  "sprite-map": { col: 1, rowStart: 8, rowEnd: 9 },
  "liquid-silk": { col: 1, rowStart: 9, rowEnd: 11 },
  "sticker-cats": { col: 1, rowStart: 11, rowEnd: 13 }, // Fill gap
  "eye-see-you": { col: 1, rowStart: 13, rowEnd: 15 },
  "reflections-of-monet": { col: 1, rowStart: 15, rowEnd: 17 },
  "puzzle-feeder": { col: 1, rowStart: 17, rowEnd: 18 },
  "blend-your-cursor": { col: 1, rowStart: 18, rowEnd: 20 }, // Under puzzle-feeder

  // Column 2
  "spherical-shopping": { col: 2, rowStart: 3, rowEnd: 5 }, // Row 2: work play work
  "binary-pool": { col: 2, rowStart: 7, rowEnd: 9 },
  "photo-collage-reveal": { col: 2, rowStart: 9, rowEnd: 11 }, // Moved to make room for whole-foods
  snowflake: { col: 2, rowStart: 11, rowEnd: 13 },
  "neumorphic-buttons": { col: 2, rowStart: 13, rowEnd: 14 },
  "bouncing-ball": { col: 2, rowStart: 14, rowEnd: 16 },
  "cat-figurine": { col: 2, rowStart: 16, rowEnd: 17 },
  "temple-of-fortune": { col: 2, rowStart: 17, rowEnd: 18 },
  "black-market": { col: 2, rowStart: 18, rowEnd: 20 }, // Bottom of column 2 (tall)

  // Column 3
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 }, // Row 1: play work play (short)
  "gravity-text": { col: 3, rowStart: 4, rowEnd: 6 }, // Row 3: play work play (shifted up)
  "ball-slide": { col: 3, rowStart: 6, rowEnd: 8 }, // Tall item after gravity-text
  "emoji-ascii-art": { col: 3, rowStart: 8, rowEnd: 9 }, // Shifted down
  "picture-distortion": { col: 3, rowStart: 9, rowEnd: 11 }, // Shifted down
  "image-to-sprite": { col: 3, rowStart: 11, rowEnd: 13 }, // Shifted down
  "five-identical-fishes": { col: 3, rowStart: 13, rowEnd: 14 }, // Shifted down
  "pixel-trail": { col: 3, rowStart: 14, rowEnd: 16 }, // Shifted down
  "starry-night": { col: 3, rowStart: 16, rowEnd: 17 }, // Shifted down
  "whack-a-mouse": { col: 3, rowStart: 17, rowEnd: 18 }, // Shifted down
  "words-unseen": { col: 3, rowStart: 18, rowEnd: 20 }, // Shifted down
};

const CombinedBentoGrid = ({ onProjectClick }) => {
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);

  return (
    <>
      <CursorPill isHovering={isHoveringWorkCard} text="View case study" />
      <div
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
        {workProjects.map((project) => {
          const position = workGridPositions[project.id];
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
      {playProjects.map((project) => {
        const position = playGridPositions[project.id];
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

export default CombinedBentoGrid;
