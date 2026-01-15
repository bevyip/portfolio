import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // If there's a hash (e.g., #work) and we're on the home page,
    // let the Home component handle it - don't scroll to top
    if (hash && pathname === "/") {
      return;
    }

    // Normal scroll for all routes
    if (lenis) {
      lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);

  return null;
};

export default ScrollToTop;
