import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PlayPreviewSection.css';

gsap.registerPlugin(ScrollTrigger);
import playImage1 from '../../assets/img/play-pictures/1.png';
import playImage2 from '../../assets/img/play-pictures/2.png';
import playImage3 from '../../assets/img/play-pictures/3.png';
import playImage4 from '../../assets/img/play-pictures/4.png';
import playImage5 from '../../assets/img/play-pictures/5.png';
import playImage6 from '../../assets/img/play-pictures/6.jpg';
import playImage7 from '../../assets/img/play-pictures/7.png';
import playImage8 from '../../assets/img/play-pictures/8.png';

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e, rect) {
  let clientX = 0,
    clientY = 0;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  DOM = { el: null, inner: null };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect = null;

  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.play-preview__img-inner');
    this.getRect();
    this.initEvents();
  }
  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }
  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
}

class ImageTrailVariant1 {
  constructor(container) {
    this.container = container;
    this.DOM = { el: container };
    // Get the images container - this is where images are actually positioned
    this.imagesContainer = this.DOM.el.querySelector('.play-preview__images-container');
    this.images = [...this.DOM.el.querySelectorAll('.play-preview__img')].map(img => new ImageItem(img));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 120;

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = ev => {
      // Use images container rect for accurate positioning
      const rect = this.imagesContainer.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = ev => {
      // Use images container rect for accurate positioning
      const rect = this.imagesContainer.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };

      requestAnimationFrame(() => this.render());

      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender);
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    // Cap z-index to ensure images stay behind text (text is z-index: 100)
    if (this.zIndexVal > 50) {
      this.zIndexVal = 1;
    }
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 1.2,
          ease: 'power3',
          opacity: 0,
          scale: 0.2
        },
        0.4
      );
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }
  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

const PlayPreviewSection = () => {
  const containerRef = useRef(null);
  const trailInstanceRef = useRef(null);
  const statementRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentRef = useRef(null);

  // Images for the trail effect from play-projects
  const trailImages = [
    playImage1,
    playImage2,
    playImage3,
    playImage4,
    playImage5,
    playImage6,
    playImage7,
    playImage8,
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Only initialize the image trail effect on desktop (screens wider than 1023px)
    // On tablet and mobile, images are shown in a static scattered grid format
    const isDesktop = window.innerWidth > 1023;
    
    if (isDesktop) {
      // Initialize the image trail effect
      trailInstanceRef.current = new ImageTrailVariant1(containerRef.current);
    }

    // Handle window resize to enable/disable trail effect
    const handleResize = () => {
      const isDesktopNow = window.innerWidth > 1023;
      
      if (isDesktopNow && !trailInstanceRef.current) {
        // Switch to desktop: initialize trail
        trailInstanceRef.current = new ImageTrailVariant1(containerRef.current);
      } else if (!isDesktopNow && trailInstanceRef.current) {
        // Switch to mobile/tablet: cleanup trail
        // Reset all images to default state
        const images = containerRef.current.querySelectorAll('.play-preview__img');
        images.forEach(img => {
          gsap.killTweensOf(img);
        });
        trailInstanceRef.current = null;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup if needed
      if (trailInstanceRef.current) {
        // Remove event listeners by removing the container's event listeners
        // The class doesn't expose a cleanup method, so we'll let it be cleaned up when component unmounts
        trailInstanceRef.current = null;
      }
    };
  }, []);

  // Pin section and handle all scroll-based animations
  useEffect(() => {
    let pinScrollTrigger;
    let prePinScrollTrigger;
    let charSpans = [];
    let statementProgressRef = { value: 0 }; // Track statement progress across triggers

    const timeoutId = setTimeout(() => {
      if (!containerRef.current || !statementRef.current || !contentRef.current || !subtitleRef.current) return;

      const statementElement = statementRef.current;
      const text = statementElement.textContent || "";

      // Split text into words first, then into characters
      // This ensures words stay together and don't break mid-word
      const words = text.split(/(\s+)/); // Split by spaces but keep spaces
      charSpans = [];
      
      // Clear existing content
      statementElement.innerHTML = "";
      
      words.forEach((word) => {
        if (word.trim() === "" && word.includes(" ")) {
          // This is a space - create a single space span with proper width
          const span = document.createElement("span");
          span.textContent = "\u00A0"; // Non-breaking space for visibility
          span.style.display = "inline-block";
          span.style.opacity = "0.35";
          span.style.width = "0.25em"; // Ensure space has width
          span.style.minWidth = "0.25em";
          span.classList.add("play-preview-char-space");
          charSpans.push(span);
          statementElement.appendChild(span);
        } else if (word.trim() !== "") {
          // This is a word - wrap in container to keep word together
          const wordContainer = document.createElement("span");
          wordContainer.classList.add("play-preview-word-wrapper");
          wordContainer.style.display = "inline-block";
          wordContainer.style.whiteSpace = "nowrap";
          
          // Split word into characters
          const wordChars = word.split("");
          wordChars.forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.display = "inline-block";
            span.style.opacity = "0.35";
            span.classList.add("play-preview-char-word");
            wordContainer.appendChild(span);
            charSpans.push(span);
          });
          
          statementElement.appendChild(wordContainer);
        }
      });

      // Initialize subtitle - no need to split into characters, just set initial opacity
      const subtitleElement = subtitleRef.current;
      if (subtitleElement) {
        // Keep the original structure with nested spans for styling
        // Just set initial opacity to 0
        gsap.set(subtitleElement, { opacity: 0 });
      }

      // Function to update statement animation based on progress
      const updateStatementAnimation = (progress) => {
        // Statement animation: first 50% of total scroll progress
        const statementProgress = Math.min(1, progress * 2); // 0 to 1 over first half
        statementProgressRef.value = statementProgress;
        
        // Calculate how many letters should be fully revealed
        const totalChars = charSpans.length;
        const exactProgress = statementProgress * totalChars;
        const visibleCount = Math.floor(exactProgress);
        const nextLetterProgress = exactProgress - visibleCount;

        // Number of upcoming letters to gradually fade in with decreasing opacity
        const fadeInRange = 4;

        charSpans.forEach((span, index) => {
          if (index < visibleCount) {
            // Fully revealed letters - opacity 1
            gsap.set(span, {
              opacity: 1,
            });
          } else if (
            index >= visibleCount &&
            index < visibleCount + fadeInRange
          ) {
            // Upcoming letters - gradual fade-in from base opacity to 1
            const distanceFromCurrent = index - visibleCount;

            let opacity = 0.35; // Base opacity
            if (distanceFromCurrent === 0) {
              // Current letter being revealed
              opacity = 0.35 + (nextLetterProgress * 0.65); // From 0.35 to 1
            } else if (distanceFromCurrent === 1) {
              opacity = 0.35 + (nextLetterProgress * 0.65 * 0.6);
            } else if (distanceFromCurrent === 2) {
              opacity = 0.35 + (nextLetterProgress * 0.65 * 0.3);
            } else if (distanceFromCurrent === 3) {
              opacity = 0.35 + (nextLetterProgress * 0.65 * 0.1);
            }

            opacity = Math.min(1, Math.max(0.35, opacity));

            gsap.set(span, {
              opacity: opacity,
            });
          } else {
            // Letters not yet reached - base opacity (slightly off-gray)
            gsap.set(span, {
              opacity: 0.35,
            });
          }
        });
      };

      // Pre-pin animation: start animation slightly before pin begins
      prePinScrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 95%", // Start when section is 95% down the viewport (closer to pin)
        end: "top top", // End when section reaches top (where pin starts)
        scrub: 2.5,
        onUpdate: (self) => {
          // Map progress from 0 to 1 as section approaches top
          // This represents a tiny portion (5%) of the total animation before pin
          const prePinProgress = self.progress;
          const totalProgress = prePinProgress * 0.05; // First 5% of animation
          updateStatementAnimation(totalProgress);
          
          // Ensure subtitle is hidden during pre-pin (statement not complete yet)
          const subtitleElement = subtitleRef.current;
          if (subtitleElement && totalProgress <= 0.5) {
            gsap.set(subtitleElement, { opacity: 0 });
            containerRef.current?.classList.remove('subtitle-complete');
          }
        },
      });

      // Calculate pin duration - reduced since subtitle fades in faster
      // Using viewport height as base unit for consistent experience
      const pinDuration = window.innerHeight * 2; // 2 viewport heights of scroll

      // Pin the section when it reaches the top
      pinScrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDuration}`,
        pin: containerRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          containerRef.current?.classList.add('is-pinned');
        },
        onLeave: () => {
          containerRef.current?.classList.remove('is-pinned');
        },
        onEnterBack: () => {
          containerRef.current?.classList.add('is-pinned');
        },
        onLeaveBack: () => {
          containerRef.current?.classList.remove('is-pinned');
        },
        onUpdate: (self) => {
          const pinnedProgress = self.progress; // 0 to 1 as user scrolls through pinned section
          
          // Continue statement animation from where pre-pin left off
          // Pre-pin covered 0-0.05, pin covers 0.05-1.0
          const totalProgress = 0.05 + (pinnedProgress * 0.95);
          updateStatementAnimation(totalProgress);
          
          // Subtitle animation: simple fade in/out
          // Fade in when statement is complete (totalProgress >= 0.5)
          // Fade out if scrolling back up before statement completes
          const subtitleElement = subtitleRef.current;
          if (subtitleElement) {
            // Statement animation completes at totalProgress = 0.5 (first 50% of scroll)
            // Subtitle should start fading in immediately when statement completes
            if (totalProgress >= 0.5) {
              // Statement is complete - fade in subtitle quickly
              // Fade in over first 20% of second half (0.5 to 0.6), then stay visible
              const fadeInEnd = 0.6; // Fade completes at 60% of total progress
              let subtitleOpacity = 0;
              
              if (totalProgress <= fadeInEnd) {
                // Fade in phase: map 0.5 to 0.6 range to 0 to 1 opacity
                subtitleOpacity = (totalProgress - 0.5) / (fadeInEnd - 0.5);
              } else {
                // Fully visible after fade-in completes
                subtitleOpacity = 1;
              }
              
              subtitleOpacity = Math.min(1, Math.max(0, subtitleOpacity));
              gsap.set(subtitleElement, { opacity: subtitleOpacity });
              
              // Check if subtitle is fully visible (after fade-in completes)
              const isSubtitleComplete = totalProgress >= fadeInEnd;
              if (isSubtitleComplete) {
                containerRef.current?.classList.add('subtitle-complete');
              } else {
                containerRef.current?.classList.remove('subtitle-complete');
              }
            } else {
              // Statement not complete yet - hide subtitle
              gsap.set(subtitleElement, { opacity: 0 });
              containerRef.current?.classList.remove('subtitle-complete');
            }
          }
        },
      });

      // Force ScrollTrigger refresh
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (pinScrollTrigger) {
        pinScrollTrigger.kill();
      }
      if (prePinScrollTrigger) {
        prePinScrollTrigger.kill();
      }
    };
  }, []);

  // Subtitle animation is now handled within the pin ScrollTrigger above

  return (
    <section id="play-preview" className="play-preview-section" ref={containerRef}>
      {/* Image trail elements */}
      <div className="play-preview__images-container">
        {trailImages.map((imageUrl, i) => (
          <div className="play-preview__img" key={i}>
            <div 
              className="play-preview__img-inner" 
              style={{ 
                backgroundImage: `url(${imageUrl})` 
              }} 
            />
          </div>
        ))}
      </div>

      {/* Text content */}
      <div className="play-preview-content" ref={contentRef}>
        <p className="play-preview-intro">
          In other news, I have fun too!
        </p>
        <p ref={statementRef} className="play-preview-statement">
          Beyond product design, I explore interactive web experiences, 3D animations, generative art, and fabrication—curious experiments where code meets making, built purely for delight.
        </p>
        <div className="play-preview-link">
          <span ref={subtitleRef} className="play-preview-subtitle">
            <span className="play-preview-lets">Enter my</span> <span className="play-preview-play">playground<span className="play-preview-arrow">↗</span></span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default PlayPreviewSection;

