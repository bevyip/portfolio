// Reusable Navbar Component JavaScript

// Make function globally available for use in other files
window.initializeNavbar = function () {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    // Toggle mobile menu
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.classList.add("menu-open");

        // Trigger cursor system to re-scan for new elements
        if (window.addCursorEffects) {
          window.addCursorEffects();
        }
      } else {
        document.body.classList.remove("menu-open");
      }

      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains("active");
      navToggle.setAttribute("aria-expanded", isExpanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !navToggle.contains(event.target) &&
        !navMenu.contains(event.target)
      ) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Handle dropdown hover on touch devices
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    let timeout;

    dropdown.addEventListener("mouseenter", function () {
      clearTimeout(timeout);
      this.querySelector(".dropdown-menu").style.opacity = "1";
      this.querySelector(".dropdown-menu").style.visibility = "visible";
      this.querySelector(".dropdown-menu").style.transform = "translateY(0)";
    });

    dropdown.addEventListener("mouseleave", function () {
      timeout = setTimeout(() => {
        this.querySelector(".dropdown-menu").style.opacity = "0";
        this.querySelector(".dropdown-menu").style.visibility = "hidden";
        this.querySelector(".dropdown-menu").style.transform =
          "translateY(-10px)";
      }, 150);
    });
  });

  // Add smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        const targetElement = document.querySelector(href);

        if (targetElement) {
          e.preventDefault();

          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains("active")) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
            navToggle.setAttribute("aria-expanded", "false");
          }

          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Track scroll position to reset navigation states
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    // Clear existing timeout
    clearTimeout(scrollTimeout);

    // Set a new timeout to debounce scroll events
    scrollTimeout = setTimeout(function () {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if we're near the footer (within 100px of the bottom)
      const isNearFooter =
        scrollPosition + windowHeight >= documentHeight - 100;

      // Get all navigation links
      const navLinks = document.querySelectorAll(".nav-link");

      navLinks.forEach((link) => {
        // Remove any active states that might be persisting
        link.classList.remove("active");

        // If we're not near the footer, ensure contact link is in default state
        if (!isNearFooter && link.getAttribute("href") === "#footer") {
          // Force a reflow to reset any CSS hover states
          link.style.pointerEvents = "none";
          setTimeout(() => {
            link.style.pointerEvents = "";
          }, 10);
        }
      });
    }, 100); // 100ms debounce
  });
};
