import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Github,
  Play,
  Maximize2,
  Code2,
  FileText,
} from "lucide-react";

// Custom Figma icon component
const FigmaIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

// Custom X (Twitter) icon component
const XIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Map action types to icons and colors
const actionConfig = {
  live: {
    icon: ExternalLink,
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-50",
  },
  github: {
    icon: Github,
    color: "text-gray-700",
    hoverBg: "hover:bg-gray-100",
  },
  video: {
    icon: Play,
    color: "text-red-500",
    hoverBg: "hover:bg-red-50",
  },
  interactive: {
    icon: Maximize2,
    color: "text-purple-500",
    hoverBg: "hover:bg-purple-50",
  },
  sketch: {
    icon: Code2,
    color: "text-green-500",
    hoverBg: "hover:bg-green-50",
  },
  notion: {
    icon: FileText,
    color: "text-orange-500",
    hoverBg: "hover:bg-orange-50",
  },
  figma: {
    icon: FigmaIcon,
    color: "text-pink-500",
    hoverBg: "hover:bg-pink-50",
  },
  X: {
    icon: XIcon,
    color: "text-black",
    hoverBg: "hover:bg-gray-100",
  },
};

// Map sizes to grid classes (strict 3 columns, only height varies)
// Desktop (>1025px): 3 columns, cards only vary in row span
// Mobile (≤1025px): Single column, all cards same height
const sizeClasses = {
  tall: "min-[1026px]:row-span-2", // Tall card (2 rows)
  short: "", // Standard height (1 row)
};

const BentoItem = ({
  project,
  onClick,
  gridPosition,
  posterOnly = false,
  onMouseEnter,
  onMouseLeave,
  onRequestPlay,
  onNotifyPause,
}) => {
  const { id, theme = "white", tags, actions, size, media } = project;
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [videoInView, setVideoInView] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const posterImgRef = useRef(null);
  const iframeObserverTargetRef = useRef(null);

  const isBlack = theme === "black";
  const hasVideo = media?.video;
  const hasPoster = hasVideo && media?.poster;
  const hasImage = media?.image || media?.thumbnail;
  const hasIframe = media?.iframe;
  const showVideoBlock = hasVideo && !posterOnly;
  const posterOnlyImage =
    posterOnly && hasVideo && (media?.poster || media?.thumbnail);
  const hasMedia = showVideoBlock || hasIframe || hasImage || !!posterOnlyImage;
  const disableHover = id === "ball-slide";

  // The lqip (low-quality image placeholder) is a tiny base64 WebP string
  // embedded directly in playProjects.js. It renders instantly with no network
  // request, replacing the skeleton entirely. isMediaLoaded controls the
  // crossfade from blurred lqip → sharp real image/video.
  const lqip = media?.lqip ?? null;

  // Deferred setState: keeps image onLoad / decode callbacks out of the same
  // frame as scroll to avoid layout thrashing.
  const setMediaLoadedDeferred = useCallback(() => {
    requestAnimationFrame(() => setIsMediaLoaded(true));
  }, []);

  const handleCardClick = useCallback(
    (e) => {
      if (!hasIframe) {
        onClick?.(project);
      }
    },
    [hasIframe, onClick, project],
  );

  // Set CSS custom properties for grid positioning
  const gridStyle = gridPosition
    ? {
        "--grid-col": gridPosition.col,
        "--grid-col-span": gridPosition.colSpan ?? 1,
        "--grid-row-start": gridPosition.rowStart,
        "--grid-row-end": gridPosition.rowEnd,
      }
    : {};

  // For posterOnly cards: use IntersectionObserver + img.decode() instead of
  // native loading="lazy". Assigns src 500px ahead, decodes off main thread,
  // crossfades from LQIP only after decode completes — no paint jank.
  useEffect(() => {
    if (!posterOnly) return;
    const imgEl = posterImgRef.current;
    if (!imgEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const src = imgEl.dataset.src;
        if (!src) {
          setMediaLoadedDeferred();
          observer.disconnect();
          return;
        }
        imgEl.src = src;
        imgEl
          .decode()
          .then(() => setMediaLoadedDeferred())
          .catch(() => setMediaLoadedDeferred());
        observer.disconnect();
      },
      { rootMargin: "500px", threshold: 0 },
    );

    observer.observe(imgEl);
    return () => observer.disconnect();
  }, [posterOnly, setMediaLoadedDeferred]);

  // Phase 1 — assign video src 800px before viewport so buffering starts early.
  // Phase 2 — request play only when card is actually in view; pause on leave.
  // Both skip entirely when posterOnly (image-only mode) or no video.
  useEffect(() => {
    if (posterOnly || !showVideoBlock || !media?.video) return;
    if (!videoContainerRef.current) return;

    const container = videoContainerRef.current;

    // Phase 1: preload src well ahead of viewport
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (entry.isIntersecting && video?.dataset.src && !video.src) {
            video.src = video.dataset.src;
            video.load();
            preloadObserver.unobserve(container);
          }
        });
      },
      { rootMargin: "800px", threshold: 0 },
    );

    // Phase 2: play/pause based on actual visibility
    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            setVideoInView(true);
            // Autoplay videos when their card is actually in view.
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch(() => {});
            }
            onRequestPlay?.(video, gridPosition?.col ?? 1);
          } else {
            video.pause();
            onNotifyPause?.(video);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.1 },
    );

    preloadObserver.observe(container);
    playObserver.observe(container);

    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [
    posterOnly,
    showVideoBlock,
    media?.video,
    onRequestPlay,
    onNotifyPause,
    gridPosition?.col,
  ]);

  // Defer iframe mount until near viewport. We gate the entire <iframe> element
  // on iframeReady so the browsing context isn't created until needed.
  // The observer target is a plain div (iframeObserverTargetRef) shown before mount.
  useEffect(() => {
    if (!hasIframe) return;
    if (iframeReady) return; // already mounted, nothing to observe
    const target = iframeObserverTargetRef.current;
    if (!target) return;

    const isMobile = window.innerWidth <= 768;
    const rootMargin = isMobile ? "150px" : "250px";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIframeReady(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasIframe, iframeReady]);

  return (
    <div
      className={`
        bento-item group relative overflow-hidden rounded-[8px]
        ${isBlack ? "bg-black border-gray-800" : "bg-white border-gray-200"}
        border
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        ${
          !hasIframe && !disableHover
            ? "hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            : ""
        }
        transition-[box-shadow,transform] duration-300 ease-out
        h-full min-h-[200px]
        ${sizeClasses[size] || ""}
      `}
      style={gridStyle}
      data-grid-col={gridPosition?.col}
      data-grid-col-span={gridPosition?.colSpan ?? 1}
      data-grid-row-start={gridPosition?.rowStart}
      data-grid-row-end={gridPosition?.rowEnd}
      data-size={size}
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* LQIP background — always rendered instantly from the inline base64 string.
          Crossfades to the real media once it's decoded and ready. */}
      {lqip && (
        <div
          className="absolute inset-0 rounded-[8px] overflow-hidden"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <img
            src={lqip}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
            style={{ filter: "blur(12px)", transform: "scale(1.05)" }}
          />
        </div>
      )}

      {/* Fallback skeleton for cards without an lqip yet */}
      {!lqip && hasMedia && (
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none"
          style={{
            opacity: isMediaLoaded ? 0 : 1,
            transition: "opacity 0.4s ease",
            background: isBlack ? "#1a1a1a" : "#e8e8e8",
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      )}

      {/* Real media crossfade overlay — fades in over the LQIP once loaded */}
      {hasMedia && (
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none"
          style={{
            opacity: isMediaLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 2,
          }}
          aria-hidden="true"
        />
      )}

      {/* Video block: poster shown until video is buffered, then swapped */}
      {showVideoBlock && (
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full rounded-[8px] overflow-hidden"
          style={{ zIndex: 3 }}
        >
          {hasPoster && (
            <img
              className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
              src={media.poster}
              alt=""
              decoding="async"
              onLoad={setMediaLoadedDeferred}
              style={{ zIndex: videoInView ? 0 : 1 }}
            />
          )}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
            data-src={media.video}
            loop
            muted
            playsInline
            preload="none"
            onCanPlay={setMediaLoadedDeferred}
            onLoadedData={setMediaLoadedDeferred}
            style={{ zIndex: hasPoster && videoInView ? 1 : 0 }}
          />
        </div>
      )}

      {/* Iframe block: element not mounted until iframeReady (observer fired).
          Before ready, a plain div acts as the observation target. */}
      {!showVideoBlock && hasIframe && (
        <div
          className="absolute inset-0 w-full h-full rounded-[8px]"
          style={{ zIndex: 3 }}
        >
          {iframeReady ? (
            <iframe
              ref={iframeRef}
              className="absolute inset-0 w-full h-full rounded-[8px] border-0"
              src={media.iframe}
              title=""
              onLoad={setMediaLoadedDeferred}
            />
          ) : (
            /* Observation target div — becomes the iframe once in range */
            <div
              ref={iframeObserverTargetRef}
              className="absolute inset-0 rounded-[8px]"
            />
          )}
          {/* Layer above iframe with pointer-events: none so the iframe is interactive immediately.
              Card group-hover still shows tags/actions when cursor is over the iframe. */}
          {iframeReady && (
            <div
              className="absolute inset-0 z-[9] rounded-[8px]"
              style={{ pointerEvents: "none" }}
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Poster-only image (no video element): uses img.decode() via observer above */}
      {!showVideoBlock && !hasIframe && (hasImage || posterOnlyImage) && (
        <img
          ref={posterImgRef}
          className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
          src={media.image || media.thumbnail || media.poster}
          alt=""
          decoding="async"
          onLoad={setMediaLoadedDeferred}
          style={{ zIndex: 3 }}
        />
      )}

      {/* Tag Pills - Bottom Left */}
      <div
        className={`
          absolute bottom-4 left-4 flex flex-wrap gap-2 z-10
          transition-all duration-300
          max-[1025px]:opacity-100 max-[1025px]:translate-y-0
          min-[1026px]:opacity-0 min-[1026px]:translate-y-2
          min-[1026px]:group-hover:opacity-100 min-[1026px]:group-hover:translate-y-0
        `}
      >
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`
              px-3 py-1.5 rounded-[4px]
              text-xs font-medium
              shadow-sm
              transition-all duration-200
              cursor-default
              ${
                isBlack
                  ? "bg-white text-gray-800 border border-gray-200"
                  : "bg-white text-gray-700 border border-gray-300"
              }
            `}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Icons - Top Right */}
      <div
        className={`
          absolute top-4 right-4 flex gap-2 z-10
          transition-all duration-300
          max-[1025px]:opacity-100 max-[1025px]:translate-y-0
          min-[1026px]:opacity-0 min-[1026px]:-translate-y-2
          min-[1026px]:group-hover:opacity-100 min-[1026px]:group-hover:translate-y-0
        `}
      >
        {actions.map((action, index) => {
          const config = actionConfig[action.type];
          if (!config) return null;
          const IconComponent = config.icon;

          return (
            <button
              key={index}
              className={`
                p-2.5 rounded-full
                bg-white shadow-md border border-gray-100
                ${config.color} ${config.hoverBg}
                transition-all duration-200
                hover:scale-110
                cursor-pointer
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (action.url) {
                  window.open(action.url, "_blank", "noopener,noreferrer");
                }
              }}
              title={action.tooltip}
            >
              <IconComponent size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BentoItem;
