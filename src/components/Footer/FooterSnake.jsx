import { useCallback, useEffect, useRef, useState } from "react";
import CursorPill from "../CursorPill/CursorPill";
import {
  createInitialGameState,
  GRID_PRESETS,
  queueDirection,
  startGame,
  stepGame,
} from "./useSnakeGame";
import "./FooterSnake.css";

const COMPACT_BREAKPOINT = "(max-width: 480px)";

const COLORS = {
  background: "#1a1a1a",
  snake: "#9bbc0f",
  food: "#f5f5f5",
};

const CELL_GAP_RATIO = 0.04;
const PIXEL_CORNER_RADIUS_RATIO = 0.18;
const FOOD_DOT_RADIUS_RATIO = 0.13;
const FOOD_DIAMOND_SPREAD_RATIO = 0.24;
const SNAKE_EYE_RADIUS_RATIO = 0.14;
const GRID_LINE_RGB = "245, 245, 245";
const GRID_LINE_MAX_ALPHA = 0.07;
const GRID_LINES_ENABLED = true;

function strokeGridLine(ctx, x1, y1, x2, y2, alpha) {
  if (alpha <= 0.006) return;
  ctx.strokeStyle = `rgba(${GRID_LINE_RGB}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function lineX(col, cellSize, gridCols) {
  if (col <= 0) return 0.5;
  if (col >= gridCols) return gridCols * cellSize - 0.5;
  return col * cellSize + 0.5;
}

function lineY(row, cellSize, gridRows) {
  if (row <= 0) return 0.5;
  if (row >= gridRows) return gridRows * cellSize - 0.5;
  return row * cellSize + 0.5;
}

function drawGrid(ctx, cellSize, gridCols, gridRows) {
  ctx.lineWidth = 0.35;
  ctx.lineCap = "butt";

  for (let row = 0; row <= gridRows; row += 1) {
    const y = lineY(row, cellSize, gridRows);
    for (let col = 0; col < gridCols; col += 1) {
      const x1 = lineX(col, cellSize, gridCols);
      const x2 = lineX(col + 1, cellSize, gridCols);
      strokeGridLine(ctx, x1, y, x2, y, GRID_LINE_MAX_ALPHA);
    }
  }

  for (let col = 0; col <= gridCols; col += 1) {
    const x = lineX(col, cellSize, gridCols);
    for (let row = 0; row < gridRows; row += 1) {
      const y1 = lineY(row, cellSize, gridRows);
      const y2 = lineY(row + 1, cellSize, gridRows);
      strokeGridLine(ctx, x, y1, x, y2, GRID_LINE_MAX_ALPHA);
    }
  }
}

function getCellMetrics(cellSize) {
  const gap = Math.max(0.5, cellSize * CELL_GAP_RATIO);
  const pixel = Math.max(1, cellSize - gap);
  const inset = gap / 2;
  return { gap, pixel, inset };
}

function drawPixel(ctx, col, row, cellSize, color) {
  const { pixel, inset } = getCellMetrics(cellSize);
  const x = col * cellSize + inset;
  const y = row * cellSize + inset;
  const radius = Math.min(pixel * PIXEL_CORNER_RADIUS_RATIO, pixel / 2);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, pixel, pixel, radius);
  ctx.fill();
}

function drawSnakeEyes(ctx, col, row, cellSize, direction) {
  const { pixel, inset } = getCellMetrics(cellSize);
  const x = col * cellSize + inset;
  const y = row * cellSize + inset;
  const eyeRadius = Math.max(0.5, pixel * SNAKE_EYE_RADIUS_RATIO);
  const tipInset = pixel * 0.22;
  const spread = pixel * 0.22;

  let eyePositions;

  if (direction.x === 1) {
    const tipX = x + pixel - tipInset;
    eyePositions = [
      [tipX, y + spread],
      [tipX, y + pixel - spread],
    ];
  } else if (direction.x === -1) {
    const tipX = x + tipInset;
    eyePositions = [
      [tipX, y + spread],
      [tipX, y + pixel - spread],
    ];
  } else if (direction.y === -1) {
    const tipY = y + tipInset;
    eyePositions = [
      [x + spread, tipY],
      [x + pixel - spread, tipY],
    ];
  } else {
    const tipY = y + pixel - tipInset;
    eyePositions = [
      [x + spread, tipY],
      [x + pixel - spread, tipY],
    ];
  }

  ctx.fillStyle = COLORS.background;
  eyePositions.forEach(([eyeX, eyeY]) => {
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFood(ctx, col, row, cellSize, color) {
  const { pixel } = getCellMetrics(cellSize);
  const centerX = col * cellSize + cellSize / 2;
  const centerY = row * cellSize + cellSize / 2;
  const spread = pixel * FOOD_DIAMOND_SPREAD_RATIO;
  const dotRadius = Math.max(0.75, pixel * FOOD_DOT_RADIUS_RATIO);

  ctx.fillStyle = color;
  [
    [0, -spread],
    [spread, 0],
    [0, spread],
    [-spread, 0],
  ].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(centerX + dx, centerY + dy, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGame(ctx, game, cellSize, grid) {
  const { cols, rows } = grid;
  const width = cols * cellSize;
  const height = rows * cellSize;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);

  if (GRID_LINES_ENABLED) {
    drawGrid(ctx, cellSize, cols, rows);
  }

  const direction = game.pendingDirection ?? game.direction;

  game.snake.forEach((segment, index) => {
    drawPixel(ctx, segment.x, segment.y, cellSize, COLORS.snake);
    if (index === 0) {
      drawSnakeEyes(ctx, segment.x, segment.y, cellSize, direction);
    }
  });

  if (game.food) {
    drawFood(ctx, game.food.x, game.food.y, cellSize, COLORS.food);
  }
}
const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

const DIRECTION_CONTROLS = [
  {
    direction: "up",
    className: "footer-snake__control--up",
    label: "Move up",
    symbol: "↑",
  },
  {
    direction: "left",
    className: "footer-snake__control--left",
    label: "Move left",
    symbol: "←",
  },
  {
    direction: "down",
    className: "footer-snake__control--down",
    label: "Move down",
    symbol: "↓",
  },
  {
    direction: "right",
    className: "footer-snake__control--right",
    label: "Move right",
    symbol: "→",
  },
];

export default function FooterSnake() {
  const gameShellRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const playAreaRef = useRef(null);
  const [gridPreset, setGridPreset] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia(COMPACT_BREAKPOINT).matches
      ? "compact"
      : "default",
  );
  const gridConfig = GRID_PRESETS[gridPreset];
  const gridConfigRef = useRef(gridConfig);
  const gameRef = useRef(createInitialGameState(gridConfig));
  const tickRef = useRef(null);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const isDesktopInputRef = useRef(false);

  const [uiState, setUiState] = useState(() => ({
    status: gameRef.current.status,
    score: gameRef.current.score,
  }));
  const [activeDirection, setActiveDirection] = useState(null);
  const [isHoveringPlayArea, setIsHoveringPlayArea] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const syncUi = useCallback((game) => {
    setUiState({ status: game.status, score: game.score });
  }, []);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const canvasWrap = canvasWrapRef.current;
    if (!canvas || !canvasWrap) return;

    const grid = gridConfigRef.current;
    const rect = canvasWrap.getBoundingClientRect();
    const viewWidth = Math.max(rect.width, 1);
    const viewHeight = Math.max(rect.height, 1);
    const isPortraitGrid = grid.rows > grid.cols;

    let cellSize;
    let drawWidth;
    let drawHeight;
    let offsetX = 0;
    let offsetY = 0;
    let bufferWidth;
    let bufferHeight;

    if (isPortraitGrid) {
      cellSize = viewHeight / grid.rows;
      drawHeight = viewHeight;
      drawWidth = grid.cols * cellSize;
      offsetX = (viewWidth - drawWidth) / 2;
      bufferWidth = viewWidth;
      bufferHeight = viewHeight;
    } else {
      cellSize = viewWidth / grid.cols;
      drawWidth = viewWidth;
      drawHeight = grid.rows * cellSize;
      bufferWidth = drawWidth;
      bufferHeight = drawHeight;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bufferWidth * dpr);
    canvas.height = Math.round(bufferHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, bufferWidth, bufferHeight);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    drawGame(ctx, gameRef.current, cellSize, grid);
    ctx.restore();
  }, []);

  const stopLoop = useCallback(() => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (tickRef.current || reducedMotionRef.current) return;

    tickRef.current = window.setInterval(() => {
      if (!isVisibleRef.current || gameRef.current.status !== "playing") return;

      const previousScore = gameRef.current.score;
      gameRef.current = stepGame(gameRef.current);
      renderFrame();
      syncUi(gameRef.current);

      if (gameRef.current.status === "over") {
        setLiveMessage(`Game over. Score ${gameRef.current.score}.`);
      } else if (gameRef.current.score > previousScore) {
        setLiveMessage(`Score ${gameRef.current.score}.`);
      }
    }, gridConfigRef.current.tickMs);
  }, [renderFrame, syncUi]);

  const ensureLoopState = useCallback(() => {
    const shouldRun =
      !reducedMotionRef.current &&
      isVisibleRef.current &&
      gameRef.current.status === "playing";

    if (shouldRun) startLoop();
    else stopLoop();
  }, [startLoop, stopLoop]);

  const handlePlay = useCallback(() => {
    if (reducedMotionRef.current) return;

    const wasOver = gameRef.current.status === "over";
    gameRef.current = startGame(gameRef.current, gridConfigRef.current);
    renderFrame();
    syncUi(gameRef.current);
    setLiveMessage(
      wasOver
        ? "Snake restarted."
        : "Snake started. Use arrow keys or on-screen controls.",
    );
    ensureLoopState();
    playAreaRef.current?.focus();
  }, [ensureLoopState, renderFrame, syncUi]);

  const handleDirection = useCallback((direction) => {
    if (gameRef.current.status !== "playing") return;
    gameRef.current = queueDirection(gameRef.current, direction);
  }, []);

  const isGameShellFocused = useCallback(
    () => gameShellRef.current?.contains(document.activeElement) ?? false,
    [],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (!isGameShellFocused()) return;

      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;

      event.preventDefault();

      if (gameRef.current.status === "playing") {
        handleDirection(direction);
        if (event.key.startsWith("Arrow") && isDesktopInputRef.current) {
          setActiveDirection(direction);
        }
      }
    },
    [handleDirection, isGameShellFocused],
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (!isGameShellFocused()) return;

      const direction = KEY_TO_DIRECTION[event.key];
      if (
        direction &&
        event.key.startsWith("Arrow") &&
        isDesktopInputRef.current
      ) {
        setActiveDirection((current) =>
          current === direction ? null : current,
        );
      }
    },
    [isGameShellFocused],
  );

  useEffect(() => {
    if (uiState.status !== "playing" || reducedMotion) return undefined;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [uiState.status, reducedMotion, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (uiState.status !== "playing") {
      setActiveDirection(null);
    }
  }, [uiState.status]);

  useEffect(() => {
    gridConfigRef.current = gridConfig;
  }, [gridConfig]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_BREAKPOINT);
    const applyPreset = () => {
      setGridPreset(mediaQuery.matches ? "compact" : "default");
    };

    applyPreset();
    mediaQuery.addEventListener("change", applyPreset);
    return () => mediaQuery.removeEventListener("change", applyPreset);
  }, []);

  useEffect(() => {
    stopLoop();
    gameRef.current = createInitialGameState(gridConfig);
    setActiveDirection(null);
    setLiveMessage("");
    syncUi(gameRef.current);
    renderFrame();
  }, [gridConfig, renderFrame, stopLoop, syncUi]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const applyPreference = () => {
      isDesktopInputRef.current = mediaQuery.matches;
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);
    return () => mediaQuery.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    renderFrame();
    ensureLoopState();
  }, [reducedMotion, ensureLoopState, renderFrame]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      const prefersReduced = mediaQuery.matches;
      setReducedMotion(prefersReduced);
      reducedMotionRef.current = prefersReduced;
      if (prefersReduced) stopLoop();
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);
    return () => mediaQuery.removeEventListener("change", applyPreference);
  }, [stopLoop]);

  useEffect(() => {
    renderFrame();

    const canvasWrap = canvasWrapRef.current;
    if (!canvasWrap) return undefined;

    const resizeObserver = new ResizeObserver(() => renderFrame());
    resizeObserver.observe(canvasWrap);

    return () => resizeObserver.disconnect();
  }, [renderFrame]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        ensureLoopState();
      },
      { threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [ensureLoopState]);

  useEffect(() => {
    const onVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      ensureLoopState();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [ensureLoopState]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const overlayVisible =
    uiState.status === "idle" || uiState.status === "over" || reducedMotion;

  useEffect(() => {
    if (!overlayVisible) {
      setIsHoveringPlayArea(false);
    }
  }, [overlayVisible]);
  const isGameLive = uiState.status === "playing" && !reducedMotion;
  const showPlayCursorPill =
    overlayVisible && isHoveringPlayArea && !reducedMotion;
  const playLabel = uiState.status === "over" ? "PLAY AGAIN" : "PLAY";
  const overlayAriaLabel =
    uiState.status === "over"
      ? `Play again — score ${uiState.score}`
      : reducedMotion
        ? "Snake mini-game"
        : "Play snake";

  return (
    <section
      ref={gameShellRef}
      className="footer-snake"
      aria-label="Snake mini-game"
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!next || !event.currentTarget.contains(next)) {
          setActiveDirection(null);
        }
      }}
    >
      <div className="footer-snake__layout">
        <div ref={sectionRef} className="footer-snake__main">
          <CursorPill isHovering={showPlayCursorPill} text="ssssss..." />
          <p className="footer-snake__score" aria-live="off">
            Score{" "}
            <span className="footer-snake__score-value">{uiState.score}</span>
          </p>

          <div
            ref={playAreaRef}
            className="footer-snake__play-area"
            role="application"
            tabIndex={reducedMotion ? -1 : 0}
            aria-label="Snake mini-game. Press Play to start, then use arrow keys or on-screen controls."
            onMouseEnter={() => {
              if (overlayVisible && !reducedMotion) setIsHoveringPlayArea(true);
            }}
            onMouseLeave={() => setIsHoveringPlayArea(false)}
          >
            <div
              ref={canvasWrapRef}
              className="footer-snake__canvas-wrap"
              style={{ aspectRatio: `${gridConfig.cols} / ${gridConfig.rows}` }}
            >
              <canvas
                ref={canvasRef}
                className="footer-snake__canvas"
                aria-hidden="true"
              />

              {overlayVisible && (
                <button
                  type="button"
                  className="footer-snake__overlay"
                  onClick={reducedMotion ? undefined : handlePlay}
                  disabled={reducedMotion}
                  aria-label={overlayAriaLabel}
                >
                  <span className="footer-snake__play-btn">{playLabel}</span>
                </button>
              )}
            </div>
          </div>

          <p
            className="footer-snake__live"
            aria-live="polite"
            aria-atomic="true"
          >
            {liveMessage}
          </p>
        </div>

        <div className="footer-snake__aside">
          <div
            className={`footer-snake__controls${
              isGameLive ? " footer-snake__controls--live" : ""
            }`}
            aria-label="Snake direction controls"
          >
            {DIRECTION_CONTROLS.map(
              ({ direction, className, label, symbol }) => (
                <button
                  key={direction}
                  type="button"
                  className={`footer-snake__control ${className}${
                    activeDirection === direction
                      ? " footer-snake__control--active"
                      : ""
                  }`}
                  aria-label={label}
                  disabled={!isGameLive}
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleDirection(direction)}
                >
                  {symbol}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
