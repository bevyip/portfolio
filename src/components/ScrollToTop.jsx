import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenisScroll } from "../hooks/useLenisScroll";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollToTop } = useLenisScroll();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      return;
    }

    scrollToTop({ immediate: true });
    prevPathnameRef.current = pathname;
  }, [pathname, scrollToTop]);

  return null;
};

export default ScrollToTop;
