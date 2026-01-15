import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Custom hook for letter-by-letter scroll animation
 * @param {Object} options - Animation configuration
 * @param {React.RefObject} options.titleRef - Ref to the title element
 * @param {React.RefObject} options.triggerRef - Ref to the trigger element for ScrollTrigger
 * @param {string} options.start - ScrollTrigger start position (e.g., "top 90%")
 * @param {string} options.end - ScrollTrigger end position (e.g., "top 60%")
 * @param {number} options.scrub - Scrub value for ScrollTrigger (default: 2)
 * @param {Array} options.colorRanges - Array of {start, end, color} objects for character coloring
 * @param {Array} options.fontWeightRanges - Array of {start, end, fontWeight} objects for character font-weight
 */
export const useLetterByLetterAnimation = ({
  titleRef,
  triggerRef,
  start,
  end,
  scrub = 2,
  colorRanges = [],
  fontWeightRanges = [],
}) => {
  useEffect(() => {
    let scrollTrigger;

    // Wait a bit to ensure refs are populated
    const timeoutId = setTimeout(() => {
      if (!titleRef.current || !triggerRef.current) return;

      const titleElement = titleRef.current;
      const text = titleElement.textContent || "";

      // Split text into characters and wrap each in a span
      const chars = text.split("");
      const charSpans = chars.map((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.opacity = "0";
        span.style.display = "inline-block";

        // Apply color based on colorRanges
        let appliedColor = "#fafafa"; // Default color
        for (const range of colorRanges) {
          const inRange =
            i >= range.start &&
            (range.end === undefined || range.end === Infinity || i <= range.end);
          if (inRange) {
            appliedColor = range.color;
            break;
          }
        }
        span.style.color = appliedColor;

        // Apply font-weight based on fontWeightRanges
        for (const range of fontWeightRanges) {
          const inRange =
            i >= range.start &&
            (range.end === undefined || range.end === Infinity || i <= range.end);
          if (inRange) {
            span.style.fontWeight = range.fontWeight;
            break;
          }
        }

        return span;
      });

      // Clear existing content and add character spans
      titleElement.innerHTML = "";
      charSpans.forEach((span) => titleElement.appendChild(span));

      // Force ScrollTrigger refresh
      ScrollTrigger.refresh();

      // Create ScrollTrigger to animate letters
      scrollTrigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start,
        end,
        scrub,
        onUpdate: (self) => {
          // Calculate how many letters should be visible based on progress
          const totalChars = charSpans.length;
          const exactProgress = self.progress * totalChars;
          const visibleCount = Math.floor(exactProgress);
          const nextLetterProgress = exactProgress - visibleCount;

          // Number of upcoming letters to gradually fade in with decreasing opacity
          const fadeInRange = 4;

          charSpans.forEach((span, index) => {
            if (index < visibleCount) {
              // Fully visible letters
              gsap.to(span, {
                opacity: 1,
                duration: 0.2,
                overwrite: "auto",
              });
            } else if (
              index >= visibleCount &&
              index < visibleCount + fadeInRange
            ) {
              // Upcoming letters - gradual fade-in with decreasing opacity
              const distanceFromCurrent = index - visibleCount;

              let opacity = 0;
              if (distanceFromCurrent === 0) {
                opacity = nextLetterProgress;
              } else if (distanceFromCurrent === 1) {
                opacity = nextLetterProgress * 0.6;
              } else if (distanceFromCurrent === 2) {
                opacity = nextLetterProgress * 0.3;
              } else if (distanceFromCurrent === 3) {
                opacity = nextLetterProgress * 0.1;
              }

              opacity = Math.min(1, Math.max(0, opacity));

              gsap.to(span, {
                opacity: opacity,
                duration: 0.2,
                overwrite: "auto",
              });
            } else {
              // Letters not yet reached - fully hidden
              gsap.to(span, {
                opacity: 0,
                duration: 0.2,
                overwrite: "auto",
              });
            }
          });
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, scrub, colorRanges, fontWeightRanges]);
};

