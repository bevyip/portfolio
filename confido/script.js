// Confido Case Study - Interactive Features
document.addEventListener("DOMContentLoaded", function () {
  // Progress bar functionality
  function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Ensure progress bar doesn't exceed 100%
    const clampedPercent = Math.min(scrollPercent, 100);
    progressBar.style.width = `${clampedPercent}%`;
  }

  // Throttled scroll handler for progress bar
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgressBar();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Add scroll event listener for progress bar
  window.addEventListener("scroll", requestTick, { passive: true });

  // Initialize cursor effects for this page
  if (window.addCursorEffects) {
    // Wait a bit for cursor.js to fully initialize
    setTimeout(() => {
      window.addCursorEffects();
    }, 200);
  }

  // Add cursor effects to clickable elements on this page
  function addConfidoCursorEffects() {
    const clickableElements = document.querySelectorAll(
      "a, button, .btn, .clickable"
    );

    clickableElements.forEach((element) => {
      element.classList.add("clickable");
    });
  }

  // Run cursor effects setup
  addConfidoCursorEffects();

  // Re-run after navbar loads
  setTimeout(addConfidoCursorEffects, 500);
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add smooth reveal animation for sections
window.addEventListener(
  "scroll",
  throttle(() => {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  }, 100)
);

// Simple intersection observer for text animation
function initTextAnimation() {
  const textElements = document.querySelectorAll(".text-animate");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is fully in view
    }
  );

  textElements.forEach((element) => {
    observer.observe(element);
  });
}

// Fade-in animation for hero visual and other fade-in elements
function initFadeInAnimation() {
  const fadeInElements = document.querySelectorAll(".fade-in");

  const fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeInObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is fully in view
    }
  );

  fadeInElements.forEach((element) => {
    fadeInObserver.observe(element);
  });
}

// Scroll-driven project card animation
function initProjectCardScrollAnimation() {
  const projectCards = document.querySelectorAll(".project-card");
  const seeNextSection = document.querySelector(".see-next-section");

  if (!projectCards.length || !seeNextSection) return;

  function updateCardPositions() {
    const projectCards = document.querySelectorAll(".project-card");
    const seeNextSection = document.querySelector(".see-next-section");
    const projectCardsContainer = document.querySelector(".project-cards");

    if (!projectCards.length || !seeNextSection || !projectCardsContainer)
      return;

    const sectionRect = seeNextSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = sectionRect.height;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the section (0 to 1)
    let scrollProgress = 0;

    // Only start animation when section is actually in view
    if (sectionTop < viewportHeight && sectionTop > -sectionHeight) {
      // Section is in view, calculate progress
      const visibleHeight = viewportHeight - sectionTop;
      scrollProgress = Math.min(visibleHeight / (sectionHeight + 200), 1); // +200 for extra scroll room
    }

    // Only calculate gap for horizontal spread layout (large screens)
    if (window.innerWidth > 1024) {
      // Gradually restore gap as cards spread out
      const finalGap = 32; // var(--spacing-xl) = 32px
      const currentGap = finalGap * scrollProgress;
      projectCardsContainer.style.gap = `${currentGap}px`;
    }

    // Apply positioning based on scroll progress
    // Cards start overlapping in center and spread out to final positions
    // On medium screens and below, cards use simple flexbox layout
    if (window.innerWidth <= 1024) {
      // Simple flexbox layout for medium screens and below
      projectCards.forEach((card) => {
        card.style.transform = "none";
        card.style.position = "relative";
        card.style.left = "auto";
        card.style.width = "100%"; // Take full width of their column
      });
      projectCardsContainer.style.flexDirection = "column";
      projectCardsContainer.style.alignItems = "center";
      projectCardsContainer.style.gap = "var(--spacing-xl)"; // Use CSS gap
    } else {
      // Complex scroll-driven spread animation for large screens only
      // Reset any inline styles that might interfere with row layout
      projectCards.forEach((card) => {
        card.style.width = ""; // Remove inline width to let CSS take over
        card.style.position = "absolute";
        card.style.left = "50%";
      });

      projectCards.forEach((card, index) => {
        if (index === 0) {
          // Left card - starts at center, moves to left
          const spreadDistance = Math.min(500, window.innerWidth * 0.3);
          const translateX = -spreadDistance * scrollProgress;
          card.style.transform = `translateX(-50%) translateX(${translateX}px)`;
        } else if (index === 1) {
          // Center card - stays at center
          card.style.transform = "translateX(-50%)";
        } else if (index === 2) {
          // Right card - starts at center, moves to right
          const spreadDistance = Math.min(500, window.innerWidth * 0.3);
          const translateX = spreadDistance * scrollProgress;
          card.style.transform = `translateX(-50%) translateX(${translateX}px)`;
        }
      });
      projectCardsContainer.style.flexDirection = "row";
    }
  }

  // Update on scroll
  window.addEventListener("scroll", throttle(updateCardPositions, 16)); // 60fps

  // Update on resize to maintain responsive positioning
  window.addEventListener("resize", throttle(updateCardPositions, 100));

  // Calculate and set equal heights for all cards
  function setEqualCardHeights() {
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length === 0) return;

    // Reset heights to auto to get natural heights
    projectCards.forEach((card) => {
      card.style.height = "auto";
    });

    // Find the tallest card
    let maxHeight = 0;
    projectCards.forEach((card) => {
      const cardHeight = card.offsetHeight;
      maxHeight = Math.max(maxHeight, cardHeight);
    });

    // Apply the max height to all cards
    projectCards.forEach((card) => {
      card.style.height = `${maxHeight}px`;
    });
  }

  // Set equal heights initially and on resize
  setEqualCardHeights();
  window.addEventListener("resize", throttle(setEqualCardHeights, 100));

  // Initial position
  updateCardPositions();
}

// Counter animation for metric numbers
function initCounterAnimation() {
  const metricNumbers = document.querySelectorAll(".metric-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  metricNumbers.forEach((metric) => {
    counterObserver.observe(metric);
  });
}

function animateCounter(element) {
  // Get target number from data attribute
  const targetNumber = parseInt(element.getAttribute("data-target"));
  const duration = 1500;
  const steps = 30;
  const stepDuration = duration / steps;
  let currentStep = 0;

  // Always start from 0
  element.textContent = "0%";

  const timer = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const currentNumber = Math.floor(targetNumber * progress);

    // Update the element with the current number
    element.textContent = currentNumber + "%";

    if (currentStep >= steps) {
      // Animation complete, ensure we end at the exact target number
      element.textContent = targetNumber + "%";
      clearInterval(timer);
    }
  }, stepDuration);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initTextAnimation();
  initCounterAnimation();
  initFadeInAnimation();
  initProjectCardScrollAnimation();
});

// Also initialize after navbar loads
setTimeout(() => {
  initTextAnimation();
  initCounterAnimation();
  initFadeInAnimation();
  initProjectCardScrollAnimation();
}, 500);

// Toggle priority card content
// Called from HTML onclick attributes
window.togglePriorityCard = function (header) {
  const card = header.closest(".priority-card");
  const content = card.querySelector(".priority-visual, .priority-content");
  const chevron = header.querySelector(".priority-chevron, .chevron");

  if (content.classList.contains("collapsed")) {
    content.classList.remove("collapsed");
    content.classList.add("expanded");
    chevron.classList.add("rotated");
  } else {
    content.classList.remove("expanded");
    content.classList.add("collapsed");
    chevron.classList.remove("rotated");
  }
};

// Smooth scroll to final solution section
window.scrollToSolution = function () {
  const targetSection = document.querySelector(".final-design-section");
  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
