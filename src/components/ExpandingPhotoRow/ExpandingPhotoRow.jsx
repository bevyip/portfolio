import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import img0 from "../../assets/img/about-pictures/0.png";
import img1 from "../../assets/img/about-pictures/1.png";
import img2 from "../../assets/img/about-pictures/2.png";
import img3 from "../../assets/img/about-pictures/3.png";
import img4 from "../../assets/img/about-pictures/4.png";
import img5 from "../../assets/img/about-pictures/5.png";
import img6 from "../../assets/img/about-pictures/6.png";
import img7 from "../../assets/img/about-pictures/7.png";
import img8 from "../../assets/img/about-pictures/8.png";
import img9 from "../../assets/img/about-pictures/9.png";
import img10 from "../../assets/img/about-pictures/10.png";
import "./ExpandingPhotoRow.css";

const images = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const cardW = 200;
const gap = 8;
const slotW = cardW + gap; // 208
const rowW = 11 * cardW + 10 * gap; // 2280 — same in both states so x is one coordinate system
const ROW_HEIGHT = 260;
const cy = ROW_HEIGHT / 2 - cardW / 2; // 30

// Collapsed trio: center card must match expanded position (5 * slotW) so it doesn't jump; left/right symmetric around it
const collapsedCenter = 5 * slotW; // same as expanded index 5 (middle of 11)
const collapsedFanOffset = Math.round(110 * (cardW / 180)); // ~122 for 200px — spacing for fan
const collapsedLeft = collapsedCenter - collapsedFanOffset;
const collapsedRight = collapsedCenter + collapsedFanOffset;
const centerX = -rowW / 2;

function getCollapsedStyle(index) {
  if (index === 4) return { opacity: 1, scale: 1, x: collapsedLeft, y: cy, rotateZ: -12, zIndex: 2 };
  if (index === 5) return { opacity: 1, scale: 1, x: collapsedCenter, y: cy, rotateZ: 0, zIndex: 3 };
  if (index === 6) return { opacity: 1, scale: 1, x: collapsedRight, y: cy, rotateZ: 12, zIndex: 2 };
  return { opacity: 0, scale: 1, x: collapsedCenter, y: cy, rotateZ: 0, zIndex: 1 };
}

function getExpandedStyle(index) {
  const zIndex = index === 5 ? 3 : index === 4 || index === 6 ? 2 : 1;
  return { opacity: 1, scale: 1, x: index * slotW, y: cy, rotateZ: 0, zIndex };
}

// Fade-out in place: same x,y as expanded, only opacity → 0
function getFadingOutStyle(index) {
  return { opacity: 0, scale: 1, x: index * slotW, y: cy, rotateZ: 0, zIndex: 1 };
}

const FADE_OUT_MS = 400;

function ExpandingPhotoRow() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const fadeOutTimeoutRef = useRef(null);
  const breakoutRef = useRef(null);
  const rowX = useMotionValue(centerX);

  const handleMouseLeave = () => {
    if (isHovered) {
      animate(rowX, centerX, { type: "tween", duration: 0.35, ease: "easeInOut" });
      setIsHovered(false);
      setIsFadingOut(true);
    }
  };

  useEffect(() => {
    if (!isFadingOut) return;
    fadeOutTimeoutRef.current = setTimeout(() => setIsFadingOut(false), FADE_OUT_MS);
    return () => {
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
    };
  }, [isFadingOut]);

  useEffect(() => {
    if (!isHovered) return;
    const measure = () => {
      if (!breakoutRef.current) return;
      const w = breakoutRef.current.offsetWidth;
      const halfRange = w < rowW ? (rowW - w) / 2 : 0;
      setDragConstraints({ left: centerX - halfRange, right: centerX + halfRange });
    };
    measure();
    if (!breakoutRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(breakoutRef.current);
    return () => ro.disconnect();
  }, [isHovered]);

  const getStyle = (index) => {
    if (isHovered) return getExpandedStyle(index);
    if (isFadingOut && index !== 4 && index !== 5 && index !== 6) return getFadingOutStyle(index);
    return getCollapsedStyle(index);
  };

  const getTransition = (index) => {
    const isSkewedCard = index === 4 || index === 6;
    if (isSkewedCard) {
      return { type: "tween", ease: "easeInOut", duration: 0.35 };
    }
    // Fading out in place: only opacity, no move
    if (isFadingOut) {
      return {
        opacity: { type: "tween", ease: "easeInOut", duration: FADE_OUT_MS / 1000 },
        x: { duration: 0 },
        y: { duration: 0 },
        rotateZ: { duration: 0 },
        scale: { duration: 0 },
      };
    }
    // Collapsed: snap. Expanding: snap position, fade opacity
    if (!isHovered) {
      return { type: "tween", ease: "easeInOut", duration: 0.35 };
    }
    return {
      opacity: { type: "tween", ease: "easeInOut", duration: 0.4 },
      x: { duration: 0 },
      y: { duration: 0 },
      rotateZ: { duration: 0 },
      scale: { duration: 0 },
    };
  };

  return (
    <div className="expanding-photo-row-section">
      <div
        className="expanding-photo-row-wrapper"
        style={{ position: "relative", height: ROW_HEIGHT, width: "100%" }}
      >
        <div ref={breakoutRef} className="expanding-photo-row-breakout">
          <div className="expanding-photo-row-inner">
            <motion.div
              className={isHovered ? "row-expanded row-expanded-draggable" : "row-collapsed"}
              style={{ x: rowX, z: 0 }}
              drag={isHovered ? "x" : false}
              dragConstraints={isHovered ? dragConstraints : undefined}
              dragElastic={isHovered ? 0.1 : 0}
              dragMomentum={isHovered}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <div
                className={`expanding-photo-row-hitarea ${isHovered ? "expanding-photo-row-hitarea--expanded" : ""} ${isDragging ? "expanding-photo-row-hitarea--dragging" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                aria-hidden
              />
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  className="card-base card-absolute"
                  initial={false}
                  animate={getStyle(index)}
                  transition={getTransition(index)}
                >
                  <img src={src} alt="" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <p className="expanding-photo-row-hint">Hover/ Tap Me!</p>
    </div>
  );
}

export default ExpandingPhotoRow;
