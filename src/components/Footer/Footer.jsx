import { useEffect, useState, useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./Footer.css";

/** X (Twitter) brand mark — filled path scales with `currentColor` */
function XLogo({ size = 22, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger, SplitText);

const Footer = () => {
  const [timeString, setTimeString] = useState("Loading...");
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const socialLinksRef = useRef(null);

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
      const time = now.toLocaleTimeString("en-US", options);
      setTimeString(`© BEVERLY YIP | ${time} EST`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Single ScrollTrigger on footer container: one timeline for title, subtitle, and links
  useEffect(() => {
    const container = containerRef.current;
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    const socialLinksContainer = socialLinksRef.current;
    if (!container || !titleElement || !subtitleElement || !socialLinksContainer) return;

    const links = socialLinksContainer.querySelectorAll(".social-link");
    let splitInstance = null;
    let scrollTrigger = null;
    let tl = null;

    const timeoutId = setTimeout(() => {
      splitInstance = new SplitText(titleElement, {
        type: "chars",
        charsClass: "footer-char",
      });

      gsap.set(splitInstance.chars, { opacity: 0, y: 40 });
      gsap.set(subtitleElement, { opacity: 0, y: 20 });
      gsap.set(links, { opacity: 0, y: 20 });

      tl = gsap.timeline({ paused: true });
      tl.to(splitInstance.chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: "power3.out",
      })
        .to(
          subtitleElement,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          links,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2"
        );

      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        invalidateOnRefresh: true,
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) scrollTrigger.kill();
      if (tl) tl.kill();
      if (splitInstance) {
        try {
          splitInstance.revert();
        } catch (e) {
          // Ignore revert errors
        }
      }
    };
  }, []);

  return (
    <footer id="contact" className="footer">
      <div ref={containerRef} className="footer-container">
        <p ref={subtitleRef} className="footer-subtitle">
          Not Framer. Not Webflow. Just good old-fashioned code and a lot of
          tea.
        </p>

        <h2 ref={titleRef} className="footer-title">
          <span className="work">Let's get in touch</span>
          <span className="me">.</span>
        </h2>

        <div ref={socialLinksRef} className="social-links">
          <a
            href="https://www.linkedin.com/in/bevyip/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn (opens in new tab)"
          >
            <Linkedin className="social-logo" size={22} strokeWidth={1.75} aria-hidden />
            <span className="arrow" aria-hidden>
              ↗
            </span>
          </a>
          <a
            href="https://github.com/bevyip"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub (opens in new tab)"
          >
            <Github className="social-logo" size={22} strokeWidth={1.75} aria-hidden />
            <span className="arrow" aria-hidden>
              ↗
            </span>
          </a>
          <a
            href="https://x.com/bevdesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="X (opens in new tab)"
          >
            <XLogo size={20} className="social-logo social-logo--x" />
            <span className="arrow" aria-hidden>
              ↗
            </span>
          </a>
          <a
            href="mailto:beverly.yip.8000@gmail.com"
            className="social-link"
            aria-label="Email"
          >
            <Mail className="social-logo" size={22} strokeWidth={1.75} aria-hidden />
            <span className="arrow" aria-hidden>
              ↗
            </span>
          </a>
        </div>

        <p className="footer-bio">{timeString}</p>
      </div>
    </footer>
  );
};

export default Footer;
