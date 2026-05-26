import React, { useRef } from "react";
import { caseStudyNavConfig } from "../../data/caseStudyNavConfig";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { usePinnedSpyNav } from "../../hooks/usePinnedSpyNav";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import BlockPartySpyNavSprite from "../../pages/BlockPartyCaseStudy/BlockPartySpyNavSprite";
import "./CaseStudyLayout.css";

function CaseStudySpyNav({
  sections,
  accentColor,
  slotRef,
  layoutRef,
  projectId,
}) {
  const navRef = useRef(null);
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const linkRefs = useRef([]);
  const sectionIds = sections.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);
  const { scrollToTop, scrollToElement } = useLenisScroll();
  const pinStyle = usePinnedSpyNav(slotRef, layoutRef, navRef);
  const isBlockParty = projectId === "blockparty";

  const handleClick = (id, index) => {
    if (index === 0) {
      scrollToTop({ duration: 1.2 });
      return;
    }
    const el = document.getElementById(id);
    scrollToElement(el, { offset: 0, duration: 1.2 });
  };

  return (
    <div ref={slotRef} className="case-study-spy-nav-slot">
      <div
        ref={navRef}
        className={`case-study-spy-nav${pinStyle ? " is-pinned" : ""}${
          isBlockParty ? " case-study-spy-nav--blockparty" : ""
        }`}
        role="navigation"
        aria-label="Case study sections"
        style={{ "--case-study-spy-accent": accentColor, ...pinStyle }}
      >
        <div ref={trackRef} className="case-study-spy-nav__track">
          {isBlockParty ? (
            <BlockPartySpyNavSprite
              activeId={activeId}
              sectionIds={sectionIds}
              linkRefs={linkRefs}
              trackRef={trackRef}
            />
          ) : null}
          <ul ref={listRef} className="case-study-spy-nav__list">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className="case-study-spy-nav__item"
                style={{ "--nav-stagger-index": index }}
              >
                <button
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  type="button"
                  className={`case-study-spy-nav__link${
                    activeId === section.id ? " is-active" : ""
                  }`}
                  onClick={() => handleClick(section.id, index)}
                  aria-current={activeId === section.id ? "true" : undefined}
                >
                  {isBlockParty ? (
                    <span
                      className="blockparty-spy-nav__sprite-slot"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="case-study-spy-nav__dot"
                      aria-hidden="true"
                    />
                  )}
                  <span className="case-study-spy-nav__label">
                    {section.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyLayout({ projectId, children }) {
  const config = caseStudyNavConfig[projectId];
  const layoutRef = useRef(null);
  const slotRef = useRef(null);

  if (!config) {
    return children;
  }

  return (
    <div ref={layoutRef} className="case-study-layout">
      <CaseStudySpyNav
        projectId={projectId}
        sections={config.sections}
        accentColor={config.accentColor}
        slotRef={slotRef}
        layoutRef={layoutRef}
      />
      <div className="case-study-layout__main">{children}</div>
    </div>
  );
}
