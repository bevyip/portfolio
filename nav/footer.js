// Footer Component JavaScript

function initializeFooter() {
  // Add back to top functionality
  const backToTopLink = document.getElementById("back-to-top");
  if (backToTopLink) {
    backToTopLink.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToTop();
    });
  }

  // Footer floating animation on scroll
  const animateFooterElements = () => {
    const footerLeft = document.querySelector(".footer-left");
    const footerSocial = document.querySelector(".footer-social");
    const footerBottomRow = document.querySelector(".footer-bottom-row");

    if (footerLeft && footerSocial && footerBottomRow) {
      const footerRect = footerLeft.getBoundingClientRect();
      const isInViewport =
        footerRect.top <= window.innerHeight * 0.8 && footerRect.bottom >= 0;

      if (isInViewport && !footerLeft.classList.contains("floating-in")) {
        // Animate CTA first
        footerLeft.classList.add("floating-in");

        // Animate social links after 0.8s delay (reduced from 1.2s)
        setTimeout(() => {
          footerSocial.classList.add("floating-in");
        }, 800);

        // Animate bottom row after 1.6s delay (reduced from 2.4s)
        setTimeout(() => {
          footerBottomRow.classList.add("floating-in");
        }, 1600);
      }
    }
  };

  // Call on initial load
  animateFooterElements();

  // Add scroll listener for footer animations
  window.addEventListener(
    "scroll",
    () => {
      animateFooterElements();
    },
    { passive: true }
  );
}

// Scroll to top function for footer
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Make functions globally available
window.initializeFooter = initializeFooter;
window.scrollToTop = scrollToTop;
