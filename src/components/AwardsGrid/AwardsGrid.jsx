import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { awards } from "../../data/awards";
import "./AwardsGrid.css";

gsap.registerPlugin(ScrollTrigger);

const AwardsGrid = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const gridElement = gridRef.current;
    if (!sectionElement || !gridElement) return;

    let scrollTrigger = null;
    let tl = null;

    // Wait a bit to ensure any other ScrollTriggers have finished setting up
    const timeoutId = setTimeout(() => {
      // Get all award cards
      const awardCards = gridElement.querySelectorAll(".award-card");
      if (awardCards.length === 0) return;

      // Refresh ScrollTrigger to ensure accurate positioning
      ScrollTrigger.refresh();

      // Set initial state for each card - hidden (entire card container)
      gsap.set(awardCards, {
        opacity: 0,
        y: 20,
        scale: 0.95, // Slight scale to make the box fade-in more visible
      });

      // Create a timeline that can be reversed
      tl = gsap.timeline({ paused: true });
      tl.to(awardCards, {
        opacity: 1,
        y: 0,
        scale: 1, // Full scale when visible
        duration: 0.6,
        stagger: 0.1, // 0.1s delay between each card
        ease: "ease-out",
      });

      // Create scroll trigger to animate cards when they come into view
      scrollTrigger = ScrollTrigger.create({
        trigger: sectionElement,
        start: "top 80%", // Start animation when section top reaches 80% from viewport top
        onEnter: () => {
          // Play forward when scrolling down into view
          tl.play();
        },
        onLeaveBack: () => {
          // Reverse when scrolling back up past the section
          tl.reverse();
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) scrollTrigger.kill();
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="awards-section" className="awards-section">
      <div className="w-full md:max-w-[900px] lg:max-w-[1000px] md:mx-auto">
        <div ref={gridRef} className="awards-grid">
          {awards.map((award) => (
            <div key={award.id} className="award-card">
              <h3 className="award-title">{award.title}</h3>
              <p className="award-organization">{award.organization}</p>
              <p className="award-year">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsGrid;

