// Custom Cursor Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Create cursor dot element
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";

  // Force visible styling for debugging
  cursorDot.style.width = "20px";
  cursorDot.style.height = "20px";
  cursorDot.style.borderRadius = "50%";
  cursorDot.style.position = "fixed";
  cursorDot.style.zIndex = "99999";
  cursorDot.style.pointerEvents = "none";
  // Change from filled black to semi-transparent with black border
  cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  cursorDot.style.border = "2px solid black";

  document.body.appendChild(cursorDot);

  // Track mouse movement
  document.addEventListener("mousemove", function (e) {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";

    // Check cursor color based on element context
    updateCursorColor(e);

    // Check for flip animations
    checkFlipTrigger(e);
  });

  // Function to check cursor color based on element context
  function updateCursorColor(e) {
    // Don't override cursor state if it's currently being hovered
    if (
      cursorDot.classList.contains("hover") ||
      cursorDot.classList.contains("hero-role-hover")
    ) {
      return;
    }

    // First, check if cursor is over elements that should turn white
    const isOverWhiteCursorElement = e.target.closest(".cursor-white");

    if (isOverWhiteCursorElement) {
      // Cursor is over element that should be white
      cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      cursorDot.style.border = "2px solid white";
      cursorDot.classList.add("cursor-white-active");
      return;
    }

    // Check for projects section (if it exists)
    const projectsSection = document.querySelector(".projects-section");
    if (projectsSection) {
      const projectsSectionRect = projectsSection.getBoundingClientRect();
      const isOverProjectsSection =
        e.clientY >= projectsSectionRect.top &&
        e.clientY <= projectsSectionRect.bottom &&
        e.clientX >= projectsSectionRect.left &&
        e.clientX <= projectsSectionRect.right;

      if (isOverProjectsSection) {
        // Check if cursor is over a project card
        const projectCard = e.target.closest(".project-card");
        if (!projectCard) {
          // Cursor is over projects section background (not over cards)
          cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          cursorDot.style.border = "2px solid white";
          cursorDot.classList.add("cursor-white-active");
          return;
        }
      }
    }

    // Default to semi-transparent cursor with black border
    cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    cursorDot.style.border = "2px solid black";
    cursorDot.classList.remove("cursor-white-active");
  }

  // Function to check for flip trigger and animate letters
  function checkFlipTrigger(e) {
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    const flipElement = elementUnderCursor?.closest(".flip-trigger");

    if (flipElement) {
      animateLettersUnderCursor(e, flipElement);
    }
  }

  // Function to animate letters under the cursor
  function animateLettersUnderCursor(e, textElement) {
    const letters = textElement.querySelectorAll(".letter:not(.space)");
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const cursorRadius = 10; // Half of cursor size

    letters.forEach((letter) => {
      const letterRect = letter.getBoundingClientRect();
      const letterCenterX = letterRect.left + letterRect.width / 2;
      const letterCenterY = letterRect.top + letterRect.height / 2;

      // Calculate distance from cursor center to letter center
      const distance = Math.sqrt(
        Math.pow(cursorX - letterCenterX, 2) +
          Math.pow(cursorY - letterCenterY, 2)
      );

      // If cursor is close enough to the letter, animate it
      if (distance < cursorRadius + 15) {
        // 15px buffer for easier triggering
        // Only animate if not already animating
        if (!letter.classList.contains("flip")) {
          // Use only flip animation
          letter.classList.add("flip");

          // Remove animation class after animation completes
          setTimeout(() => {
            letter.classList.remove("flip");
          }, 500);
        }
      }
    });
  }

  // Function to add cursor effects to elements
  function addCursorEffects() {
    // Find all clickable elements with more comprehensive selectors
    const clickableElements = document.querySelectorAll(
      'a, button, .btn, input[type="submit"], input[type="button"], select, textarea, [role="button"], [tabindex], .nav-link, .dropdown-toggle, .dropdown-item, .nav-contact-btn, .nav-brand, .clickable, .hero-role, .flip-trigger'
    );

    // Add hover effects for cursor
    clickableElements.forEach((element) => {
      // Remove existing listeners to prevent duplicates
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);

      // Add new listeners
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  // Cursor hover handlers
  function handleMouseEnter() {
    // Check if it's a clickable element (button-like)
    const isClickable =
      this.classList.contains("clickable") ||
      this.tagName === "A" ||
      this.tagName === "BUTTON" ||
      this.tagName === "INPUT" ||
      this.getAttribute("role") === "button";

    if (this.classList.contains("flip-trigger")) {
      // Flip effect - cursor stays normal, letters flip
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
    } else if (this.classList.contains("hero-role")) {
      // Hero role keeps normal size
      cursorDot.classList.add("hero-role-hover");
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
    } else if (isClickable) {
      // Clickable elements get shrunk size
      cursorDot.classList.add("hover");
      cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)";

      // Check if it's a white cursor element
      if (
        this.classList.contains("cursor-white") ||
        this.closest(".cursor-white")
      ) {
        cursorDot.style.backgroundColor = "white";
        cursorDot.style.border = "2px solid white";
        cursorDot.classList.add("cursor-white-active");
      } else {
        cursorDot.style.backgroundColor = "black";
        cursorDot.style.border = "2px solid black";
        cursorDot.classList.remove("cursor-white-active");
      }
    } else if (
      this.classList.contains("cursor-white") ||
      this.closest(".cursor-white")
    ) {
      // Non-clickable white cursor elements keep normal size
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      cursorDot.style.border = "2px solid white";
      cursorDot.classList.add("cursor-white-active");
    } else {
      // Default behavior for other elements
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      cursorDot.style.border = "2px solid black";
    }
  }

  function handleMouseLeave() {
    // Remove special classes
    cursorDot.classList.remove("hero-role-hover", "hover");

    // Return to default state
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";

    // Check if we're still over a white cursor area
    const isOverWhiteCursor = document
      .elementFromPoint(
        cursorDot.offsetLeft + cursorDot.offsetWidth / 2,
        cursorDot.offsetTop + cursorDot.offsetHeight / 2
      )
      ?.closest(".cursor-white");

    if (isOverWhiteCursor) {
      cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      cursorDot.style.border = "2px solid white";
      cursorDot.classList.add("cursor-white-active");
    } else {
      cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      cursorDot.style.border = "2px solid black";
      cursorDot.classList.remove("cursor-white-active");
    }
  }

  // Make function globally available for navbar to use
  window.addCursorEffects = addCursorEffects;

  // Initial setup
  addCursorEffects();

  // Re-run after a short delay to catch any dynamically added elements
  setTimeout(addCursorEffects, 100);

  // Use MutationObserver to automatically detect new elements
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if any new clickable or cursor-white elements were added
        const hasNewInteractiveElements = Array.from(mutation.addedNodes).some(
          (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              return (
                (node.classList &&
                  (node.classList.contains("clickable") ||
                    node.classList.contains("cursor-white"))) ||
                (node.querySelector &&
                  (node.querySelector(".clickable") ||
                    node.querySelector(".cursor-white")))
              );
            }
            return false;
          }
        );

        if (hasNewInteractiveElements) {
          setTimeout(addCursorEffects, 50);
        }
      }
    });
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", function () {
    cursorDot.style.opacity = "0";
  });

  // Show cursor when entering window
  document.addEventListener("mouseenter", function () {
    cursorDot.style.opacity = "1";
  });

  // Add click effect
  document.addEventListener("click", function () {
    cursorDot.style.transform = "translate(-50%, -50%) scale(0.3)";

    // Fill the cursor when clicked - check if it's over a white cursor area
    const isOverWhiteCursor = document
      .elementFromPoint(
        cursorDot.offsetLeft + cursorDot.offsetWidth / 2,
        cursorDot.offsetTop + cursorDot.offsetHeight / 2
      )
      ?.closest(".cursor-white");

    if (isOverWhiteCursor) {
      cursorDot.style.backgroundColor = "white";
      cursorDot.style.border = "2px solid white";
    } else {
      cursorDot.style.backgroundColor = "black";
      cursorDot.style.border = "2px solid black";
    }

    setTimeout(() => {
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";

      // Return to appropriate state after click animation
      if (isOverWhiteCursor) {
        cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        cursorDot.style.border = "2px solid white";
        cursorDot.classList.add("cursor-white-active");
      } else {
        cursorDot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        cursorDot.style.border = "2px solid black";
        cursorDot.classList.remove("cursor-white-active");
      }
    }, 100);
  });
});
