import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhotoOverlay from "./PhotoOverlay";
import "./PhotoGrid.css";

gsap.registerPlugin(ScrollTrigger);

// Import images
import v1 from "../../assets/img/about-pictures/v-1.png";
import v2 from "../../assets/img/about-pictures/v-2.png";
import v3 from "../../assets/img/about-pictures/v-3.png";
import v4 from "../../assets/img/about-pictures/v-4.png";
import l1 from "../../assets/img/about-pictures/l-1.png";
import l2 from "../../assets/img/about-pictures/l-2.png";
import l3 from "../../assets/img/about-pictures/l-3.png";
import l4 from "../../assets/img/about-pictures/l-4.png";

// Individual photo item component with scroll-triggered animation
const PhotoItem = ({
  src,
  alt,
  className,
  scrollProgress,
  index,
  total,
  onClick,
}) => {
  // Images start animating immediately when photo grid ScrollTrigger starts
  // (which is when arrow completes)
  // Spread images across 80% of scroll progress to ensure all complete
  const progressRange = 0.8;
  const startProgress = (index / total) * progressRange;
  const endProgress = ((index + 1) / total) * progressRange;

  // Calculate this image's animation progress from scroll progress
  const imageProgress = useTransform(scrollProgress, (latest) => {
    if (latest < startProgress) return 0;
    if (latest > endProgress) return 1;
    return (latest - startProgress) / (endProgress - startProgress);
  });

  // Transform values based on scroll progress
  // Images become visible earlier when small and far back for depth effect
  const rotateZ = useTransform(imageProgress, [0, 1], [-8, 0]);
  const rotateY = useTransform(imageProgress, [0, 1], [20, 0]);
  const y = useTransform(imageProgress, [0, 1], [60, 0]);
  const z = useTransform(imageProgress, [0, 1], [-500, 0]); // Start further back for more depth
  // Opacity starts fading in early (at 0.2 progress) when image is still small and far
  const opacity = useTransform(imageProgress, (latest) => {
    if (latest < 0.2) return 0;
    if (latest > 1) return 1;
    // Smooth fade in from 0.2 to 1.0
    return (latest - 0.2) / 0.8;
  });
  // Scale starts smaller and grows more dramatically
  const scale = useTransform(imageProgress, [0, 1], [0.3, 1]); // Start much smaller

  // Track if photo is fully visible
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  // Monitor opacity and scale to determine if fully visible
  useMotionValueEvent(opacity, "change", (latest) => {
    const scaleValue = scale.get();
    setIsFullyVisible(latest >= 0.95 && scaleValue >= 0.95);
  });

  useMotionValueEvent(scale, "change", (latest) => {
    const opacityValue = opacity.get();
    setIsFullyVisible(opacityValue >= 0.95 && latest >= 0.95);
  });

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: "preserve-3d",
        rotateZ,
        rotateY,
        y,
        z,
        opacity,
        scale,
        cursor: isFullyVisible ? "pointer" : "default",
      }}
      onClick={isFullyVisible ? onClick : undefined}
    >
      <img src={src} alt={alt} />
    </motion.div>
  );
};

const PhotoGrid = () => {
  const containerRef = useRef(null);
  const scrollProgress = useMotionValue(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const animationOrder = useMemo(() => {
    return [0, 4, 6, 3, 1, 2, 5, 7];
  }, []);

  // Set up ScrollTrigger pinning with progress tracking
  useEffect(() => {
    const section = document.getElementById("photo-grid-section");
    const openToWorkSection = document.getElementById("open-to-work-section");
    const photoGridContainer = document.getElementById("photo-grid-container");

    if (!section || !openToWorkSection || !photoGridContainer) return;

    // Wait for layout to settle before calculating positions
    const initScrollTrigger = () => {
      // Calculate where the arrow ends (same as arrow's endTrigger end point)
      const openToWorkBottom =
        openToWorkSection.getBoundingClientRect().bottom + window.scrollY;
      const photoGridTop =
        photoGridContainer.getBoundingClientRect().top + window.scrollY;
      const distance = photoGridTop - openToWorkBottom;
      const extension = distance * 0.5; // Same extension as arrow

      // Pin the section earlier (at "top top") to prevent it from moving
      // But delay image animations until arrow completes
      const pinDuration = window.innerHeight * 2.5; // Pin for 2.5 viewport heights

      // Calculate when arrow completes relative to the pinned section
      // Arrow ends when section reaches top + extension
      // Section pins when it reaches "top top"
      // So arrow completes after extension pixels of scroll within the pinned section
      const arrowEndProgress = extension / (pinDuration + extension);

      const scrollTrigger = ScrollTrigger.create({
        trigger: section, // Green border component (photo-grid-section)
        start: "top top", // Pin earlier to prevent movement
        end: `+=${pinDuration}`,
        pin: section, // Explicitly pin the green section component
        pinSpacing: true, // Maintain spacing to prevent layout shift
        anticipatePin: 1,
        invalidateOnRefresh: true, // Recalculate on refresh
        onUpdate: (self) => {
          // Only start animating images after arrow completes
          if (self.progress <= arrowEndProgress) {
            scrollProgress.set(0); // Arrow still drawing, images stay hidden
          } else {
            const adjustedProgress =
              (self.progress - arrowEndProgress) / (1 - arrowEndProgress);
            scrollProgress.set(adjustedProgress);
          }
        },
      });

      return scrollTrigger;
    };

    // Delay initialization to ensure layout is settled
    let scrollTrigger = null;
    let rafId = null;

    // Use requestAnimationFrame to ensure layout is painted
    rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollTrigger = initScrollTrigger();
        // Refresh ScrollTrigger after initialization to ensure correct positioning
        ScrollTrigger.refresh();
      });
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [scrollProgress]);

  const photos = [
    {
      src: l1,
      alt: "Piano",
      className: "photo-grid-item photo-grid-landscape photo-grid-top-left",
    },
    {
      src: l2,
      alt: "Group photo",
      className: "photo-grid-item photo-grid-landscape photo-grid-top-right",
    },
    {
      src: v3,
      alt: "Badminton",
      className: "photo-grid-item photo-grid-vertical photo-grid-middle-left",
    },
    {
      src: v1,
      alt: "Cat",
      className:
        "photo-grid-item photo-grid-vertical photo-grid-middle-center-left",
    },
    {
      src: v2,
      alt: "Presentation",
      className:
        "photo-grid-item photo-grid-vertical photo-grid-middle-center-right",
    },
    {
      src: v4,
      alt: "Child on bridge",
      className: "photo-grid-item photo-grid-vertical photo-grid-middle-right",
    },
    {
      src: l4,
      alt: "Climbing",
      className: "photo-grid-item photo-grid-landscape photo-grid-bottom-left",
    },
    {
      src: l3,
      alt: "Gaming stream",
      className: "photo-grid-item photo-grid-landscape photo-grid-bottom-right",
    },
  ];

  return (
    <>
      <motion.div ref={containerRef} className="photo-grid-container">
        {photos.map((photo, visualIndex) => {
          // Find the animation index for this photo in the shuffled order
          const animationIndex = animationOrder.indexOf(visualIndex);
          return (
            <PhotoItem
              key={visualIndex}
              src={photo.src}
              alt={photo.alt}
              className={photo.className}
              scrollProgress={scrollProgress}
              index={animationIndex}
              total={8}
              onClick={() => setSelectedPhoto(photo)}
            />
          );
        })}
      </motion.div>

      {/* Photo Overlay Modal */}
      <PhotoOverlay
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        photo={selectedPhoto}
      />
    </>
  );
};

export default PhotoGrid;
