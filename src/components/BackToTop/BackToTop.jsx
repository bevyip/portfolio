import React, { useState, useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import "./BackToTop.css";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const checkScrollPosition = () => {
      let scrollPosition = 0;

      if (lenis) {
        // Use Lenis scroll position if available
        scrollPosition = lenis.scroll;
      } else {
        // Fallback to window scroll position
        scrollPosition = window.scrollY || document.documentElement.scrollTop;
      }

      setIsVisible(scrollPosition > 300);
    };

    // Initial check
    checkScrollPosition();

    // Listen to Lenis scroll events if available
    if (lenis) {
      lenis.on("scroll", checkScrollPosition);
    } else {
      // Fallback to window scroll events
      window.addEventListener("scroll", checkScrollPosition);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", checkScrollPosition);
      } else {
        window.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [lenis]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      className={`back-to-top-button ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg
        className="chevron-up"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 10L8 6L4 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="square"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
