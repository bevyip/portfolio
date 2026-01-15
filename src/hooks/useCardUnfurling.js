import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook for creating a scroll-scrubbed card unfurling animation
 * @param {Object} config - Configuration object
 * @param {React.RefObject} config.gridRef - Ref to the grid container
 * @param {React.MutableRefObject<Array>} config.cardRefs - Array ref containing three card refs
 * @param {Object} config.options - Optional configuration
 * @param {number} config.options.peekOffset - Pixels of edge visible in collapsed state (default: 40)
 * @param {string} config.options.start - ScrollTrigger start position (default: "top 70%")
 * @param {string} config.options.end - ScrollTrigger end position (default: "top 20%")
 * @param {number} config.options.minWidth - Minimum width for desktop animation (default: 768)
 * @param {number} config.options.layoutDelay - Delay before calculating positions (default: 100)
 */
export const useCardUnfurling = ({
  gridRef,
  cardRefs,
  options = {},
}) => {
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    const {
      peekOffset = 40,
      start = "top 70%",
      end = "top 20%",
      minWidth = 768,
      layoutDelay = 100,
    } = options;

    const setupUnfurlingAnimation = () => {
      if (!gridRef.current || !cardRefs.current || cardRefs.current.length !== 3) {
        return;
      }

      const card1 = cardRefs.current[0];
      const card2 = cardRefs.current[1]; // Center card
      const card3 = cardRefs.current[2];
      const grid = gridRef.current;

      if (!card1 || !card2 || !card3) {
        return;
      }

      // Check if desktop
      if (window.innerWidth >= minWidth) {
        // Wait for layout to be ready
        setTimeout(() => {
          // Get grid center
          const gridRect = grid.getBoundingClientRect();
          const gridCenterX = gridRect.left + gridRect.width / 2;

          // Get final positions of each card
          const card1Rect = card1.getBoundingClientRect();
          const card2Rect = card2.getBoundingClientRect();
          const card3Rect = card3.getBoundingClientRect();

          // Calculate center points of each card
          const card1CenterX = card1Rect.left + card1Rect.width / 2;
          const card2CenterX = card2Rect.left + card2Rect.width / 2;
          const card3CenterX = card3Rect.left + card3Rect.width / 2;

          // Calculate collapsed state positions
          // All cards should visually appear at card 2's center position with edges peeking out
          const card1CollapsedX = card2CenterX - card1CenterX - peekOffset;
          const card2CollapsedX = 0;
          const card3CollapsedX = card2CenterX - card3CenterX + peekOffset;

          // Store collapsed offsets
          const collapsedOffsets = {
            card1: card1CollapsedX,
            card2: card2CollapsedX,
            card3: card3CollapsedX,
          };

          // Set collapsed state: Card 2 visible at center, cards 1 & 3 fully visible but behind
          const setCollapsedState = () => {
            // Card 1: Fully visible but behind card 2
            gsap.set(card1, {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card1,
            });
            // Card 2: Fully visible at center
            gsap.set(card2, {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card2,
            });
            // Card 3: Fully visible but behind card 2
            gsap.set(card3, {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card3,
            });
            // Set z-index: card 2 on top, cards 1 & 3 behind
            gsap.set(card2, { zIndex: 10, force3D: false });
            gsap.set(card1, { zIndex: 1, force3D: false });
            gsap.set(card3, { zIndex: 1, force3D: false });
          };

          // Set initial collapsed state
          setCollapsedState();

          // Create scroll-scrubbed timeline for unfurling animation
          const unfurlTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: "none" }, // Linear interpolation for smooth scrubbing
          });

          // Cards start from collapsed state (behind card 2) and unfurl outward
          unfurlTimeline.fromTo(
            card1,
            {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card1,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.5, // Takes 50% of the scroll range
            },
            0 // Start immediately
          );

          unfurlTimeline.fromTo(
            card3,
            {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card3,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.5, // Takes 50% of the scroll range
            },
            0 // Start immediately with card1
          );

          // Card 2 stays in place
          unfurlTimeline.fromTo(
            card2,
            {
              opacity: 1,
              scale: 1,
              x: collapsedOffsets.card2,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.3, // Quick animation
            },
            0
          );

          // Reset z-index when fully unfurled (at end of timeline)
          unfurlTimeline.set([card1, card2, card3], { zIndex: "auto" }, 0.95);

          // Ensure timeline starts at progress 0 (collapsed state)
          unfurlTimeline.progress(0);

          // Create scroll-scrubbed trigger
          const trigger = ScrollTrigger.create({
            trigger: grid,
            start: start,
            end: end,
            scrub: true, // Link animation progress directly to scroll position
            animation: unfurlTimeline,
            onUpdate: (self) => {
              // Handle z-index based on scroll progress
              const progress = self.progress;
              if (progress >= 0.95) {
                // Fully unfurled: reset z-index to auto
                gsap.set([card1, card2, card3], {
                  zIndex: "auto",
                  force3D: false,
                });
              } else {
                // During animation or collapsed: maintain z-index order
                gsap.set(card2, { zIndex: 10, force3D: false });
                gsap.set(card1, { zIndex: 1, force3D: false });
                gsap.set(card3, { zIndex: 1, force3D: false });
              }
            },
          });

          scrollTriggersRef.current.push(trigger);
        }, layoutDelay);
      } else {
        // Mobile: no animation, cards display normally
        // Reset any transforms that might have been applied
        cardRefs.current.forEach((ref) => {
          if (ref) {
            gsap.set(ref, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              zIndex: "auto",
            });
          }
        });
      }
    };

    setupUnfurlingAnimation();

    // Cleanup function
    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, [gridRef, cardRefs, options]);
};

