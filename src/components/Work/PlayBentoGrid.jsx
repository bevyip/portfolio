import React, { useState, useRef, useEffect } from "react";
import BentoItem from "../BentoItem/BentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

// Match grid breakpoint: below 1026px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1025px)";

/* Home (`/`): original WorkBentoGrid play maps (verbatim) */
const allPlayPositionsHome = {
  "floral-jukebox": { col: 2, rowStart: 3, rowEnd: 5 },
  "im-listening": { col: 1, rowStart: 5, rowEnd: 6 },
  "binary-pool": { col: 3, rowStart: 7, rowEnd: 9 },
  "cat-box": { col: 1, rowStart: 8, rowEnd: 9 },
  "sticker-cats": { col: 1, rowStart: 9, rowEnd: 11 },
  "words-unseen": { col: 3, rowStart: 10, rowEnd: 12 },
  "draw-canvas": { col: 2, rowStart: 1, rowEnd: 3 },
  "spherical-shopping": { col: 1, rowStart: 3, rowEnd: 5 },
  "gravity-text": { col: 3, rowStart: 4, rowEnd: 6 },
  "page-canvas": { col: 2, rowStart: 5, rowEnd: 7 },
  snowflake: { col: 2, rowStart: 7, rowEnd: 9 },
  "neumorphic-buttons": { col: 2, rowStart: 9, rowEnd: 10 },
  "cat-figurine": { col: 2, rowStart: 10, rowEnd: 11 },
  "temple-of-fortune": { col: 2, rowStart: 11, rowEnd: 12 },
  "puzzle-feeder": { col: 2, rowStart: 12, rowEnd: 13 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "block-party": { col: 1, rowStart: 1, rowEnd: 3 },
  "picture-distortion": { col: 1, rowStart: 6, rowEnd: 8 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "reflections-of-monet": { col: 1, rowStart: 11, rowEnd: 12 },
  "starry-night": { col: 1, rowStart: 12, rowEnd: 13 },
  "five-identical-fishes": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 3, rowStart: 2, rowEnd: 4 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
};

/* /google-creative: wide block-party hero + col 1–2 under it; col 3 matches home (no intro in grid) */
const allPlayPositionsGoogleCreative = {
  "block-party": { col: 1, rowStart: 1, rowEnd: 4, colSpan: 2 },
  "floral-jukebox": { col: 1, rowStart: 6, rowEnd: 8 },
  "draw-canvas": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 1, rowStart: 8, rowEnd: 10 },
  "cat-box": { col: 1, rowStart: 10, rowEnd: 11 },
  "sticker-cats": { col: 1, rowStart: 11, rowEnd: 13 },
  "words-unseen": { col: 3, rowStart: 10, rowEnd: 12 },
  "reflections-of-monet": { col: 1, rowStart: 13, rowEnd: 15 },
  "gravity-text": { col: 2, rowStart: 6, rowEnd: 8 },
  "binary-pool": { col: 2, rowStart: 8, rowEnd: 10 },
  "page-canvas": { col: 3, rowStart: 4, rowEnd: 6 },
  snowflake: { col: 2, rowStart: 10, rowEnd: 12 },
  "neumorphic-buttons": { col: 2, rowStart: 12, rowEnd: 13 },
  "cat-figurine": { col: 2, rowStart: 13, rowEnd: 14 },
  "temple-of-fortune": { col: 2, rowStart: 14, rowEnd: 15 },
  "emotional-canvas": { col: 3, rowStart: 1, rowEnd: 2 },
  "spherical-shopping": { col: 1, rowStart: 4, rowEnd: 6 },
  "im-listening": { col: 3, rowStart: 7, rowEnd: 8 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "five-identical-fishes": { col: 3, rowStart: 8, rowEnd: 9 },
  "starry-night": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 2, rowStart: 4, rowEnd: 6 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
  "puzzle-feeder": { col: 3, rowStart: 13, rowEnd: 15 },
};

const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 3, rowStart: 2, rowEnd: 3 },
};

/** Below 1026px the play grid is one column and explicit placement is off (Home.css), so DOM order = scroll order. Sort by the same cell map as the wide grid: top to bottom, then left to right. */
function comparePlayReadingOrder(a, b, positions) {
  const pa = positions[a.id];
  const pb = positions[b.id];
  if (!pa && !pb) return 0;
  if (!pa) return 1;
  if (!pb) return -1;
  if (pa.rowStart !== pb.rowStart) return pa.rowStart - pb.rowStart;
  if (pa.col !== pb.col) return pa.col - pb.col;
  return (pa.rowEnd ?? 0) - (pb.rowEnd ?? 0);
}

/**
 * Play bento layouts: pick one from the page (see Home `playBentoLayout`).
 * - `all`: full grid cell map (home vs google-creative variants)
 * - `embedIntroInGrid`: optional title block inside the grid (unused; intros render above the grid from Home)
 */
export const PLAY_BENTO_LAYOUT = {
  home: {
    id: "home",
    all: allPlayPositionsHome,
    embedIntroInGrid: false,
  },
  googleCreative: {
    id: "google-creative",
    all: allPlayPositionsGoogleCreative,
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
    if (activeFilter === "physical") return project.category === "physical";
    return false;
  });

  const getPlayPositions = () => {
    if (activeFilter === "physical") return physicalPlayPositions;
    return bentoLayout.all;
  };

  const playPositions = getPlayPositions();

  // Below 1026px, grid placement CSS is off: one column flows in DOM order. Match wide-layout reading order (row, then col).
  const projectsForGrid = posterOnly
    ? [...filteredPlayProjects].sort((a, b) =>
        comparePlayReadingOrder(a, b, playPositions),
      )
    : filteredPlayProjects;

  const introFitsInBentoGrid =
    bentoLayout.embedIntroInGrid &&
    sectionIntro != null &&
    !posterOnly &&
    activeFilter !== "physical";

  const gridClassName =
    "home-play-bento-grid grid grid-cols-1 min-[1026px]:grid-cols-3 gap-4 w-full auto-rows-[480px] min-[1026px]:auto-rows-[220px] bento-grid-filtered";

  const bentoItems = projectsForGrid.map((project) => {
    const position = playPositions[project.id];
    if (!position) return null;
    const projectForItem =
      bentoLayout.id === "google-creative" && project.id === "puzzle-feeder"
        ? { ...project, size: "tall" }
        : project;
    return (
      <BentoItem
        key={project.id}
        project={projectForItem}
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
