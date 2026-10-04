import { useMemo, useId, useState, useRef, useEffect } from "react";
import "./StickerPeel.css";

const StickerPeel = ({
  imageSrc,
  rotate = 0,
  peelBackHoverPct = 15,
  width = 60,
  shadowIntensity = 0.28,
  peelDirection = 0,
  className = "",
}) => {
  const defaultPadding = 10;
  const uniqueId = useId();
  const dropShadowId = `dropShadow-${uniqueId}`;
  const expandAndFillId = `expandAndFill-${uniqueId}`;

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isPeeledRef = useRef(false);
  const startYRef = useRef(0);
  const hoverPctRef = useRef(peelBackHoverPct);
  const targetPeelRef = useRef(peelBackHoverPct);
  const displayedPeelRef = useRef(peelBackHoverPct);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [peelAmount, setPeelAmount] = useState(peelBackHoverPct);
  const [isPeeled, setIsPeeled] = useState(false);

  const peelThreshold = 80;
  // Exponential follow: fast drags still show the peel instead of jumping.
  const peelFollowMs = 110;

  hoverPctRef.current = peelBackHoverPct;
  isPeeledRef.current = isPeeled;

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const stopPeelFollow = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      lastTsRef.current = 0;
    };

    const resetAfterFall = () => {
      stopPeelFollow();
      setIsPeeled(false);
      isPeeledRef.current = false;
      const hoverPct = hoverPctRef.current;
      targetPeelRef.current = hoverPct;
      displayedPeelRef.current = hoverPct;
      setPeelAmount(hoverPct);
      setIsDragging(false);
      isDraggingRef.current = false;
      startYRef.current = 0;
      container.classList.remove("peeled");
      wrapper.classList.remove("falling");
      wrapper.style.left = "";
      wrapper.style.top = "";
      wrapper.style.width = "";
      wrapper.style.height = "";
      wrapper.classList.add("sticker-reset");
      wrapper.style.opacity = "1";
      wrapper.style.animation = "none";
      void wrapper.offsetHeight;
    };

    const beginPeelFall = () => {
      stopPeelFollow();
      setIsPeeled(true);
      isPeeledRef.current = true;
      container.classList.add("peeled");

      setTimeout(() => {
        const rect = wrapper.getBoundingClientRect();
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.top = `${rect.top}px`;
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height}px`;
        wrapper.classList.add("falling");
      }, 500);

      setTimeout(resetAfterFall, 1200);
    };

    const peelFromDrag = (clientY) => {
      const rect = container.getBoundingClientRect();
      const dragDistance = clientY - startYRef.current;
      const hoverPct = hoverPctRef.current;

      if (dragDistance < 0) return hoverPct;

      const maxDrag = rect.height * 0.8;
      const additional = (dragDistance / maxDrag) * (100 - hoverPct);
      return Math.min(100, hoverPct + Math.max(0, additional));
    };

    const tickPeelFollow = (ts) => {
      if (!isDraggingRef.current || isPeeledRef.current) {
        rafRef.current = 0;
        return;
      }

      const last = lastTsRef.current || ts;
      lastTsRef.current = ts;
      const dt = Math.min(48, ts - last);
      const alpha = 1 - Math.exp(-dt / peelFollowMs);
      const target = targetPeelRef.current;
      let displayed = displayedPeelRef.current;
      displayed += (target - displayed) * alpha;
      if (Math.abs(target - displayed) < 0.2) displayed = target;
      displayedPeelRef.current = displayed;
      setPeelAmount(displayed);

      if (displayed >= peelThreshold) {
        beginPeelFall();
        return;
      }

      rafRef.current = requestAnimationFrame(tickPeelFollow);
    };

    const ensurePeelFollow = () => {
      if (!rafRef.current) {
        lastTsRef.current = 0;
        rafRef.current = requestAnimationFrame(tickPeelFollow);
      }
    };

    const clearResetAnimation = () => {
      if (wrapper.classList.contains("sticker-reset")) {
        wrapper.classList.remove("sticker-reset");
        wrapper.style.animation = "";
      }
    };

    const handlePointerDown = (clientY) => {
      if (isPeeledRef.current) return;
      clearResetAnimation();
      const hoverPct = hoverPctRef.current;
      isDraggingRef.current = true;
      startYRef.current = clientY;
      targetPeelRef.current = hoverPct;
      displayedPeelRef.current = hoverPct;
      setPeelAmount(hoverPct);
      setIsDragging(true);
    };

    const handlePointerMove = (clientY) => {
      if (!isDraggingRef.current || isPeeledRef.current) return;
      targetPeelRef.current = peelFromDrag(clientY);
      ensurePeelFollow();
    };

    const handlePointerUp = () => {
      stopPeelFollow();
      if (isDraggingRef.current && !isPeeledRef.current) {
        const hoverPct = hoverPctRef.current;
        targetPeelRef.current = hoverPct;
        displayedPeelRef.current = hoverPct;
        setPeelAmount(hoverPct);
      }
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    const handleMouseDown = (e) => {
      handlePointerDown(e.clientY);
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      handlePointerMove(e.clientY);
    };

    const handleTouchStart = (e) => {
      handlePointerDown(e.touches[0].clientY);
      container.classList.add("touch-active");
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || isPeeledRef.current) return;
      e.preventDefault();
      handlePointerMove(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      handlePointerUp();
      container.classList.remove("touch-active");
    };

    wrapper.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handlePointerUp);
    wrapper.addEventListener("touchstart", handleTouchStart);
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd);
    wrapper.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      stopPeelFollow();
      wrapper.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handlePointerUp);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [peelThreshold, peelFollowMs]);

  const cssVars = useMemo(
    () => ({
      "--sticker-rotate": `${rotate}deg`,
      "--sticker-p": `${defaultPadding}px`,
      "--sticker-peelback-hover": `${peelBackHoverPct}%`,
      "--sticker-peelback-drag": `${peelAmount}%`,
      "--sticker-width": `${width}px`,
      "--sticker-shadow-opacity": shadowIntensity,
      "--peel-direction": `${peelDirection}deg`,
    }),
    [
      rotate,
      peelBackHoverPct,
      peelAmount,
      width,
      shadowIntensity,
      peelDirection,
    ],
  );

  const containerClassName = [
    "sticker-container",
    isDragging && !isPeeled ? "dragging" : "",
    isPeeled ? "peeled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`sticker-peel-wrapper ${className}`}
      style={cssVars}
      ref={wrapperRef}
    >
      <svg width="0" height="0">
        <defs>
          <filter id={dropShadowId}>
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id={expandAndFillId}>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className={containerClassName} ref={containerRef}>
        <div
          className="sticker-main"
          style={{ filter: `url(#${dropShadowId})` }}
        >
          <img
            src={imageSrc}
            alt=""
            className="sticker-image"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div className="flap">
          <img
            src={imageSrc}
            alt=""
            className="flap-image"
            style={{ filter: `url(#${expandAndFillId})` }}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
};

export default StickerPeel;
