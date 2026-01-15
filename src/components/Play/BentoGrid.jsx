import React from "react";
import BentoItem from "./BentoItem";
import { playProjects } from "../../data/playProjects";

// Hardcoded grid positions for each project
// Format: { projectId: { col: number, rowStart: number, rowEnd: number } }
const gridPositions = {
  // Column 1
  "im-listening": { col: 1, rowStart: 1, rowEnd: 3 },
  "ball-slide": { col: 1, rowStart: 3, rowEnd: 5 },
  "cat-box": { col: 1, rowStart: 5, rowEnd: 6 },
  "sprite-map": { col: 1, rowStart: 6, rowEnd: 7 },
  "liquid-silk": { col: 1, rowStart: 7, rowEnd: 9 },
  "sticker-cats": { col: 1, rowStart: 9, rowEnd: 11 },
  "eye-see-you": { col: 1, rowStart: 11, rowEnd: 13 },
  "reflections-of-monet": { col: 1, rowStart: 13, rowEnd: 15 },
  "puzzle-feeder": { col: 1, rowStart: 15, rowEnd: 16 },

  // Column 2
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "binary-pool": { col: 2, rowStart: 3, rowEnd: 5 },
  snowflake: { col: 2, rowStart: 5, rowEnd: 7 },
  "photo-collage-reveal": { col: 2, rowStart: 7, rowEnd: 9 },
  "bouncing-ball": { col: 2, rowStart: 9, rowEnd: 11 },
  "neumorphic-buttons": { col: 2, rowStart: 11, rowEnd: 12 },
  "cat-figurine": { col: 2, rowStart: 12, rowEnd: 13 },
  "blend-your-cursor": { col: 2, rowStart: 13, rowEnd: 15 },
  "temple-of-fortune": { col: 2, rowStart: 15, rowEnd: 16 },

  // Column 3
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "gravity-text": { col: 3, rowStart: 2, rowEnd: 4 },
  "emoji-ascii-art": { col: 3, rowStart: 4, rowEnd: 5 },
  "picture-distortion": { col: 3, rowStart: 5, rowEnd: 7 },
  "image-to-sprite": { col: 3, rowStart: 7, rowEnd: 9 },
  "five-identical-fishes": { col: 3, rowStart: 9, rowEnd: 10 },
  "pixel-trail": { col: 3, rowStart: 10, rowEnd: 12 },
  "starry-night": { col: 3, rowStart: 12, rowEnd: 13 },
  "whack-a-mouse": { col: 3, rowStart: 13, rowEnd: 14 },
  "words-unseen": { col: 3, rowStart: 14, rowEnd: 16 },
};

const BentoGrid = ({ onProjectClick }) => {
  return (
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
      {playProjects.map((project) => {
        const position = gridPositions[project.id];
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
  );
};

export default BentoGrid;
