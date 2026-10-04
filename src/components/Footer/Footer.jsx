import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gameboy from "../Gameboy";
import {
  fetchSnakeHighScore,
  submitSnakeScore,
} from "../../utils/snakeScoreApi";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_RISE_DURATION = 1;
const FOOTER_RISE_EASE = "power2.out";
const FOOTER_LINE_STAGGER = 0.12;

const FooterLine = ({ children }) => (
  <span className="footer-line">
    <span className="footer-line-inner">{children}</span>
  </span>
);

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bevyip/",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/bevyip",
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/bevdesigns",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:beverly.yip.8000@gmail.com",
    external: false,
  },
];

const Footer = () => {
  const footerRef = useRef(null);
  const gameboyRef = useRef(null);
  const highScoreRef = useRef(0);
  const [timeString, setTimeString] = useState("—:—:—");
  const [highScore, setHighScore] = useState(0);

  const applyHighScore = useCallback((value) => {
    const next = Number(value);
    if (!Number.isFinite(next)) return;
    const merged = Math.max(highScoreRef.current, next);
    highScoreRef.current = merged;
    setHighScore(merged);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const pullHighScore = async () => {
      try {
        const next = await fetchSnakeHighScore();
        if (!cancelled) applyHighScore(next);
      } catch {
        // Keep the last score we already showed.
      }
    };

    pullHighScore();
    const intervalId = window.setInterval(pullHighScore, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") pullHighScore();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [applyHighScore]);

  const handleGameOver = useCallback(
    async (score) => {
      const value = Number(score);
      if (!Number.isInteger(value) || value <= highScoreRef.current) return;
      try {
        applyHighScore(await submitSnakeScore(value));
      } catch {
        // The next poll can still pick up a score that did save.
      }
    },
    [applyHighScore],
  );

  useEffect(() => {
    const footer = footerRef.current;
    const gameboy = gameboyRef.current;
    if (!footer) return undefined;

    const lineInners = footer.querySelectorAll(".footer-line-inner");
    if (!lineInners.length) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lineInners, { y: 0 });
      if (gameboy) gsap.set(gameboy, { opacity: 1 });
      return undefined;
    }

    gsap.set(lineInners, { y: "100%" });
    if (gameboy) gsap.set(gameboy, { opacity: 0 });

    let revealed = false;
    let scrollTrigger = null;
    let layoutTimer = 0;
    let lastHeight = document.documentElement.scrollHeight;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      window.clearTimeout(layoutTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onLayout);
      gsap.to(lineInners, {
        y: 0,
        duration: FOOTER_RISE_DURATION,
        ease: FOOTER_RISE_EASE,
        stagger: FOOTER_LINE_STAGGER,
      });
      if (gameboy) {
        gsap.to(gameboy, {
          opacity: 1,
          duration: FOOTER_RISE_DURATION,
          ease: FOOTER_RISE_EASE,
        });
      }
    };

    const footerInZone = () => {
      const rect = footer.getBoundingClientRect();
      if (rect.height < 1) return false;
      // A shorter tab can pull the footer on screen without a scroll, and
      // the top can sit just below the 85% line while the footer is already
      // visible. Treat any on-screen footer as ready to reveal.
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const revealIfInZone = () => {
      if (revealed) return;
      if (footerInZone()) reveal();
    };

    const onLayout = () => {
      if (revealed) return;
      window.clearTimeout(layoutTimer);
      layoutTimer = window.setTimeout(() => {
        if (revealed) return;
        const nextHeight = document.documentElement.scrollHeight;
        const shrunk = nextHeight < lastHeight - 1;
        lastHeight = nextHeight;
        if (!shrunk) return;
        ScrollTrigger.refresh();
        revealIfInZone();
      }, 80);
    };

    const resizeObserver = new ResizeObserver(onLayout);

    const timeoutId = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollTrigger = ScrollTrigger.create({
        trigger: footer,
        start: "top 85%",
        once: true,
        onEnter: reveal,
      });
      revealIfInZone();
    }, 100);

    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", onLayout);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(layoutTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onLayout);
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTimeString(now.toLocaleTimeString("en-US", options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer ref={footerRef} id="contact" className="footer">
      <div className="footer-container page-content-shell">
        <div className="footer-left-col">
          <div className="footer-blurb">
            <h2 className="footer-title">
              <FooterLine>
                Design is better when you have{" "}
                <span className="footer-title-em">fun.</span>
              </FooterLine>
            </h2>

            <p className="footer-subtitle">
              <FooterLine>
                Not Framer. Not Webflow. Just good old-fashioned code and a lot
                of tea.
              </FooterLine>
            </p>

            <p
              className="footer-bio"
              aria-label={`© Beverly Yip. Current time in Eastern Time: ${timeString}`}
            >
              <FooterLine>© BEVERLY YIP | {timeString} ET</FooterLine>
            </p>
          </div>

          <div className="footer-links-col">
            <p className="footer-bio social-links-heading">
              <FooterLine>SAY HI</FooterLine>
            </p>
            <div
              className="social-links"
              role="navigation"
              aria-label="Social links"
            >
              {SOCIAL_LINKS.map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="social-link"
                  aria-label={external ? `${label} (opens in new tab)` : label}
                >
                  <FooterLine>
                    {label}
                    <span className="arrow" aria-hidden>
                      ↗
                    </span>
                  </FooterLine>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-right-col">
          <div ref={gameboyRef} className="footer-gameboy-wrap">
            <p className="footer-high-score">High Score: {highScore}</p>
            <Gameboy className="footer-gameboy" onGameOver={handleGameOver} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
