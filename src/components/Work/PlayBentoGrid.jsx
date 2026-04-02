import React, { useState, useRef, useEffect } from "react";
import BentoItem from "../BentoItem/BentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

// Match grid breakpoint: below 1026px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1025px)";

/* Home (`/`): original WorkBentoGrid play maps (verbatim) */
const allPlayPositionsHome = {
  "floral-jukebox": { col: 3, rowStart: 2, rowEnd: 4 },
  "im-listening": { col: 1, rowStart: 3, rowEnd: 4 },
  "binary-pool": { col: 1, rowStart: 4, rowEnd: 6 },
  "cat-box": { col: 1, rowStart: 6, rowEnd: 7 },
  "sticker-cats": { col: 1, rowStart: 7, rowEnd: 9 },
  "words-unseen": { col: 1, rowStart: 9, rowEnd: 11 },
  "ball-slide": { col: 1, rowStart: 11, rowEnd: 13 },
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "gravity-text": { col: 2, rowStart: 3, rowEnd: 5 },
  "photo-collage-reveal": { col: 3, rowStart: 10, rowEnd: 12 },
  snowflake: { col: 2, rowStart: 7, rowEnd: 9 },
  "neumorphic-buttons": { col: 2, rowStart: 9, rowEnd: 10 },
  "cat-figurine": { col: 2, rowStart: 10, rowEnd: 11 },
  "temple-of-fortune": { col: 2, rowStart: 11, rowEnd: 12 },
  "puzzle-feeder": { col: 2, rowStart: 12, rowEnd: 13 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "block-party": { col: 1, rowStart: 1, rowEnd: 3 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "reflections-of-monet": { col: 3, rowStart: 7, rowEnd: 8 },
  "starry-night": { col: 3, rowStart: 8, rowEnd: 9 },
  "five-identical-fishes": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 2, rowStart: 5, rowEnd: 7 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
};

/* /google-creative: wide block-party hero + col 1–2 under it; col 3 matches home (no intro in grid) */
const allPlayPositionsGoogleCreative = {
  "block-party": { col: 1, rowStart: 1, rowEnd: 4, colSpan: 2 },
  "floral-jukebox": { col: 1, rowStart: 4, rowEnd: 6 },
  "im-listening": { col: 1, rowStart: 6, rowEnd: 7 },
  "cat-box": { col: 1, rowStart: 7, rowEnd: 8 },
  "sticker-cats": { col: 1, rowStart: 8, rowEnd: 10 },
  "words-unseen": { col: 1, rowStart: 10, rowEnd: 12 },
  "ball-slide": { col: 1, rowStart: 12, rowEnd: 14 },
  "starry-night": { col: 1, rowStart: 14, rowEnd: 15 },
  "gravity-text": { col: 2, rowStart: 4, rowEnd: 6 },
  "binary-pool": { col: 2, rowStart: 6, rowEnd: 8 },
  "photo-collage-reveal": { col: 3, rowStart: 10, rowEnd: 12 },
  snowflake: { col: 2, rowStart: 10, rowEnd: 12 },
  "neumorphic-buttons": { col: 2, rowStart: 12, rowEnd: 13 },
  "cat-figurine": { col: 2, rowStart: 13, rowEnd: 14 },
  "temple-of-fortune": { col: 2, rowStart: 14, rowEnd: 15 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "spherical-shopping": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "reflections-of-monet": { col: 2, rowStart: 8, rowEnd: 10 },
  "five-identical-fishes": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 3, rowStart: 7, rowEnd: 9 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
  "puzzle-feeder": { col: 3, rowStart: 13, rowEnd: 15 },
};

const digitalPlayPositionsHome = {
  "floral-jukebox": { col: 3, rowStart: 2, rowEnd: 4 },
  "spherical-shopping": { col: 2, rowStart: 1, rowEnd: 3 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "im-listening": { col: 1, rowStart: 3, rowEnd: 4 },
  "binary-pool": { col: 1, rowStart: 4, rowEnd: 6 },
  "gravity-text": { col: 2, rowStart: 3, rowEnd: 5 },
  "block-party": { col: 1, rowStart: 1, rowEnd: 3 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "snowflake": { col: 1, rowStart: 6, rowEnd: 8 },
  "emoji-ascii-art": { col: 2, rowStart: 5, rowEnd: 6 },
  "photo-collage-reveal": { col: 3, rowStart: 9, rowEnd: 11 },
  "reflections-of-monet": { col: 2, rowStart: 7, rowEnd: 8 },
  "neumorphic-buttons": { col: 3, rowStart: 6, rowEnd: 7 },
  "sticker-cats": { col: 2, rowStart: 8, rowEnd: 10 },
  "words-unseen": { col: 1, rowStart: 11, rowEnd: 13 },
  "ball-slide": { col: 3, rowStart: 7, rowEnd: 9 },
  "starry-night": { col: 2, rowStart: 10, rowEnd: 11 },
  "ascii-filter": { col: 1, rowStart: 8, rowEnd: 10 },
};

const digitalPlayPositionsGoogleCreative = {
  "block-party": { col: 1, rowStart: 1, rowEnd: 4, colSpan: 2 },
  "floral-jukebox": { col: 1, rowStart: 4, rowEnd: 6 },
  "gravity-text": { col: 2, rowStart: 4, rowEnd: 6 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "im-listening": { col: 1, rowStart: 6, rowEnd: 7 },
  "binary-pool": { col: 2, rowStart: 6, rowEnd: 8 },
  "spherical-shopping": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 3, rowStart: 4, rowEnd: 6 },
  "snowflake": { col: 2, rowStart: 10, rowEnd: 12 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "photo-collage-reveal": { col: 3, rowStart: 11, rowEnd: 13 },
  "reflections-of-monet": { col: 2, rowStart: 8, rowEnd: 10 },
  "neumorphic-buttons": { col: 2, rowStart: 12, rowEnd: 13 },
  "sticker-cats": { col: 1, rowStart: 8, rowEnd: 10 },
  "words-unseen": { col: 1, rowStart: 10, rowEnd: 12 },
  "ball-slide": { col: 1, rowStart: 12, rowEnd: 14 },
  "starry-night": { col: 3, rowStart: 9, rowEnd: 11 },
  "ascii-filter": { col: 3, rowStart: 7, rowEnd: 9 },
};

const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 3, rowStart: 2, rowEnd: 3 },
};

/**
 * Two play bento layouts: pick one from the page (see Home `playBentoLayout`).
 * - `all` / `digital`: grid cell maps for each filter mode
 * - `embedIntroInGrid`: optional title block inside the grid (unused; intros render above the grid from Home)
 */
export const PLAY_BENTO_LAYOUT = {
  home: {
    id: "home",
    all: allPlayPositionsHome,
    digital: digitalPlayPositionsHome,
    embedIntroInGrid: false,
  },
  googleCreative: {
    id: "google-creative",
    all: allPlayPositionsGoogleCreative,
    digital: digitalPlayPositionsGoogleCreative,
    embedIntroInGrid: false,
  },
};

const PlayBentoGrid = ({
  onProjectClick,
  sectionIntro = null,
  bentoLayout = PLAY_BENTO_LAYOUT.home,
}) => {
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const activeFilter = "all";
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
    if (activeFilter === "digital") return bentoLayout.digital;
    if (activeFilter === "physical") return physicalPlayPositions;
    return bentoLayout.all;
  };

  const playPositions = getPlayPositions();

  const introFitsInBentoGrid =
    bentoLayout.embedIntroInGrid &&
    sectionIntro != null &&
    !posterOnly &&
    activeFilter !== "physical";

  const gridClassName =
    "home-play-bento-grid grid grid-cols-1 min-[1026px]:grid-cols-3 gap-4 w-full auto-rows-[480px] min-[1026px]:auto-rows-[220px] bento-grid-filtered";

  const bentoItems = filteredPlayProjects.map((project) => {
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
  });

  return (
    <>
      <CursorPill isHovering={isHoveringCard} text="View project" />
      {introFitsInBentoGrid ? (
        <div ref={gridRef} className={gridClassName}>
          <div className="home-play-bento-intro">{sectionIntro}</div>
          {bentoItems}
        </div>
      ) : (
        <>
          {sectionIntro != null ? (
            <div className="home-play-bento-intro-outside">{sectionIntro}</div>
          ) : null}
          <div ref={gridRef} className={gridClassName}>
            {bentoItems}
          </div>
        </>
      )}
    </>
  );
};

export default PlayBentoGrid;
