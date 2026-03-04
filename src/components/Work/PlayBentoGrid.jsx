import React, { useState, useRef, useEffect } from "react";
import BentoItem from "../BentoItem/BentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

// Match grid breakpoint: below 1026px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1025px)";

// Play grid position maps (same as WorkBentoGrid play filters)
const allPlayPositions = {
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 },
  "im-listening": { col: 1, rowStart: 3, rowEnd: 4 },
  "block-party": { col: 1, rowStart: 4, rowEnd: 5 },
  "cat-box": { col: 1, rowStart: 5, rowEnd: 6 },
  "sticker-cats": { col: 1, rowStart: 6, rowEnd: 8 },
  "words-unseen": { col: 1, rowStart: 8, rowEnd: 10 },
  "ball-slide": { col: 1, rowStart: 10, rowEnd: 12 },
  "puzzle-feeder": { col: 1, rowStart: 12, rowEnd: 13 },
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "binary-pool": { col: 2, rowStart: 3, rowEnd: 5 },
  "photo-collage-reveal": { col: 2, rowStart: 5, rowEnd: 7 },
  snowflake: { col: 2, rowStart: 7, rowEnd: 9 },
  "neumorphic-buttons": { col: 2, rowStart: 9, rowEnd: 10 },
  "cat-figurine": { col: 2, rowStart: 10, rowEnd: 11 },
  "temple-of-fortune": { col: 2, rowStart: 11, rowEnd: 12 },
  "starry-night": { col: 2, rowStart: 12, rowEnd: 13 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "gravity-text": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "reflections-of-monet": { col: 3, rowStart: 7, rowEnd: 9 },
  "five-identical-fishes": { col: 3, rowStart: 9, rowEnd: 10 },
  "black-market": { col: 3, rowStart: 10, rowEnd: 12 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
};

const digitalPlayPositions = {
  "floral-jukebox": { col: 1, rowStart: 1, rowEnd: 3 },
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "im-listening": { col: 1, rowStart: 3, rowEnd: 4 },
  "block-party": { col: 1, rowStart: 4, rowEnd: 5 },
  "binary-pool": { col: 2, rowStart: 3, rowEnd: 5 },
  "gravity-text": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "snowflake": { col: 1, rowStart: 5, rowEnd: 7 },
  "emoji-ascii-art": { col: 2, rowStart: 5, rowEnd: 6 },
  "photo-collage-reveal": { col: 1, rowStart: 7, rowEnd: 9 },
  "reflections-of-monet": { col: 2, rowStart: 7, rowEnd: 9 },
  "neumorphic-buttons": { col: 3, rowStart: 6, rowEnd: 7 },
  "sticker-cats": { col: 2, rowStart: 9, rowEnd: 11 },
  "words-unseen": { col: 1, rowStart: 10, rowEnd: 12 },
  "ball-slide": { col: 3, rowStart: 7, rowEnd: 9 },
  "starry-night": { col: 2, rowStart: 11, rowEnd: 12 },
};

const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 3, rowStart: 2, rowEnd: 3 },
  "black-market": { col: 1, rowStart: 3, rowEnd: 5 },
};

const PlayBentoGrid = ({ onProjectClick }) => {
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [posterOnly, setPosterOnly] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(POSTER_ONLY_MEDIA).matches : false
  );
  const gridRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia(POSTER_ONLY_MEDIA);
    const handleChange = (e) => setPosterOnly(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const filteredPlayProjects = playProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "digital") return project.category === "digital";
    if (activeFilter === "physical") return project.category === "physical";
    return false;
  });

  const getPlayPositions = () => {
    if (activeFilter === "digital") return digitalPlayPositions;
    if (activeFilter === "physical") return physicalPlayPositions;
    return allPlayPositions;
  };

  const playPositions = getPlayPositions();

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  return (
    <>
      <CursorPill isHovering={isHoveringCard} text="View project" />
      <div
        ref={gridRef}
        className="grid grid-cols-1 min-[1026px]:grid-cols-3 gap-4 w-full auto-rows-[480px] min-[1026px]:auto-rows-[220px] bento-grid-filtered"
      >
        {filteredPlayProjects.map((project) => {
          const position = playPositions[project.id];
          if (!position) return null;
          return (
            <BentoItem
              key={project.id}
              project={project}
              onClick={onProjectClick}
              gridPosition={position}
              posterOnly={posterOnly}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlayBentoGrid;
