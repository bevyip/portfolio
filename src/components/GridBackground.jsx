import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

export const GridBackground = ({
  isVisible,
  accentColor = "#22D3EE",
  cellSize = 20,
  fadeSpeed = 0.018,
}) => {
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const activeCellsRef = useRef(new Map());
  const lastPosRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = gridRef.current;
    if (!canvas || !container) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const handleResize = () => {
      updateCanvasSize();
    };

    // Use ResizeObserver to watch container size changes
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    window.addEventListener("resize", handleResize);
    updateCanvasSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle visibility animation with GSAP
  useEffect(() => {
    if (!gridRef.current) {
      const timeout = setTimeout(() => {
        if (gridRef.current && isVisible) {
          gsap.fromTo(
            gridRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, delay: 0.3, ease: "power2.out" }
          );
        }
      }, 0);
      return () => clearTimeout(timeout);
    }

    if (isVisible) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.set(gridRef.current, { opacity: 0 });
    }
  }, [isVisible]);

  const activateCell = useCallback(
    (cx, cy, boost = 0, initialOpacity = 0.6) => {
      const key = `${cx}-${cy}`;
      const existing = activeCellsRef.current.get(key);

      activeCellsRef.current.set(key, {
        x: cx,
        y: cy,
        opacity: Math.min(
          1.0,
          (existing?.opacity || 0) + initialOpacity + boost
        ),
        hoverTime: existing ? existing.hoverTime + 1 : 1,
      });
    },
    []
  );

  const activateBrush = useCallback(
    (cx, cy, boost = 0) => {
      // 2x2 cluster for a refined trail size
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          activateCell(cx + i, cy + j, boost, 0.5);
        }
      }
    },
    [activateCell]
  );

  // Attach event listeners to window for global mouse tracking
  useEffect(() => {
    if (!isVisible) {
      lastPosRef.current = null;
      return;
    }

    const getCellCoords = (mouseX, mouseY) => {
      return {
        cx: Math.floor(mouseX / cellSize),
        cy: Math.floor(mouseY / cellSize),
      };
    };

    const interpolateLine = (x0, y0, x1, y1) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      let currX = x0;
      let currY = y0;

      // 800 steps for long smooth strokes
      const maxSteps = 800;
      let count = 0;

      while (count < maxSteps) {
        const { cx, cy } = getCellCoords(currX, currY);
        activateBrush(cx, cy);

        if (Math.abs(currX - x1) < 1 && Math.abs(currY - y1) < 1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          currX += sx;
        }
        if (e2 < dx) {
          err += dx;
          currY += sy;
        }
        count++;
      }
    };

    const handlePointerInteraction = (clientX, clientY) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Only process if within canvas bounds
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      // Canvas dimensions match container dimensions, so coordinates map directly
      if (lastPosRef.current) {
        interpolateLine(lastPosRef.current.x, lastPosRef.current.y, x, y);
      } else {
        const { cx, cy } = getCellCoords(x, y);
        activateBrush(cx, cy);
      }

      lastPosRef.current = { x, y };
    };

    const handleMouseMove = (e) => {
      handlePointerInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        handlePointerInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Only process if within canvas bounds
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      // Canvas dimensions match container dimensions, so coordinates map directly
      const { cx, cy } = getCellCoords(x, y);

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          activateCell(cx + i, cy + j, 0.4, 0.4);
        }
      }
    };

    const handleMouseLeave = () => {
      lastPosRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchstart", handleMouseDown, { passive: false });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      lastPosRef.current = null;
    };
  }, [isVisible, activateBrush, cellSize]);

  const hexToRgb = (hex) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  // Canvas drawing animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = "#0f0f0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;

      if (cellSize >= 5) {
        for (let x = 0; x <= canvas.width; x += cellSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += cellSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Draw active cells with glow effect
      const rgb = hexToRgb(accentColor);

      activeCellsRef.current.forEach((cell, key) => {
        cell.opacity -= fadeSpeed;

        if (cell.opacity <= 0) {
          activeCellsRef.current.delete(key);
          return;
        }

        const xPos = cell.x * cellSize;
        const yPos = cell.y * cellSize;

        const glowRadius = cellSize * 2.0;
        const centerX = xPos + cellSize / 2;
        const centerY = yPos + cellSize / 2;

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowRadius
        );

        gradient.addColorStop(0, `rgba(${rgb}, ${cell.opacity * 0.2})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          centerX - glowRadius,
          centerY - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );

        ctx.fillStyle = `rgba(${rgb}, ${cell.opacity})`;
        const padding = 1;
        ctx.fillRect(
          xPos + padding,
          yPos + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cellSize, accentColor, fadeSpeed, isVisible]);

  return (
    <div
      ref={gridRef}
      className="w-full h-screen relative"
      style={{
        opacity: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
};
