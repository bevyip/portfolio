import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ArrowToOpenToWork = () => {
  const pathRef = useRef(null);
  const markerPathRef = useRef(null);
  const containerRef = useRef(null);
  const [pathData, setPathData] = useState("");
  const [containerHeight, setContainerHeight] = useState("100vh");

  useEffect(() => {
    const calculatePath = () => {
      // Wait a bit for DOM to be ready
      setTimeout(() => {
        const lastParagraph = document.getElementById("last-blurb-paragraph");
        const openToWorkBadge = document.getElementById("open-to-work-badge");

        if (!lastParagraph || !openToWorkBadge || !containerRef.current) return;

        // Get the main element (parent of both sections)
        const mainElement = lastParagraph.closest("main");
        if (!mainElement) return;

        // Get document-relative positions
        const getDocumentTop = (element) => {
          const rect = element.getBoundingClientRect();
          return rect.top + (window.scrollY || window.pageYOffset);
        };

        const getDocumentBottom = (element) => {
          const rect = element.getBoundingClientRect();
          return rect.bottom + (window.scrollY || window.pageYOffset);
        };

        const mainTop = getDocumentTop(mainElement);
        const mainLeft = mainElement.getBoundingClientRect().left;
        const startY = getDocumentBottom(lastParagraph) - mainTop + 25; // Start a bit further away
        const endY = getDocumentTop(openToWorkBadge) - mainTop;
        const mainWidth = mainElement.offsetWidth || mainElement.clientWidth;

        // Get the open-to-work section to constrain arrow height
        const openToWorkSection = document.getElementById(
          "open-to-work-section"
        );
        const sectionBottom = openToWorkSection
          ? getDocumentBottom(openToWorkSection) - mainTop
          : endY + 200; // Fallback if section not found
        // Constrain arrow height to only the space between sections
        const arrowHeight = Math.max(sectionBottom, endY + 100);

        // Get the horizontal position - start from center on both desktop and mobile
        const isMobile = window.innerWidth < 768;
        const startX = mainWidth / 2; // Center on both desktop and mobile

        // End at center (above OPEN TO WORK text)
        const badgeRect = openToWorkBadge.getBoundingClientRect();
        const endX = (badgeRect.left + badgeRect.right) / 2 - mainLeft;
        // On desktop: end higher (lower Y value); on mobile: end a bit earlier
        const endYFinal = isMobile ? endY - 30 : endY - 30; // Higher end point on desktop

        // Create a dramatic curved path
        const midY = startY + (endYFinal - startY) / 2;
        // First control point - curves right on mobile, left on desktop
        const control1X = isMobile
          ? startX + 100 // Curve to the right on mobile
          : startX - 200; // Curve to the left on desktop
        const control1Y = startY + (midY - startY) * (isMobile ? 1 : 1.8); // Smaller multiplier on mobile
        // Second control point - adjust for arrow tip direction
        // On mobile: approach from right so tip faces left
        // On desktop: approach more vertically (closer to endX) so tip points downward
        const control2X = isMobile ? endX + 50 : endX - 20; // Closer to endX on desktop for more vertical approach
        const control2Y = midY;
        const path = `M ${startX},${startY} C ${control1X},${control1Y} ${control2X},${control2Y} ${endX},${endYFinal}`;

        setPathData(path);

        // Update SVG viewBox to only include space between sections, not entire main height
        const svg = containerRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("viewBox", `0 0 ${mainWidth} ${arrowHeight}`);
        }

        // Set container height to match the arrow area
        setContainerHeight(`${arrowHeight}px`);
      }, 100);
    };

    // Calculate path on mount and resize
    calculatePath();
    window.addEventListener("resize", calculatePath);
    ScrollTrigger.addEventListener("refresh", calculatePath);

    return () => {
      window.removeEventListener("resize", calculatePath);
      ScrollTrigger.removeEventListener("refresh", calculatePath);
    };
  }, []);

  useEffect(() => {
    if (!pathRef.current || !markerPathRef.current || !pathData) return;

    const path = pathRef.current;
    const marker = markerPathRef.current;

    const pathLength = path.getTotalLength();

    const initialProgress = 0;
    // Start hidden - fully offset so no path is visible
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength, // Fully hidden at start
      opacity: 0, // Also set opacity to 0 to ensure it's hidden
    });
    gsap.set(marker, {
      opacity: 0,
      scale: 0,
      transformOrigin: "center",
    });

    // Force a refresh to ensure start/end positions are accurate
    ScrollTrigger.refresh();

    // Animation: Draw arrow as user scrolls between sections
    // Extend the end point to make drawing take longer and start earlier
    const aboutSection = document.getElementById("about-me-section");
    const openToWorkSection = document.getElementById("open-to-work-section");
    // let extendedEnd = "top+=300px center"; // Default extension
    let earlierStart = "bottom center"; // Default start

    if (aboutSection && openToWorkSection) {
      const aboutBottom =
        aboutSection.getBoundingClientRect().bottom + window.scrollY;
      const aboutTop =
        aboutSection.getBoundingClientRect().top + window.scrollY;

      // Start 50% earlier - calculate 50% of section height and start before bottom
      const sectionHeight = aboutBottom - aboutTop;
      const earlierOffset = sectionHeight * 0.5;
      earlierStart = `bottom-=${Math.round(earlierOffset)}px center`;
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: "#about-me-section",
      start: earlierStart,
      endTrigger: "#open-to-work-section",
      end: "top center", // Simple end calculation - arrow completes when open-to-work section reaches top center
      scrub: 1,
      onUpdate: (self) => {
        // Progress goes from 0 to 1 as user scrolls
        // Progress can go both ways (forward and backward) with scroll
        const currentProgress = self.progress;

        // Update path drawing - fade in as it starts drawing
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - currentProgress),
          opacity: currentProgress > 0 ? 1 : 0, // Show when progress > 0
        });

        // Show arrowhead when path is nearly complete
        if (currentProgress >= 0.95) {
          gsap.to(marker, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            overwrite: "auto",
          });
        } else {
          gsap.to(marker, {
            opacity: 0,
            scale: 0,
            duration: 0.1,
            overwrite: "auto",
          });
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [pathData]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ height: containerHeight }}
    >
      {pathData && (
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="12"
              refX="11"
              refY="6"
              orient="auto"
            >
              <path
                ref={markerPathRef}
                d="M 0 0 L 12 6 L 0 12"
                fill="none"
                stroke="#fafafa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {/* Simple curved path from about section to open to work section */}
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="#fafafa"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#arrowhead)"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </svg>
      )}
    </div>
  );
};

export default ArrowToOpenToWork;
