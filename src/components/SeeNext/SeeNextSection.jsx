import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorPill from "../CursorPill/CursorPill";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import "./SeeNextSection.css";

gsap.registerPlugin(ScrollTrigger);

const SEE_NEXT_PROJECTS = [
  {
    id: "dandi",
    to: "/dandi",
    title: "Dandi: A Bio-Smart Wearable for PCOS",
    description:
      "Making hormonal health accessible for women through emotionally-resonant design and real-time biosensing.",
    video: "/work/dandi/thumbnail.mp4",
  },
  {
    id: "confido",
    to: "/confido",
    title: "Rebuilding Confido's Approval Flow",
    description:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail.mp4",
  },
  {
    id: "blockparty",
    to: "/blockparty",
    title: "Block Party",
    description:
      "An interactive installation where a backlit pegboard creation becomes an animated character in a shared digital world.",
    video:
      "https://res.cloudinary.com/djldar8hj/video/upload/f_auto,q_auto/v1778184515/block-party-demo_ghi2oo.mp4",
  },
];

const SeeNextSection = ({ sectionId, excludeId }) => {
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const [isHovering, setIsHovering] = useState(false);
  const projects = SEE_NEXT_PROJECTS.filter(
    (project) => project.id !== excludeId,
  ).slice(0, 2);

  useCardUnfurling({
    gridRef,
    cardRefs,
    options: {
      peekOffset: 36,
      start: "top 75%",
      end: "top 30%",
      minWidth: 1025,
      layoutDelay: 100,
    },
  });

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(title, { opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(title, { opacity: 0, y: 30 });
    const trigger = ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id={sectionId} className="see-next-section">
      <CursorPill isHovering={isHovering} text="View case study" />
      <div className="see-next-content">
        <h3 className="see-next-title" ref={titleRef}>
          SEE NEXT
        </h3>
        <div
          className="see-next-grid"
          ref={gridRef}
          data-case-study-nav-boundary
        >
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={project.to}
              className="see-next-card-link"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className="see-next-card"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <div className="see-next-image-container">
                  {project.image ? (
                    <img
                      src={project.video}
                      alt=""
                      className="see-next-image"
                    />
                  ) : (
                    <video
                      src={project.video}
                      className="see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label={`${project.title} — preview`}
                    />
                  )}
                </div>
                <h4 className="see-next-card-title">{project.title}</h4>
                <p className="see-next-card-description">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeeNextSection;
