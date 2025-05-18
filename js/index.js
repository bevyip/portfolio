document.addEventListener("DOMContentLoaded", () => {
  // Colors for fireworks and confetti
  const fireworkColors = [
    "#ff0000", // bright red
    "#ff4000", // bright orange
    "#ffff00", // bright yellow
    "#00ff00", // bright green
    "#0000ff", // bright blue
    "#ff00ff", // bright magenta
    "#00ffff", // bright cyan
  ];

  const confettiColors = [
    "#ff0000", // red
    "#ff7f00", // orange
    "#ffff00", // yellow
    "#00ff00", // green
    "#0000ff", // blue
    "#4b0082", // indigo
    "#9400d3", // violet
    "#ff69b4", // pink
    "#00ffff", // cyan
    "#ff00ff", // magenta
  ];

  // Function to create firework effect
  function createFirework(x, y) {
    const numStreaks = 6 + Math.floor(Math.random() * 4);
    const color =
      fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    const header = document.querySelector("header");
    const headerRect = header.getBoundingClientRect();
    const relativeX = x - headerRect.left;
    const relativeY = y - headerRect.top;

    for (let i = 0; i < numStreaks; i++) {
      const firework = document.createElement("div");
      firework.className = "firework";

      // Random angle and distance for each streak
      const angle =
        (Math.PI * 2 * i) / numStreaks + (Math.random() - 0.5) * 0.5;
      const distance = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      // Set position and animation variables
      firework.style.left = `${relativeX}px`;
      firework.style.top = `${relativeY}px`;
      firework.style.backgroundColor = color;
      firework.style.setProperty("--tx", `${tx}px`);
      firework.style.setProperty("--ty", `${ty}px`);

      // Random delay for each streak
      firework.style.animationDelay = `${Math.random() * 0.1}s`;

      header.appendChild(firework);

      // Remove after animation
      setTimeout(() => {
        firework.remove();
      }, 1000);
    }
  }

  // Function to create confetti effect
  function createConfetti(x, y) {
    const numPieces = 4 + Math.floor(Math.random() * 3);
    const header = document.querySelector("header");
    const headerRect = header.getBoundingClientRect();
    const relativeX = x - headerRect.left;
    const relativeY = y - headerRect.top;

    for (let i = 0; i < numPieces; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // Random angle and distance for each piece
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      // Random rotation
      const rotation = (Math.random() - 0.5) * 720;

      // Set position and animation variables
      confetti.style.left = `${relativeX}px`;
      confetti.style.top = `${relativeY}px`;
      confetti.style.backgroundColor =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.setProperty("--tx", `${tx}px`);
      confetti.style.setProperty("--ty", `${ty}px`);
      confetti.style.setProperty("--rotation", `${rotation}deg`);

      // Random shape
      const shape = Math.random();
      if (shape < 0.3) {
        confetti.style.borderRadius = "50%";
      } else if (shape < 0.6) {
        confetti.style.borderRadius = "0";
      } else {
        confetti.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      }

      // Random delay for each piece
      confetti.style.animationDelay = `${Math.random() * 0.2}s`;

      header.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 1500);
    }
  }

  // Function to wrap each character in a span
  function wrapCharacters(element) {
    const text = element.textContent;
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.textContent = text[i];
      element.appendChild(span);
    }
  }

  // Wrap characters for each animated word
  ["accessible", "delightful", "intuitive"].forEach((id) => {
    const element = document.getElementById(id);
    wrapCharacters(element);

    // Add underline element for intuitive
    if (id === "intuitive") {
      const underline = document.createElement("div");
      underline.className = "intuitive-underline";
      element.appendChild(underline);
    }
  });

  // Handle hover animation
  const animatedWords = document.querySelectorAll(".animated-word");
  animatedWords.forEach((word) => {
    const chars = word.querySelectorAll("span");
    let lastEffectTime = 0;
    const effectInterval = 400;

    word.addEventListener("mousemove", (e) => {
      const rect = word.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const charWidth = rect.width / chars.length;
      const hoveredCharIndex = Math.floor(x / charWidth);

      chars.forEach((char, index) => {
        if (index === hoveredCharIndex) {
          char.style.transform = "translateY(-15px)";
        } else {
          char.style.transform = "translateY(0)";
        }
      });

      // Add effects based on word
      if (word.id === "delightful") {
        const currentTime = Date.now();
        if (currentTime - lastEffectTime >= effectInterval) {
          createFirework(e.clientX, e.clientY);
          createConfetti(e.clientX, e.clientY);
          lastEffectTime = currentTime;
        }
      } else if (word.id === "intuitive") {
        const underline = word.querySelector(".intuitive-underline");
        if (underline) {
          const relativeX = e.clientX - rect.left;
          const underlineWidth = 30; // Same as CSS
          const maxLeft = rect.width - underlineWidth;
          const left = Math.min(
            Math.max(0, relativeX - underlineWidth / 2),
            maxLeft
          );
          underline.style.left = `${left}px`;
        }
      }
    });

    word.addEventListener("mouseleave", () => {
      chars.forEach((char) => {
        char.style.transform = "translateY(0)";
      });
    });
  });

  // Existing fade-in animation code
  const rows = document.querySelectorAll(".proj-overview-content");
  const fadeInElements = document.querySelectorAll(".fade-in");

  // Function to check if element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  };

  // Handle initial visibility
  const handleInitialVisibility = () => {
    rows.forEach((row) => {
      if (isInViewport(row) && !row.classList.contains("has-appeared")) {
        row.classList.add("visible");
        row.classList.add("has-appeared"); // Mark as having appeared
      }
    });

    fadeInElements.forEach((el) => {
      if (isInViewport(el) && !el.classList.contains("has-appeared")) {
        el.classList.add("visible");
        el.classList.add("has-appeared"); // Mark as having appeared
      }
    });
  };

  // Call on initial load
  handleInitialVisibility();

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "20px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        !entry.target.classList.contains("has-appeared")
      ) {
        entry.target.classList.add("visible");
        entry.target.classList.add("has-appeared"); // Mark as having appeared
      }
    });
  }, observerOptions);

  // Observe all elements
  rows.forEach((row) => observer.observe(row));
  fadeInElements.forEach((el) => observer.observe(el));

  // Handle visibility on scroll
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleInitialVisibility, 50);
    },
    { passive: true }
  );
});
