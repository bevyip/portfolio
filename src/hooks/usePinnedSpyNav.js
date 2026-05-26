import { useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";

const TOP_OFFSET = 112; // align with case-study hero eyebrow / spy nav start

export function usePinnedSpyNav(slotRef, layoutRef, navRef) {
  const lenis = useLenis();
  const [pinStyle, setPinStyle] = useState(null);

  useEffect(() => {
    const slotEl = slotRef.current;
    const layoutEl = layoutRef.current;
    const navEl = navRef.current;
    if (!slotEl || !layoutEl || !navEl) return;

    let rafId = null;

    const updatePin = () => {
      if (rafId != null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const slotRect = slotEl.getBoundingClientRect();
        const layoutRect = layoutEl.getBoundingClientRect();
        const navHeight = navEl.offsetHeight;

        if (layoutRect.bottom <= TOP_OFFSET + navHeight) {
          slotEl.style.minHeight = "";
          setPinStyle((prev) => (prev == null ? prev : null));
          return;
        }

        if (slotRect.top <= TOP_OFFSET) {
          slotEl.style.minHeight = `${navHeight}px`;
          setPinStyle((prev) => {
            const next = {
              position: "fixed",
              top: TOP_OFFSET,
              left: slotRect.left,
              width: slotRect.width,
            };
            if (
              prev?.position === "fixed" &&
              prev.top === next.top &&
              Math.abs(prev.left - next.left) < 0.5 &&
              Math.abs(prev.width - next.width) < 0.5
            ) {
              return prev;
            }
            return next;
          });
          return;
        }

        slotEl.style.minHeight = "";
        setPinStyle((prev) => (prev == null ? prev : null));
      });
    };

    updatePin();

    if (lenis) {
      lenis.on("scroll", updatePin);
    } else {
      window.addEventListener("scroll", updatePin, { passive: true });
    }
    window.addEventListener("resize", updatePin);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      slotEl.style.minHeight = "";
      if (lenis) lenis.off("scroll", updatePin);
      else window.removeEventListener("scroll", updatePin);
      window.removeEventListener("resize", updatePin);
    };
  }, [lenis, slotRef, layoutRef, navRef]);

  return pinStyle;
}
