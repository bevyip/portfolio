import React, { useMemo, useRef, useLayoutEffect } from "react";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export const BouncingBall = ({
  onExpand,
  onComplete,
  onGridStart,
  shadowRef,
}) => {
  const groupRef = useRef();
  const onExpandRef = useRef(onExpand);
  const onCompleteRef = useRef(onComplete);
  const onGridStartRef = useRef(onGridStart);
  const hasAnimatedRef = useRef(false);

  // Keep refs updated
  useLayoutEffect(() => {
    onExpandRef.current = onExpand;
    onCompleteRef.current = onComplete;
    onGridStartRef.current = onGridStart;
  });

  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 1. Transparent background
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, 128, 128);

      // 2. Draw border for the grid lines
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4; // Thickness of the lines
      ctx.strokeRect(0, 0, 128, 128);
    }

    const texture = new THREE.CanvasTexture(canvas);
    // Wrap texture to repeat across the sphere
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Adjusted repeat for 15% smaller ball (36 * 0.85 ≈ 30.6, 18 * 0.85 ≈ 15.3)
    // Using slightly adjusted values to maintain visual consistency
    texture.repeat.set(31, 15);

    return texture;
  }, []);

  // Animation logic
  useLayoutEffect(() => {
    // COMMENTED OUT FOR TESTING - Allow animation to run every time
    // Prevent animation from running multiple times
    // if (hasAnimatedRef.current) {
    //   console.log("Ball animation already played, skipping...");
    //   return;
    // }

    // Wait for ref to be ready - use requestAnimationFrame for React Three Fiber
    let tl = null;
    let rafId = null;

    const startAnimation = () => {
      if (!groupRef.current) return;
      // COMMENTED OUT FOR TESTING - Allow animation to run every time
      // if (hasAnimatedRef.current) return;

      // COMMENTED OUT FOR TESTING - Don't mark as animated so it can run again
      // hasAnimatedRef.current = true;
      const group = groupRef.current;

      // Initial state - start small and positioned above
      group.position.y = 2;
      group.position.z = 0;
      group.scale.set(0.3, 0.3, 0.3);

      tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        },
      });

      // 3D coordinates
      const floorY = -0.7;
      const bounceHeight = 1.7 - floorY;
      const maxDropHeight = 2 - floorY; // Maximum height from starting position (2 - (-0.7) = 2.7)

      // Helper function to update shadow based on ball height
      const updateShadow = (currentY, maxHeight) => {
        if (!shadowRef?.current) return;

        const height = currentY - floorY;
        const progress = Math.min(Math.max(height / maxHeight, 0), 1);
        const shadowScale = 1 - 0.4 * progress;
        const shadowOpacity = 0.5 * (1 - progress);

        gsap.set(shadowRef.current, {
          opacity: shadowOpacity,
          scale: shadowScale,
        });
      };

      // Initial shadow state
      if (shadowRef?.current) {
        gsap.set(shadowRef.current, {
          opacity: 0,
          scale: 0,
          xPercent: -50,
        });
      }

      // 1. Drop from above
      tl.to(group.position, {
        y: floorY,
        duration: 0.8,
        ease: "power2.in",
        onUpdate: () => {
          updateShadow(group.position.y, maxDropHeight);
        },
      });

      // 2. Bounce up and down
      tl.to(group.position, {
        y: 1,
        duration: 0.4,
        ease: "power1.out",
        yoyo: true,
        repeat: 2,
        onUpdate: function () {
          updateShadow(group.position.y, bounceHeight);
        },
      });

      // Prepare materials for fading before expansion
      const materials = [];
      group.traverse((child) => {
        if (child.material) {
          materials.push(child.material);
          if (!child.material.transparent) {
            child.material.transparent = true;
          }
          if (child.material.opacity === undefined) {
            child.material.opacity = 1;
          }
        }
      });

      // 3. Expansion - scale up to fill screen while fading out
      tl.to(group.scale, {
        x: 15,
        y: 15,
        z: 15,
        duration: 0.6,
        ease: "power2.inOut",
        onStart: () => {
          // Trigger background change and grid fade-in immediately when expansion begins
          if (onExpandRef.current) onExpandRef.current();
          if (onGridStartRef.current) onGridStartRef.current();
        },
        onUpdate: function () {
          // Fade out shadow during expansion
          if (shadowRef?.current) {
            gsap.set(shadowRef.current, {
              opacity: 0,
              scale: 0,
            });
          }

          // Fade out ball as it expands (progress from 1 to 0)
          const progress = this.progress();
          const ballOpacity = 1 - progress; // Fade from 1 to 0 during expansion
          materials.forEach((mat) => {
            mat.opacity = ballOpacity;
          });
        },
      });
    };

    // Try to start immediately, or wait for next frame
    if (groupRef.current) {
      startAnimation();
    } else {
      rafId = requestAnimationFrame(() => {
        startAnimation();
      });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (tl) tl.kill();
      hasAnimatedRef.current = false;
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* 1. Inner Dark Sphere - Increased segments for smoothness */}
      {/* Shrunk by 15%: 1.5 * 0.85 = 1.275 */}
      <Sphere args={[1.275, 64, 64]}>
        <meshStandardMaterial
          color="#111827"
          roughness={0.5} // Increased roughness to make light less harsh
          metalness={0.1}
        />
      </Sphere>

      {/* 2. Grid Overlay */}
      {/* Uses the texture map instead of wireframe to avoid diagonals */}
      {/* Shrunk by 15%: 1.51 * 0.85 = 1.2835 */}
      <Sphere args={[1.2835, 64, 64]}>
        <meshBasicMaterial
          map={gridTexture}
          color="white"
          transparent
          opacity={0.5}
        />
      </Sphere>
    </group>
  );
};
