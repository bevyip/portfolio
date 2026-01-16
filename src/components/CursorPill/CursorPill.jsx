import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./CursorPill.css";

const CursorPill = ({ isHovering, text = "View case study" }) => {
  const cursorPillRef = useRef(null);

  // Custom cursor pill effect for desktop only
  useEffect(() => {
    // Only enable on desktop (devices that support hover)
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;

    const cursorPill = cursorPillRef.current;
    const cursorPillText = cursorPill?.querySelector(".cursor-pill-text");
    if (!cursorPill || !cursorPillText) return;

    const handleMouseMove = (e) => {
      // Position pill to the right of cursor
      // CSS transform: translateY(-50%) handles vertical centering
      const offsetX = 20;
      cursorPill.style.left = `${e.clientX + offsetX}px`;
      cursorPill.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Animate cursor pill width on hover
  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;

    const cursorPill = cursorPillRef.current;
    const cursorPillText = cursorPill?.querySelector(".cursor-pill-text");
    if (!cursorPill || !cursorPillText) return;

    if (isHovering) {
      // Show the pill container
      cursorPill.style.display = "block";

      // First, set width to auto to get the natural width, then animate from 0
      cursorPillText.style.width = "auto";
      const fullWidth = cursorPillText.offsetWidth;
      cursorPillText.style.width = "0px";

      // Expand: animate from 0 to full width
      gsap.to(cursorPillText, {
        width: fullWidth,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      // Collapse: animate to 0 width
      gsap.to(cursorPillText, {
        width: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          // Hide the pill container after animation completes
          cursorPill.style.display = "none";
        },
      });
    }
  }, [isHovering]);

  return (
    <div ref={cursorPillRef} className="cursor-pill">
      <span className="cursor-pill-text">{text}</span>
    </div>
  );
};

export default CursorPill;
