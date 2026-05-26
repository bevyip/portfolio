import React, { useState, useRef, useEffect, useCallback } from "react";
import BentoItem from "../BentoItem/BentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";

// Match grid breakpoint: below 1024px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1023px)";

/** Desktop grid placement for “all” play projects (`/` and `/google-creative`). */
const allPlayPositions = {
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

/** Below 1024px the play grid is one column and explicit placement is off (Home.css), so DOM order = scroll order. Sort by the same cell map as the wide grid: top to bottom, then left to right. */
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

const PlayBentoGrid = ({
  onProjectClick,
  sectionIntro = null,
}) => {
  const [hoveredCaseStudyId, setHoveredCaseStudyId] = useState(null);
  const activeFilter = "all";
  const [posterOnly, setPosterOnly] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(POSTER_ONLY_MEDIA).matches : false
  );
  const gridRef = useRef(null);

  // TEMPORARY: concurrent play cap disabled — every in-view card may play its video.
  // const MAX_PLAYING = 6;
  // const playingVideos = useRef(new Set());

  const requestPlay = useCallback((videoEl) => {
    if (!videoEl) return;
    // if (playingVideos.current.size < MAX_PLAYING) {
    //   playingVideos.current.add(videoEl);
    //   videoEl.play().catch(() => {});
    // }
    videoEl.play().catch(() => {});
  }, []);

  const notifyPause = useCallback((videoEl) => {
    if (!videoEl) return;
    // playingVideos.current.delete(videoEl);
    videoEl.pause();
  }, []);

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
    return allPlayPositions;
  };

  const playPositions = getPlayPositions();

  // Below 1024px, grid placement CSS is off: one column flows in DOM order. Match wide-layout reading order (row, then col).
  const projectsForGrid = posterOnly
    ? [...filteredPlayProjects].sort((a, b) =>
        comparePlayReadingOrder(a, b, playPositions),
      )
    : filteredPlayProjects;

  const gridClassName =
    "home-play-bento-grid grid grid-cols-1 min-[1024px]:grid-cols-3 gap-4 w-full auto-rows-[480px] min-[1024px]:auto-rows-[220px] bento-grid-filtered";

  const bentoItems = projectsForGrid.map((project) => {
    const position = playPositions[project.id];
    if (!position) return null;
    const projectForItem =
      project.id === "puzzle-feeder"
        ? { ...project, size: "tall" }
        : project;
    return (
      <BentoItem
        key={project.id}
        project={projectForItem}
        onClick={onProjectClick}
        gridPosition={position}
        posterOnly={posterOnly}
        onRequestPlay={requestPlay}
        onNotifyPause={notifyPause}
        onMouseEnter={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(project.id);
        }}
        onMouseLeave={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(null);
        }}
      />
    );
  });

  return (
    <>
      <CursorPill
        isHovering={hoveredCaseStudyId !== null}
        text="View case study"
      />
      {sectionIntro != null ? (
        <div className="home-play-bento-intro-outside">{sectionIntro}</div>
      ) : null}
      <div ref={gridRef} className={gridClassName}>
        {bentoItems}
      </div>
    </>
  );
};

export default PlayBentoGrid;
