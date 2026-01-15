import React, { useState, useRef } from "react";
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

const BentoItem = ({ project, onClick, gridPosition }) => {
  const { id, theme = "white", tags, actions, size, media } = project;
  const [isTapped, setIsTapped] = useState(false);
  const iframeRef = useRef(null);

  const isBlack = theme === "black";
  const hasVideo = media?.video;
  const hasImage = media?.image || media?.thumbnail;
  const hasIframe = media?.iframe;
  const disableHover = id === "ball-slide";

  const handleCardClick = (e) => {
    // Toggle tapped state on mobile for all items
    setIsTapped((prev) => !prev);
    if (!hasIframe) {
      onClick?.(project);
    }
  };

  const handleIframeClick = (e) => {
    // Stop propagation so parent onClick doesn't fire
    e.stopPropagation();
    // Focus the iframe to activate it for mouse interactions
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  const handleIframeMouseEnter = () => {
    // Focus the iframe when mouse enters to enable immediate mouse tracking
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  // Set CSS custom properties for grid positioning
  const gridStyle = gridPosition
    ? {
        "--grid-col": gridPosition.col,
        "--grid-row-start": gridPosition.rowStart,
        "--grid-row-end": gridPosition.rowEnd,
      }
    : {};

  return (
    <div
      className={`
        bento-item group relative overflow-hidden rounded-lg
        ${isBlack ? "bg-black border-gray-800" : "bg-white border-gray-200"}
        border
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        ${
          !hasIframe && !disableHover
            ? "hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            : ""
        }
        transition-all duration-300 ease-out
        h-full min-h-[200px]
        ${sizeClasses[size] || ""}
      `}
      style={gridStyle}
      data-grid-col={gridPosition?.col}
      data-grid-row-start={gridPosition?.rowStart}
      data-grid-row-end={gridPosition?.rowEnd}
      onClick={handleCardClick}
    >
      {/* Video Background */}
      {hasVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          src={media.video}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Iframe Background (interactive) */}
      {!hasVideo && hasIframe && (
        <div
          className="absolute inset-0 w-full h-full rounded-lg"
          onClick={handleIframeClick}
          onMouseDown={handleIframeClick}
          onMouseEnter={handleIframeMouseEnter}
        >
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full rounded-lg border-0"
            src={media.iframe}
            title=""
            loading="lazy"
          />
        </div>
      )}

      {/* Image Background (fallback if no video or iframe) */}
      {!hasVideo && !hasIframe && hasImage && (
        <img
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          src={media.image || media.thumbnail}
          alt=""
        />
      )}

      {/* Tag Pills - Bottom Left (always visible on mobile, hover on desktop) */}
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
              px-3 py-1.5 rounded-full
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

      {/* Action Icons - Top Right (always visible on mobile, hover on desktop) */}
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
