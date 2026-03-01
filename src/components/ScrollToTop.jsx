import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";

const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();
  const lenis = useLenis();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Don't scroll to top when we're navigating to home to show the play section (Nav will handle scroll)
    if (state?.scrollToPlay === true) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (hash && pathname === "/") {
      prevPathnameRef.current = pathname;
      return;
    }
    // Same page, only state changed (e.g. Work click on home cleared scrollToPlay) – Nav already started smooth scroll, don't override with immediate
    if (pathname === prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      return;
    }

    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, hash, state]);

  return null;
};

export default ScrollToTop;
