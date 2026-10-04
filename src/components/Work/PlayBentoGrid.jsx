import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import NaturalPlayBentoItem from "./PlayBentoItem";
import { WorkCard } from "./WorkBentoGrid";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";
import {
  allPlayPositions,
  groupPlayProjectsByColumn,
  sortPlayProjectsByReadingOrder,
} from "./playGridReadingOrder";
import "./PlayBentoGrid.css";

// Match grid breakpoint: below 1024px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1023px)";

/**
 * TEMP preview grid: same projects in the same top-to-bottom reading order,
 * but auto-placed in 3 columns with heights driven by media aspect ratio
 * (object-contain, no fixed row tracks).
 */
function visibleMediaPending(grid) {
  return [...grid.querySelectorAll("img, video")].some((el) => {
    if (el.getClientRects().length === 0) return false;
    return el.getBoundingClientRect().height < 2;
  });
}

const PlayBentoGridNatural = ({
  onProjectClick,
  sectionIntro = null,
  projects = playProjects,
  positions = allPlayPositions,
}) => {
  const gridRef = useRef(null);
  const [hoveredCaseStudyId, setHoveredCaseStudyId] = useState(null);
  const [posterOnly, setPosterOnly] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(POSTER_ONLY_MEDIA).matches
      : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(POSTER_ONLY_MEDIA);
    const handleChange = (e) => setPosterOnly(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid?.style.minHeight) return undefined;

    let timeoutId = 0;
    const release = () => {
      grid.style.minHeight = "";
    };

    if (!visibleMediaPending(grid)) {
      release();
      return undefined;
    }

    const onMedia = () => {
      if (visibleMediaPending(grid)) return;
      release();
    };

    const observer = new ResizeObserver(onMedia);
    grid.querySelectorAll("img, video").forEach((el) => {
      if (el.getClientRects().length > 0) observer.observe(el);
    });
    timeoutId = window.setTimeout(release, 1000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [projects, positions]);

  const playProjectsInGrid = useMemo(
    () => projects.filter((p) => positions[p.id]),
    [projects, positions],
  );

  const renderItem = (project) => {
    const position = positions[project.id];
    const wide = (position?.colSpan ?? 1) > 1;

    if (project.kind === "work") {
      return (
        <WorkCard
          key={project.id}
          project={project}
          compactLayout
          onHoverChange={(hovered) =>
            setHoveredCaseStudyId(hovered ? project.id : null)
          }
        />
      );
    }

    return (
      <NaturalPlayBentoItem
        key={project.id}
        project={project}
        onClick={onProjectClick}
        wide={wide}
        posterOnly={posterOnly}
        onMouseEnter={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(project.id);
        }}
        onMouseLeave={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(null);
        }}
      />
    );
  };

  const projectsByColumn = groupPlayProjectsByColumn(
    playProjectsInGrid,
    positions,
  );

  const mobileStack = sortPlayProjectsByReadingOrder(
    playProjectsInGrid,
    positions,
  );

  return (
    <>
      <CursorPill
        isHovering={hoveredCaseStudyId !== null}
        text="View case study"
      />
      {sectionIntro != null ? (
        <div className="home-play-bento-intro-outside">{sectionIntro}</div>
      ) : null}
      <div className="home-play-bento-grid-natural" ref={gridRef}>
        <div className="home-play-bento-grid-natural-mobile">
          {mobileStack.map((project) => renderItem(project))}
        </div>
        <div className="home-play-bento-grid-natural-desktop">
          {[1, 2, 3].map((col) => (
            <div key={col} className="home-play-bento-natural-col">
              {projectsByColumn[col].map((project) => renderItem(project))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlayBentoGridNatural;
