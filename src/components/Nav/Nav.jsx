import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { usePlayPage } from "../../contexts/PlayPageContext";

gsap.registerPlugin(ScrollTrigger);
import "./Nav.css";
import pfp1 from "../../assets/img/pfp1.png";
import pfp2 from "../../assets/img/pfp2.png";
import pfp3 from "../../assets/img/pfp3.png";
import pfp4 from "../../assets/img/pfp4.png";
import pfp5 from "../../assets/img/pfp5.png";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const navItemsTweenRef = useRef(null);
  const hamburgerTweenRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const navRef = useRef(null);

  const images = [pfp1, pfp2, pfp3, pfp4, pfp5];
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    const savedIndex = localStorage.getItem("navLogoIndex");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("navLogoIndex", currentImageIndex.toString());
    // Dispatch custom event to notify favicon update
    window.dispatchEvent(new CustomEvent("logoChanged"));
  }, [currentImageIndex]);

  const handleLogoClick = (e) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);

    // Reset navbar color state since we're going to landing section
    setIsOverWorkSection(false);

    // Always update URL to root (remove any hash)
    if (location.pathname === "/") {
      e.preventDefault();
      // Update URL to root, removing any hash
      window.history.pushState(null, "", "/");
      // Scroll to top
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.2,
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Navigate to root and scroll to top
      navigate("/");
      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(0, {
            duration: 1.2,
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const navItems = [
    { label: "ABOUT", href: "/about", isLink: true },
    { label: "WORK", href: "#work", isLink: false },
    { label: "PLAY", href: "/play", isLink: true },
    {
      label: "RESUME",
      href: "https://drive.google.com/file/d/1t8BBP__xqK7TDSD1hLv0WFaMLLgeufTK/view?usp=sharing",
      isLink: true,
    },
  ];

  const isPlayPage = location.pathname === "/play";
  const isAboutPage = location.pathname === "/about";
  const { isGridVisible, isBentoVisible } = usePlayPage();
  const [isOverWorkSection, setIsOverWorkSection] = useState(false);

  const shouldUseWhiteText =
    (isPlayPage && isGridVisible && !isBentoVisible) ||
    isAboutPage ||
    isOverWorkSection;

  // Detect when nav is overlaying work section (dark) vs landing section (light)
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsOverWorkSection(false);
      return; // Only on home page
    }

    const checkOverlay = () => {
      const nav = navRef.current;
      const landingSection = document.getElementById("landing");
      const workSection = document.getElementById("work");

      if (!nav || !landingSection || !workSection) return;

      // Get the bottom of the nav (where it overlaps content)
      const navRect = nav.getBoundingClientRect();
      const navBottom = navRect.bottom;

      // Get section positions
      const landingRect = landingSection.getBoundingClientRect();
      const workRect = workSection.getBoundingClientRect();

      // Check if the work section has scrolled up enough to be behind the nav
      // Since landing is fixed (100vh), when work section top reaches nav bottom,
      // the nav is overlaying the work section (dark background)
      // Also check if nav bottom has passed the landing section bottom
      const isOverWork =
        workRect.top <= navBottom || navBottom > landingRect.bottom;

      // If nav is overlaying work section, use light mode (white text/brighter logo)
      setIsOverWorkSection(isOverWork);
    };

    // Check on scroll
    const handleScroll = () => {
      checkOverlay();
    };

    // Check on resize
    const handleResize = () => {
      checkOverlay();
    };

    // Initial check
    checkOverlay();

    // Use Lenis scroll event if available, otherwise use window scroll
    if (lenis) {
      lenis.on("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        lenis.off("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    } else {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [location.pathname, lenis]);

  // Animate navbar dropping in from top on all pages
  useEffect(() => {
    if (!navRef.current) return;

    // Set initial state - position above viewport
    gsap.set(navRef.current, {
      y: -100,
      opacity: 0,
    });

    // Calculate delay based on page
    let delay = 0;
    const isLandingPage = location.pathname === "/";
    const isAboutPage = location.pathname === "/about";
    const isPlayPage = location.pathname === "/play";
    const isConfidoPage = location.pathname === "/confido";
    const isVenmoPage = location.pathname === "/venmo";
    const isWholeFoodsPage = location.pathname === "/wholefoods";
    const isMoodlePage = location.pathname === "/moodle";

    if (isLandingPage) {
      // Landing page: after Spline, title, and subtitle
      // Spline: ~1.5s, Title parts: ~1.0s each (overlapping), Subtitle: ~1.2s
      // Title completes around ~2.0s, subtitle completes around ~2.9s
      delay = 2.7;
    } else if (isAboutPage) {
      // About page: after all paragraphs complete
      // Last paragraph starts at 4s, duration 0.8s, completes at 4.8s
      delay = 3.8;
    } else if (isPlayPage) {
      // Play page: after "where I design..." animation completes
      // Text animation: delay 0.3s, left text ~1.2s, right text ("where I design...") ~2.2s
      // Right text completes around 2.2s after content becomes visible
      delay = 2.3; // 2.2s + small buffer
    } else if (
      isConfidoPage ||
      isVenmoPage ||
      isWholeFoodsPage ||
      isMoodlePage
    ) {
      // Case study pages: after hero-before (1.2s) and hero text (1s) complete
      // Hero-before completes at 1.2s, hero text starts at 1.2s and completes at 2.2s
      delay = 2.2;
    } else {
      // Other pages: drop immediately
      delay = 0;
    }

    // Create timeline for navbar animation
    const navTl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    navTl.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: delay,
    });

    return () => {
      navTl.kill();
    };
  }, [location.pathname]);

  useEffect(() => {
    const layout = () => {
      const isDesktop = window.innerWidth > 768;
      const isLastPill = (index) => index === navItems.length - 1;

      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;
        const shouldAnimateCircle = !isDesktop || isLastPill(index);

        if (shouldAnimateCircle) {
          circle.style.width = `${D}px`;
          circle.style.height = `${D}px`;
          circle.style.bottom = `-${delta}px`;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`,
          });
        } else {
          gsap.set(circle, {
            opacity: 0,
            scale: 0,
            display: "none",
          });
        }

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        if (shouldAnimateCircle) {
          tl.to(
            circle,
            {
              scale: 1.2,
              xPercent: -50,
              duration: 2,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );
        }

        if (label) {
          tl.to(
            label,
            {
              y: -(h + 8),
              duration: 2,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            {
              y: 0,
              opacity: 1,
              duration: 2,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, y: "-100%" });
    }

    return () => window.removeEventListener("resize", onResize);
  }, [shouldUseWhiteText]);

  // Effect to sync hamburger lines with menu state
  useEffect(() => {
    const hamburger = hamburgerRef.current;
    if (!hamburger) return;

    const lines = hamburger.querySelectorAll(".hamburger-line");
    if (lines.length >= 2) {
      if (isMobileMenuOpen) {
        gsap.set(lines[0], { rotation: 45, y: 3 });
        gsap.set(lines[1], { rotation: -45, y: -3 });
      } else {
        gsap.set(lines[0], { rotation: 0, y: 0 });
        gsap.set(lines[1], { rotation: 0, y: 0 });
      }
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const isDesktop = window.innerWidth > 768;
    if (!isDesktop) return;

    const navItems = navItemsRef.current?.children;
    const hamburger = hamburgerRef.current;

    if (!navItems || navItems.length === 0 || !hamburger) return;

    // Skip Play page - it has its own ScrollTrigger setup that conflicts
    const isPlayPage = location.pathname === "/play";

    // Only reset navlinks if we're at the top of the page (not scrolled)
    // This prevents navlinks from reappearing when menu opens while scrolled
    const getScrollPosition = () => {
      if (lenis) {
        return lenis.scroll;
      }
      return window.scrollY || document.documentElement.scrollTop;
    };

    const currentScrollY = getScrollPosition();
    const isScrolledDown = currentScrollY > 100;

    if (isScrolledDown) {
      // Keep navlinks hidden if we're scrolled down
      gsap.set(navItems, { x: 100, opacity: 0 });
      Array.from(navItems).forEach((item) => {
        item.style.pointerEvents = "none";
      });
      // Show hamburger if scrolled down
      gsap.set(hamburger, { opacity: 1, scale: 1, display: "flex" });
      hamburger.style.pointerEvents = "auto";
    } else {
      gsap.set(navItems, { x: 0, opacity: 1 });
      gsap.set(hamburger, { opacity: 0, scale: 0.8, display: "flex" });
      hamburger.style.pointerEvents = "none";
    }

    // Ensure hamburger lines are in correct state initially
    const lines = hamburger.querySelectorAll(".hamburger-line");
    if (lines.length >= 2 && !isMobileMenuOpen) {
      gsap.set(lines[0], { rotation: 0, y: 0 });
      gsap.set(lines[1], { rotation: 0, y: 0 });
    }

    // On Play page, use scroll event listener instead of ScrollTrigger to avoid conflicts
    if (isPlayPage) {
      let wasScrolledDown = isScrolledDown;

      const handleScroll = () => {
        const scrollY = getScrollPosition();
        const scrolled = scrollY > 100;

        if (scrolled && !wasScrolledDown) {
          // Scrolled down - hide navlinks, show hamburger
          if (navItemsTweenRef.current) {
            navItemsTweenRef.current.kill();
          }
          if (hamburgerTweenRef.current) {
            hamburgerTweenRef.current.kill();
          }

          navItemsTweenRef.current = gsap.to(navItems, {
            x: 100,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              Array.from(navItems).forEach((item) => {
                item.style.pointerEvents = "none";
              });
              navItemsTweenRef.current = null;
            },
          });

          hamburgerTweenRef.current = gsap.to(hamburger, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            overwrite: true,
            onComplete: () => {
              hamburger.style.pointerEvents = "auto";
              hamburgerTweenRef.current = null;
            },
          });
          wasScrolledDown = true;
        } else if (!scrolled && wasScrolledDown) {
          // Scrolled to top - show navlinks, hide hamburger
          if (navItemsTweenRef.current) {
            navItemsTweenRef.current.kill();
          }
          if (hamburgerTweenRef.current) {
            hamburgerTweenRef.current.kill();
          }

          hamburgerTweenRef.current = gsap.to(hamburger, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              hamburger.style.pointerEvents = "none";
              hamburgerTweenRef.current = null;
            },
          });

          Array.from(navItems).forEach((item) => {
            item.style.pointerEvents = "auto";
          });

          navItemsTweenRef.current = gsap.to(navItems, {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              navItemsTweenRef.current = null;
            },
          });
          wasScrolledDown = false;
        }
      };

      // Use Lenis scroll event if available, otherwise window scroll
      if (lenis) {
        lenis.on("scroll", handleScroll);
      } else {
        window.addEventListener("scroll", handleScroll);
      }

      // Initial check
      handleScroll();

      return () => {
        if (lenis) {
          lenis.off("scroll", handleScroll);
        } else {
          window.removeEventListener("scroll", handleScroll);
        }
        if (navItemsTweenRef.current) {
          navItemsTweenRef.current.kill();
          navItemsTweenRef.current = null;
        }
        if (hamburgerTweenRef.current) {
          hamburgerTweenRef.current.kill();
          hamburgerTweenRef.current = null;
        }
      };
    }

    // For all other pages, use ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "100px top",
      onEnter: () => {
        // Kill any ongoing animations to prevent overlap
        if (navItemsTweenRef.current) {
          navItemsTweenRef.current.kill();
        }
        if (hamburgerTweenRef.current) {
          hamburgerTweenRef.current.kill();
        }

        // Reset hamburger lines to default state when showing via scroll (only if menu is closed)
        const lines = hamburger.querySelectorAll(".hamburger-line");
        if (lines.length >= 2 && !isMobileMenuOpen) {
          gsap.set(lines[0], { rotation: 0, y: 0 });
          gsap.set(lines[1], { rotation: 0, y: 0 });
        }

        // Animate navlinks out
        navItemsTweenRef.current = gsap.to(navItems, {
          x: 100,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => {
            Array.from(navItems).forEach((item) => {
              item.style.pointerEvents = "none";
            });
            navItemsTweenRef.current = null;
          },
        });

        // Animate hamburger in
        hamburgerTweenRef.current = gsap.to(hamburger, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.2,
          overwrite: true,
          onComplete: () => {
            hamburger.style.pointerEvents = "auto";
            hamburgerTweenRef.current = null;
          },
        });
      },
      onLeaveBack: () => {
        // Kill any ongoing animations to prevent overlap
        if (navItemsTweenRef.current) {
          navItemsTweenRef.current.kill();
        }
        if (hamburgerTweenRef.current) {
          hamburgerTweenRef.current.kill();
        }

        // Reset hamburger lines to default state when hiding via scroll
        const lines = hamburger.querySelectorAll(".hamburger-line");
        if (lines.length >= 2 && !isMobileMenuOpen) {
          gsap.set(lines[0], { rotation: 0, y: 0 });
          gsap.set(lines[1], { rotation: 0, y: 0 });
        }

        // Animate hamburger out
        hamburgerTweenRef.current = gsap.to(hamburger, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          overwrite: true,
          onComplete: () => {
            hamburger.style.pointerEvents = "none";
            hamburgerTweenRef.current = null;
          },
        });

        // Enable pointer events for navlinks
        Array.from(navItems).forEach((item) => {
          item.style.pointerEvents = "auto";
        });

        // Animate navlinks in
        navItemsTweenRef.current = gsap.to(navItems, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
          delay: 0.1,
          overwrite: true,
          onComplete: () => {
            navItemsTweenRef.current = null;
          },
        });
      },
    });

    const handleOverlayChange = () => {
      if (document.body.classList.contains("photo-overlay-open")) {
        scrollTrigger.disable();
      } else {
        scrollTrigger.enable();
        scrollTrigger.refresh();
      }
    };

    const observer = new MutationObserver(handleOverlayChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      scrollTrigger.kill();
      // Kill any ongoing animations on cleanup
      if (navItemsTweenRef.current) {
        navItemsTweenRef.current.kill();
        navItemsTweenRef.current = null;
      }
      if (hamburgerTweenRef.current) {
        hamburgerTweenRef.current.kill();
        hamburgerTweenRef.current = null;
      }
    };
  }, [isMobileMenuOpen, location.pathname, lenis]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleWorkClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const workSection = document.getElementById("work");
      if (workSection) {
        if (lenis) {
          lenis.scrollTo(workSection, {
            offset: 0,
            duration: 1.2,
          });
        } else {
          workSection.scrollIntoView({ behavior: "smooth" });
        }
      }
      // Update URL to include hash
      window.history.pushState(null, "", "/#work");
    } else {
      // Immediately set navbar to white text mode since we're navigating to work section
      setIsOverWorkSection(true);
      navigate("/#work");
      setTimeout(() => {
        const workSection = document.getElementById("work");
        if (workSection) {
          if (lenis) {
            lenis.scrollTo(workSection, {
              offset: 0,
              duration: 1.2,
            });
          } else {
            workSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    }
  };

  const handleResumeClick = (e) => {
    e.preventDefault();
    window.open(
      "https://drive.google.com/file/d/1t8BBP__xqK7TDSD1hLv0WFaMLLgeufTK/view?usp=sharing",
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Cleanup effect to resume scrolling on unmount
  useEffect(() => {
    return () => {
      if (isMobileMenuOpen) {
        if (lenis) {
          lenis.start();
        } else {
          document.body.classList.remove("mobile-menu-open");
        }
      }
    };
  }, [isMobileMenuOpen, lenis]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    // Handle scroll lock using Lenis (if available) or body class
    if (newState) {
      // Stop Lenis scrolling if available
      if (lenis) {
        lenis.stop();
      } else {
        // Fallback: use body class for non-Lenis scrolling
        document.body.classList.add("mobile-menu-open");
      }
    } else {
      // Resume Lenis scrolling if available
      if (lenis) {
        lenis.start();
      } else {
        // Fallback: remove body class
        document.body.classList.remove("mobile-menu-open");
      }
    }

    if (hamburger) {
      // Ensure hamburger is always visible and on top when menu opens
      if (newState) {
        gsap.set(hamburger, { opacity: 1, scale: 1, zIndex: 1000 });
        hamburger.style.pointerEvents = "auto";
      }

      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], {
          rotation: 45,
          y: 3,
          duration: 0.3,
          ease: "power3.easeOut",
        });
        gsap.to(lines[1], {
          rotation: -45,
          y: -3,
          duration: 0.3,
          ease: "power3.easeOut",
        });
      } else {
        gsap.to(lines[0], {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.easeOut",
        });
        gsap.to(lines[1], {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.easeOut",
        });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible", opacity: 1 });
        gsap.fromTo(
          menu,
          { y: "-100%" },
          {
            y: "0%",
            duration: 0.9,
            ease: "power3.easeOut",
          }
        );
      } else {
        gsap.to(menu, {
          y: "-100%",
          duration: 0.7,
          ease: "power3.easeOut",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }
  };

  return (
    <nav
      ref={navRef}
      className={`top-0 z-[100] relative ${
        shouldUseWhiteText ? "nav-play-page" : ""
      } ${isAboutPage ? "nav-about-page" : ""}`}
      style={{
        opacity: 0,
        transform: "translateY(-100px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24 relative">
          <Link to="/" onClick={handleLogoClick} className="logo-link">
            <img
              src={images[currentImageIndex]}
              alt="site-logo"
              className="logo-image"
            />
          </Link>
          <ul className="pill-list desktop-only" ref={navItemsRef}>
            {navItems.map((item, i) => (
              <li key={item.href || `item-${i}`}>
                {item.isLink ? (
                  item.label === "RESUME" ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleResumeClick}
                      className="pill pill-resume"
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="pill"
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  )
                ) : item.label === "WORK" ? (
                  <a
                    href="#work"
                    onClick={handleWorkClick}
                    className="pill"
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          <button
            className={`mobile-menu-button ${
              isMobileMenuOpen ? "menu-open" : ""
            } ${shouldUseWhiteText ? "hamburger-white" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            ref={hamburgerRef}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
      <div className="mobile-menu-popover" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {navItems.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              {item.isLink ? (
                <Link
                  to={item.href}
                  className="mobile-menu-link"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleMobileMenu();
                  }}
                >
                  {item.label}
                </Link>
              ) : item.label === "WORK" ? (
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    toggleMobileMenu();
                    handleWorkClick(e);
                  }}
                  className="mobile-menu-link"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  href="https://drive.google.com/file/d/1t8BBP__xqK7TDSD1hLv0WFaMLLgeufTK/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    toggleMobileMenu();
                    handleResumeClick(e);
                  }}
                  className="mobile-menu-link"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
