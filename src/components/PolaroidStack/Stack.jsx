import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import "./Stack.css";

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
  rotateZ,
  transformOrigin,
  offsetX = 0,
  offsetY = 0,
  hoverRotateZ,
  hoverX,
  hoverY,
  isGroupHovered = false,
}) {
  const x = useMotionValue(0); // drag offset only
  const y = useMotionValue(0);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  const hoverTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
  };

  if (disableDrag) {
    return (
      <motion.div
        className="card-rotate-disabled"
        style={{
          x: offsetX,
          y: 0,
          rotateZ,
          transformOrigin,
        }}
        animate={{
          x: isGroupHovered ? (hoverX ?? offsetX) : offsetX,
          rotateZ: isGroupHovered ? (hoverRotateZ ?? rotateZ) : rotateZ,
        }}
        transition={hoverTransition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ transformOrigin }}
      animate={{
        x: isGroupHovered ? (hoverX ?? offsetX) : offsetX,
        y: isGroupHovered ? (hoverY ?? offsetY) : offsetY,
        rotateZ: isGroupHovered ? (hoverRotateZ ?? rotateZ) : rotateZ,
      }}
      transition={hoverTransition}
    >
      <motion.div
        style={{ x, y, width: "100%", height: "100%" }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragElastic={0.6}
        whileTap={{ cursor: "grabbing" }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGroupHovered, setIsGroupHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState(() => {
    if (cards.length) {
      return cards
        .map((content, index) => ({ id: index + 1, content }))
        .reverse();
    }
    return [];
  });

  useEffect(() => {
    if (cards.length) {
      setStack(
        cards.map((content, index) => ({ id: index + 1, content })).reverse(),
      );
    }
  }, [cards]);

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  if (stack.length === 0) return null;

  return (
    <div
      className="stack-container"
      onMouseEnter={() => {
        pauseOnHover && setIsPaused(true);
        setIsGroupHovered(true);
      }}
      onMouseLeave={() => {
        pauseOnHover && setIsPaused(false);
        setIsGroupHovered(false);
      }}
    >
      {stack.map((card, index) => {
        const stackPosition = stack.length - index - 1; // 0 = top, 1 = middle, 2 = bottom
        const rotations = [
          { rotateZ: 0, x: 0, y: 0, transformOrigin: "50% 50%" },
          { rotateZ: -10, x: -50, y: 0, transformOrigin: "50% 50%" },
          { rotateZ: 10, x: 80, y: 0, transformOrigin: "50% 50%" },
        ];
        const rotationsHover = [
          { rotateZ: 0, x: 0, y: -12 }, // top: lifts up slightly
          { rotateZ: -18, x: -65, y: 0 }, // middle: fans left
          { rotateZ: 18, x: 100, y: 0 }, // bottom: fans right
        ];
        const rot = rotations[stackPosition] ?? rotations[2];
        const rotHover = rotationsHover[stackPosition] ?? rotationsHover[2];
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
            rotateZ={rot.rotateZ}
            transformOrigin={rot.transformOrigin}
            offsetX={rot.x}
            offsetY={rot.y}
            hoverRotateZ={rotHover.rotateZ}
            hoverX={rotHover.x}
            hoverY={rotHover.y}
            isGroupHovered={isGroupHovered}
          >
            <motion.div
              className="card"
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                scale: 1 + index * 0.06 - stack.length * 0.06,
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
