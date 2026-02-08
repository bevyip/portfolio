import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

export const GridBackground = ({
  isVisible,
  accentColor = "#22D3EE",
  cellSize = 20,
  fadeSpeed = 0.018,
  fadeDelay = 800, // Delay in milliseconds before fade starts
}) => {
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const activeCellsRef = useRef(new Map());
  const lastPosRef = useRef(null);
  const animationFrameRef = useRef(null);
  const flickerTimeoutRefs = useRef([]);

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
            { opacity: 1, duration: 0.4, delay: 0, ease: "power2.out" }
          );
        }
      }, 0);
      return () => clearTimeout(timeout);
    }

    if (isVisible) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0, ease: "power2.out" }
      );
    } else {
      gsap.set(gridRef.current, { opacity: 0 });
    }
  }, [isVisible]);

  // Calculate color based on diagonal position (top-left to bottom-right)
  const getCellColor = useCallback((cx, cy, canvasWidth, canvasHeight) => {
    if (!canvasWidth || !canvasHeight) return { r: 34, g: 211, b: 238 }; // Default to accent color
    
    // Calculate position along diagonal (0 = top-left, 1 = bottom-right)
    // Normalize coordinates to 0-1 range
    const normalizedX = cx * cellSize / canvasWidth;
    const normalizedY = cy * cellSize / canvasHeight;
    
    // Diagonal position: average of x and y normalized positions
    // This creates a gradient from top-left (0,0) to bottom-right (1,1)
    const diagonalProgress = (normalizedX + normalizedY) / 2;
    
    // Create RGB spectrum gradient similar to color picker
    // Start with magenta/pink at top-left, go through cyan to blue at bottom-right
    // Keeping similar brightness to accent color (#22D3EE)
    let r, g, b;
    
    if (diagonalProgress < 0.33) {
      // Top-left: Magenta/Pink range
      const t = diagonalProgress / 0.33;
      r = Math.round(238 + (255 - 238) * t);
      g = Math.round(34 + (100 - 34) * t);
      b = Math.round(238 + (255 - 238) * t);
    } else if (diagonalProgress < 0.66) {
      // Middle: Cyan range (accent color area)
      const t = (diagonalProgress - 0.33) / 0.33;
      r = Math.round(255 - (255 - 34) * t);
      g = Math.round(100 + (211 - 100) * t);
      b = Math.round(255);
    } else {
      // Bottom-right: Blue range
      const t = (diagonalProgress - 0.66) / 0.34;
      r = Math.round(34 - 34 * t);
      g = Math.round(211 - (211 - 100) * t);
      b = Math.round(255 - (255 - 238) * t);
    }
    
    return { r, g, b };
  }, [cellSize]);

  const activateCell = useCallback(
    (cx, cy, boost = 0, initialOpacity = 0.6, canvasWidth = null, canvasHeight = null) => {
      const key = `${cx}-${cy}`;
      const existing = activeCellsRef.current.get(key);
      const now = Date.now();
      
      // Get color for this cell position
      const cellColor = getCellColor(cx, cy, canvasWidth, canvasHeight);

      // Reset fade delay if cell is reactivated
      const shouldResetFade = existing && now < existing.fadeStartTime;
      const fadeStartTime = shouldResetFade ? (now + fadeDelay) : (existing?.fadeStartTime || (now + fadeDelay));

      activeCellsRef.current.set(key, {
        x: cx,
        y: cy,
        opacity: Math.min(
          1.0,
          (existing?.opacity || 0) + initialOpacity + boost
        ),
        hoverTime: existing ? existing.hoverTime + 1 : 1,
        color: cellColor, // Store color with cell
        lastActivated: now, // Track when cell was last activated
        fadeStartTime: fadeStartTime, // Delay before fade starts
      });
    },
    [getCellColor, fadeDelay]
  );

  const activateBrush = useCallback(
    (cx, cy, boost = 0, canvasWidth = null, canvasHeight = null) => {
      // 2x2 cluster for a refined trail size
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          activateCell(cx + i, cy + j, boost, 0.5, canvasWidth, canvasHeight);
        }
      }
    },
    [activateCell]
  );

  // Detect if device is mobile/tablet (for disabling touch interactions)
  const isMobileOrTablet = useCallback(() => {
    return window.innerWidth < 1024; // Tablet and mobile
  }, []);

  // Attach event listeners to window for global mouse tracking
  useEffect(() => {
    if (!isVisible) {
      lastPosRef.current = null;
      return;
    }

    // Skip touch/mouse interactions on mobile/tablet
    if (isMobileOrTablet()) {
      return;
    }

    // Detect if device is touch-enabled (mobile)
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    const getCellCoords = (mouseX, mouseY) => {
      return {
        cx: Math.floor(mouseX / cellSize),
        cy: Math.floor(mouseY / cellSize),
      };
    };

    const interpolateLine = (x0, y0, x1, y1) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
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
        activateBrush(cx, cy, 0, canvas.width, canvas.height);

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
        activateBrush(cx, cy, 0, canvas.width, canvas.height);
      }

      lastPosRef.current = { x, y };
    };

    const handleMouseMove = (e) => {
      handlePointerInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      // Disable touch highlighting on mobile
      if (isTouchDevice) return;
      if (e.touches[0]) {
        handlePointerInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseDown = (e) => {
      // Disable touch highlighting on mobile
      if (isTouchDevice && e.touches) return;

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
          activateCell(cx + i, cy + j, 0.4, 0.4, canvas.width, canvas.height);
        }
      }
    };

    const handleMouseLeave = () => {
      lastPosRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    // Only attach touch listeners if not a touch device (for hybrid devices)
    if (!isTouchDevice) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchstart", handleMouseDown, { passive: false });
      window.addEventListener("touchend", handleMouseLeave);
    }
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (!isTouchDevice) {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleMouseDown);
        window.removeEventListener("touchend", handleMouseLeave);
      }
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseleave", handleMouseLeave);
      lastPosRef.current = null;
    };
  }, [isVisible, activateBrush, cellSize, isMobileOrTablet]);

  // Random flickering effect for mobile/tablet (like fireflies/stars)
  useEffect(() => {
    if (!isVisible || !isMobileOrTablet()) {
      // Clear all timeouts
      flickerTimeoutRefs.current.forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      flickerTimeoutRefs.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const randomFlicker = () => {
      const maxX = Math.floor(canvas.width / cellSize);
      const maxY = Math.floor(canvas.height / cellSize);
      
      if (maxX === 0 || maxY === 0) return;
      
      // Create 1-3 small clumps of cells (slightly less)
      const numClumps = Math.floor(Math.random() * 3) + 1; // 1-3 clumps
      
      for (let clump = 0; clump < numClumps; clump++) {
        // Random center position for clump
        const centerX = Math.floor(Math.random() * maxX);
        const centerY = Math.floor(Math.random() * maxY);
        
        // Create small clump: 3-5 cells in a small area
        const clumpSize = Math.floor(Math.random() * 3) + 3; // 3-5 cells per clump
        
        for (let i = 0; i < clumpSize; i++) {
          // Cells within 1-2 cell radius of center
          const offsetX = Math.floor((Math.random() - 0.5) * 3); // -1 to 1
          const offsetY = Math.floor((Math.random() - 0.5) * 3); // -1 to 1
          
          const cx = Math.max(0, Math.min(maxX - 1, centerX + offsetX));
          const cy = Math.max(0, Math.min(maxY - 1, centerY + offsetY));
          
          // Moderate intensity
          const boost = Math.random() * 0.4;
          const initialOpacity = 0.35 + Math.random() * 0.35; // 0.35-0.7
          
          activateCell(cx, cy, boost, initialOpacity, canvas.width, canvas.height);
          
          // Make mobile flickers last longer by extending fade delay
          const key = `${cx}-${cy}`;
          const cell = activeCellsRef.current.get(key);
          if (cell) {
            // Extend fade delay to 1200-1800ms (longer than default 800ms)
            const extendedDelay = 1200 + Math.random() * 600;
            cell.fadeStartTime = Date.now() + extendedDelay;
          }
        }
      }
    };

    // Create multiple independent flicker sequences that overlap
    const createFlickerSequence = () => {
      const scheduleNext = () => {
        const delay = 800 + Math.random() * 1000; // 800-1800ms (slower rate)
        const timeout = setTimeout(() => {
          if (isVisible && isMobileOrTablet() && canvasRef.current) {
            randomFlicker();
            scheduleNext();
          } else {
            // Remove from array when done
            const index = flickerTimeoutRefs.current.indexOf(timeout);
            if (index > -1) {
              flickerTimeoutRefs.current.splice(index, 1);
            }
          }
        }, delay);
        flickerTimeoutRefs.current.push(timeout);
      };
      
      // Start after navbar slides in (2.3s) with a random initial delay for this sequence
      const navbarDelay = 2300; // Navbar finishes sliding in around 2.3s
      const initialDelay = navbarDelay + Math.random() * 500;
      const timeout = setTimeout(() => {
        if (isVisible && isMobileOrTablet() && canvasRef.current) {
          randomFlicker();
          scheduleNext();
        }
      }, initialDelay);
      flickerTimeoutRefs.current.push(timeout);
    };

    // Start 3-4 independent flicker sequences for seamless overlapping
    const numSequences = 3 + Math.floor(Math.random() * 2); // 3-4 sequences
    for (let i = 0; i < numSequences; i++) {
      createFlickerSequence();
    }

    return () => {
      // Clear all timeouts
      flickerTimeoutRefs.current.forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      flickerTimeoutRefs.current = [];
    };
  }, [isVisible, cellSize, activateCell, isMobileOrTablet]);

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

      // Draw active cells with glow effect using position-based colors
      const now = Date.now();
      activeCellsRef.current.forEach((cell, key) => {
        // Only start fading after the delay period
        if (now >= cell.fadeStartTime) {
          cell.opacity -= fadeSpeed;
        }

        if (cell.opacity <= 0) {
          activeCellsRef.current.delete(key);
          return;
        }

        const xPos = cell.x * cellSize;
        const yPos = cell.y * cellSize;

        // Use stored color or calculate if not available
        const cellColor = cell.color || getCellColor(cell.x, cell.y, canvas.width, canvas.height);
        const rgb = `${cellColor.r}, ${cellColor.g}, ${cellColor.b}`;

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
  }, [cellSize, accentColor, fadeSpeed, isVisible, getCellColor]);

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
