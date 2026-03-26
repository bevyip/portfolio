import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenisScroll } from "../hooks/useLenisScroll";
import { isHomePath } from "../constants/homeRoutes";

const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();
  const { scrollToTop } = useLenisScroll();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (state?.scrollToPlay === true) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (hash && isHomePath(pathname)) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (pathname === prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      return;
    }

    scrollToTop({ immediate: true });
    prevPathnameRef.current = pathname;
  }, [pathname, hash, state, scrollToTop]);

  return null;
};

export default ScrollToTop;
