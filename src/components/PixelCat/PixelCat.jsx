import { useState, useEffect, useRef, useCallback } from "react";
const idleGif = "/pixel-cat/idle.gif";
const runGif = "/pixel-cat/run.gif";
const lickingGif = "/pixel-cat/licking.gif";
const playingGif = "/pixel-cat/playing.gif";
const loafGif = "/pixel-cat/loaf.gif";
import "./PixelCat.css";

const CAT_SIZE = 64;
const SCALED_SIZE = 128;
const CAT_SPEED = 3;
const LICK_INTERVAL_MIN = 8000;
const LICK_INTERVAL_MAX = 20000;
const PLAY_INTERVAL_MIN = 12000;
const PLAY_INTERVAL_MAX = 28000;
const LOAF_INTERVAL_MIN = 10000;
const LOAF_INTERVAL_MAX = 22000;
const LICK_DURATION = 2167;
const PLAY_DURATION = 3286;
const LOAF_DURATION = 6000;
const RUN_ARRIVAL_THRESHOLD = 4;
/** First lick / play / loaf after mount: random delay in this range (ms) so idle holds longer on load */
const INITIAL_STATE_DELAY_MIN = 5000;
const INITIAL_STATE_DELAY_MAX = 10000;

export default function PixelCat() {
  const containerRef = useRef(null);
  const [catPos, setCatPos] = useState(0); // x position in px from left, constrained by container
  const [state, setState] = useState("idle"); // idle | run | licking | playing | loaf
  const [facingLeft, setFacingLeft] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [cursorPings, setCursorPings] = useState([]);

  const targetXRef = useRef(null); // when set, cat runs to this x (left edge) then goes idle
  const mousePos = useRef({ x: -9999, y: -9999 });
  const containerRect = useRef({ left: 0, width: 0 });
  const catPosRef = useRef(catPos);
  const stateRef = useRef(state);
  const animFrameRef = useRef(null);
  const lickTimerRef = useRef(null);
  const playTimerRef = useRef(null);
  const loafTimerRef = useRef(null);
  const interactionLockedRef = useRef(false);
  const lastIdleFacingRef = useRef(null);
  const initialPositionSetRef = useRef(false);
  const firstLickRef = useRef(true);
  const firstPlayRef = useRef(true);
  const firstLoafRef = useRef(true);

  catPosRef.current = catPos;
  stateRef.current = state;

  // Update container rect for tap-to-run position
  const updateRect = useCallback(() => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      containerRect.current = { left: r.left, top: r.top, width: r.width };
    }
  }, []);

  useEffect(() => {
    const setInitialCenter = () => {
      updateRect();
      if (containerRect.current.width > 0 && !initialPositionSetRef.current) {
        const centerX = (containerRect.current.width - CAT_SIZE) / 2;
        setCatPos(Math.max(0, centerX));
        initialPositionSetRef.current = true;
      }
    };
    setInitialCenter();
    const ro = new ResizeObserver(setInitialCenter);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateRect]);

  // Schedule random licking (only when idle, don't interrupt run or click)
  const scheduleLick = useCallback(() => {
    const delay = firstLickRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : LICK_INTERVAL_MIN +
        Math.random() * (LICK_INTERVAL_MAX - LICK_INTERVAL_MIN);
    if (firstLickRef.current) firstLickRef.current = false;
    lickTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("licking");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          scheduleLick();
        }, LICK_DURATION);
      } else {
        scheduleLick();
      }
    }, delay);
  }, []);

  // Schedule random playing (only when idle, like licking)
  const schedulePlay = useCallback(() => {
    const delay = firstPlayRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : PLAY_INTERVAL_MIN +
        Math.random() * (PLAY_INTERVAL_MAX - PLAY_INTERVAL_MIN);
    if (firstPlayRef.current) firstPlayRef.current = false;
    playTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("playing");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          schedulePlay();
        }, PLAY_DURATION);
      } else {
        schedulePlay();
      }
    }, delay);
  }, []);

  // Schedule random loaf (only when idle, like licking/playing)
  const scheduleLoaf = useCallback(() => {
    const delay = firstLoafRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : LOAF_INTERVAL_MIN +
        Math.random() * (LOAF_INTERVAL_MAX - LOAF_INTERVAL_MIN);
    if (firstLoafRef.current) firstLoafRef.current = false;
    loafTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("loaf");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          scheduleLoaf();
        }, LOAF_DURATION);
      } else {
        scheduleLoaf();
      }
    }, delay);
  }, []);

  useEffect(() => {
    scheduleLick();
    return () => clearTimeout(lickTimerRef.current);
  }, [scheduleLick]);

  useEffect(() => {
    schedulePlay();
    return () => clearTimeout(playTimerRef.current);
  }, [schedulePlay]);

  useEffect(() => {
    scheduleLoaf();
    return () => clearTimeout(loafTimerRef.current);
  }, [scheduleLoaf]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop: run toward targetX when set; when idle, face cursor left/right (no movement)
  useEffect(() => {
    const loop = () => {
      updateRect();
      const rect = containerRect.current;
      const targetX = targetXRef.current;
      const current = catPosRef.current;
      const catCenterX = current + CAT_SIZE / 2;

      if (targetX != null && !interactionLockedRef.current) {
        const dx = targetX - current;
        const dist = Math.abs(dx);

        if (dist <= RUN_ARRIVAL_THRESHOLD) {
          setCatPos(targetX);
          setState("idle");
          targetXRef.current = null;
        } else {
          const step = dx > 0 ? CAT_SPEED : -CAT_SPEED;
          const maxX = Math.max(0, rect.width - SCALED_SIZE);
          const newX = Math.max(0, Math.min(maxX, current + step));
          setCatPos(newX);
          setState("run");
          setFacingLeft(dx < 0);
        }
      } else if (stateRef.current === "idle") {
        const mouseLocalX = mousePos.current.x - rect.left;
        const faceLeft = mouseLocalX < catCenterX;
        if (lastIdleFacingRef.current !== faceLeft) {
          lastIdleFacingRef.current = faceLeft;
          setFacingLeft(faceLeft);
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [updateRect]);

  const getTapPosition = (e) => {
    let clientX = 0,
      clientY = 0;
    if (e.clientX != null && e.clientY != null) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      const t = e.changedTouches && e.changedTouches[0];
      if (t) {
        clientX = t.clientX;
        clientY = t.clientY;
      }
    }
    return { clientX, clientY };
  };

  const showCursorAtTap = (e) => {
    updateRect();
    const rect = containerRect.current;
    const { clientX, clientY } = getTapPosition(e);
    const localX = clientX - rect.left;
    const localY = clientY - (rect.top ?? 0);
    const catCenterX = catPosRef.current + CAT_SIZE / 2;
    const tapIsRightOfCat = localX > catCenterX;
    const id = Date.now();
    setCursorPings((prev) => [
      ...prev,
      { id, x: localX, y: localY, flip: tapIsRightOfCat },
    ]);
    setTimeout(() => {
      setCursorPings((p) => p.filter((c) => c.id !== id));
    }, 800);
  };

  const CURSOR_PING_SIZE = 48; /* 2x scale for cursor.png */

  const handleContainerTap = (e) => {
    showCursorAtTap(e);
    if (interactionLockedRef.current) return;
    if (e.target.closest && e.target.closest(".pixel-cat-sprite")) {
      handlePetClick();
      return;
    }
    updateRect();
    const rect = containerRect.current;
    const { clientX } = getTapPosition(e);
    const localX = clientX - rect.left;
    const catLeft = localX - CAT_SIZE / 2;
    const maxX = Math.max(0, rect.width - SCALED_SIZE);
    const clamped = Math.max(0, Math.min(maxX, catLeft));
    targetXRef.current = clamped;
    setState("run");
    setFacingLeft(clamped < catPosRef.current);
  };

  const handlePetClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const catCenterX = catPosRef.current + CAT_SIZE / 2;

    // Clicking the cat only shows hearts; play/loaf/lick happen on random timers only
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, { id, x: catCenterX }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1100);
  };

  const handleContainerClick = (e) => {
    handleContainerTap(e);
  };

  const handleContainerTouchEnd = (e) => {
    handleContainerTap(e);
  };

  const gifMap = {
    idle: idleGif,
    run: runGif,
    licking: lickingGif,
    playing: playingGif,
    loaf: loafGif,
  };

  return (
    <div
      ref={containerRef}
      className="pixel-cat-scene"
      onClick={handleContainerClick}
      onTouchEnd={handleContainerTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleContainerTap(e);
        }
      }}
      aria-label="Pixel cat: tap to move cat, tap cat to pet"
    >
      {floatingHearts.map((h) => (
        <img
          key={h.id}
          src="/pixel-cat/pixel-heart.png"
          alt=""
          className="pixel-cat-floating-heart"
          style={{
            left: h.x,
            width: 24,
            height: 24,
          }}
          draggable={false}
        />
      ))}

      {cursorPings.map((c) => (
        <img
          key={c.id}
          src="/pixel-cat/cursor.png"
          alt=""
          className={`pixel-cat-cursor-ping${c.flip ? " pixel-cat-cursor-ping-flip" : ""}`}
          style={{
            left: c.x - CURSOR_PING_SIZE / 2,
            top: c.y - CURSOR_PING_SIZE / 2,
            width: CURSOR_PING_SIZE,
            height: CURSOR_PING_SIZE,
          }}
          draggable={false}
        />
      ))}

      <img
        src={gifMap[state]}
        alt="pixel cat"
        className="pixel-cat-sprite"
        style={{
          left: catPos,
          transform: facingLeft ? "scale(2) scaleX(-1)" : "scale(2) scaleX(1)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handlePetClick(e);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handlePetClick(e);
        }}
        draggable={false}
      />
    </div>
  );
}
