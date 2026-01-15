import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Global flag to track if animations should be enabled
let animationsEnabled = false;
const triggerQueue = new Set();

/**
 * Hook that delays page animations by 2 seconds after navigation
 * This ensures the page background appears first, then animations begin
 */
export const usePageAnimationDelay = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reset ready state when pathname changes
    setIsReady(false);
    animationsEnabled = false;
    triggerQueue.clear();

    // Disable all existing ScrollTriggers immediately on page load
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.disable();
      triggerQueue.add(trigger);
    });

    // Periodically check for new ScrollTriggers and disable them
    intervalRef.current = setInterval(() => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (!animationsEnabled) {
          trigger.disable();
          triggerQueue.add(trigger);
        }
      });
    }, 50);

    // After 2 seconds, enable ScrollTriggers and mark as ready for animations
    const timer = setTimeout(() => {
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Enable all ScrollTriggers
      animationsEnabled = true;
      triggerQueue.forEach((trigger) => {
        if (trigger && !trigger.killed) {
          trigger.enable();
        }
      });
      triggerQueue.clear();

      // Also enable any triggers that were created after we started tracking
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable());

      // Refresh to recalculate positions
      ScrollTrigger.refresh();

      // Add class to body to enable CSS animations
      document.body.classList.add("animations-ready");

      setIsReady(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Remove class on cleanup
      document.body.classList.remove("animations-ready");
    };
  }, [location.pathname]);

  return isReady;
};
