import React, { useState, useRef } from "react";
import Footer from "../../components/Footer/Footer";
import PolaroidStack from "../../components/PolaroidStack/PolaroidStack";
import StickerPeel from "../../components/StickerPeel/StickerPeel";
import CursorPill from "../../components/CursorPill/CursorPill";
import ExperienceTimeline from "../../components/ExperienceTimeline/ExperienceTimeline";
import ExpandingPhotoRow from "../../components/ExpandingPhotoRow/ExpandingPhotoRow";
import useScrollReset from "../../hooks/useScrollReset";
import useRiseUpOnScroll from "../../hooks/useRiseUpOnScroll";
import a1 from "../../assets/img/about-pictures/a-1.png";
import a2 from "../../assets/img/about-pictures/a-2.png";
import a3 from "../../assets/img/about-pictures/a-3.png";
import purdueLogo from "../../assets/img/logo-stickers/purdue-logo.png";
import salesforceLogo from "../../assets/img/logo-stickers/salesforce-logo.png";
import nyuLogo from "../../assets/img/logo-stickers/nyu-logo.png";
import confidoLogo from "../../assets/img/logo-stickers/confido-logo.png";
import reactLogo from "../../assets/img/logo-stickers/react-logo.png";
import figmaLogo from "../../assets/img/logo-stickers/figma-logo.png";
import "./About.css";

const About = () => {
  useScrollReset();
  const [isHoveringSticker, setIsHoveringSticker] = useState(false);
  const howTitleRef = useRef(null);
  const whereTitleRef = useRef(null);
  const enjoyTitleRef = useRef(null);
  const howBlock1Ref = useRef(null);
  const howBlock2Ref = useRef(null);
  const howBlock3Ref = useRef(null);
  const enjoyDescRef = useRef(null);
  const enjoyImagesRef = useRef(null);
  useRiseUpOnScroll(howTitleRef, { triggerOnMount: true });
  useRiseUpOnScroll(whereTitleRef);
  useRiseUpOnScroll(enjoyTitleRef);
  useRiseUpOnScroll(howBlock1Ref, { triggerOnMount: true, delay: 0.25 });
  useRiseUpOnScroll(howBlock2Ref, { triggerOnMount: true, delay: 0.45 });
  useRiseUpOnScroll(howBlock3Ref, { triggerOnMount: true, delay: 0.65 });
  useRiseUpOnScroll(enjoyDescRef);
  useRiseUpOnScroll(enjoyImagesRef, { delay: 0.5 });

  return (
    <main className="about-sandbox">
      <CursorPill isHovering={isHoveringSticker} text="Peel me!" />
      <section className="about-sandbox-polaroid">
        <PolaroidStack
          photos={[
            { src: a1, alt: "" },
            { src: a2, alt: "" },
            { src: a3, alt: "" },
          ]}
        />
      </section>

      {/* How I got here - below polaroid, no animations */}
      <section className="about-sandbox-how-section">
        <div className="about-sandbox-how-inner">
          <div className="about-sandbox-how-text">
            <h2 ref={howTitleRef} className="about-sandbox-how-title">
              <em>How</em> I got here
            </h2>
          </div>

          <div className="about-sandbox-content">
            <div ref={howBlock1Ref} className="about-sandbox-paragraph-wrapper">
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={purdueLogo}
                  rotate={-10}
                  width={70}
                  className="about-sandbox-sticker about-sandbox-sticker-purdue"
                />
              </div>
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={salesforceLogo}
                  rotate={10}
                  width={80}
                  className="about-sandbox-sticker about-sandbox-sticker-salesforce"
                />
              </div>
              <div className="about-sandbox-text-wrap">
                <p className="about-sandbox-text">
                  <span className="about-sandbox-subtitle">
                    I didn't start out in the creative space.
                  </span>{" "}
                  I spent eight years in software engineering — studying
                  Computer Science at{" "}
                  <a
                    href="https://www.purdue.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-sandbox-link about-sandbox-link-institution"
                  >
                    Purdue University
                  </a>
                  , then building tools like Flow Builder at{" "}
                  <a
                    href="https://www.salesforce.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-sandbox-link about-sandbox-link-institution"
                  >
                    Salesforce
                  </a>{" "}
                  and leading accessibility in my team. I was good at it. But
                  somewhere along the way, I realized{" "}
                  <span className="about-sandbox-accent">
                    I cared just as much about how people felt using it as how
                    the code worked.
                  </span>
                </p>
              </div>
            </div>

            <div ref={howBlock2Ref} className="about-sandbox-paragraph-wrapper">
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={nyuLogo}
                  rotate={10}
                  width={70}
                  className="about-sandbox-sticker about-sandbox-sticker-nyu"
                />
              </div>
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={confidoLogo}
                  rotate={-15}
                  width={60}
                  className="about-sandbox-sticker about-sandbox-sticker-confido"
                />
              </div>
              <div className="about-sandbox-text-wrap">
                <p className="about-sandbox-text">
                  That led me to{" "}
                  <a
                    href="https://itp.nyu.edu/itp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-sandbox-link about-sandbox-link-institution"
                  >
                    NYU's Interactive Telecommunications Program
                  </a>{" "}
                  to study Human-Computer Interaction — to explore how design
                  and engineering could work together to make technology more
                  accessible and intuitive.
                </p>
              </div>
            </div>

            <div ref={howBlock3Ref} className="about-sandbox-paragraph-wrapper">
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={reactLogo}
                  rotate={-10}
                  width={70}
                  className="about-sandbox-sticker about-sandbox-sticker-react"
                />
              </div>
              <div
                onMouseEnter={() => setIsHoveringSticker(true)}
                onMouseLeave={() => setIsHoveringSticker(false)}
              >
                <StickerPeel
                  imageSrc={figmaLogo}
                  rotate={10}
                  width={80}
                  className="about-sandbox-sticker about-sandbox-sticker-figma"
                />
              </div>
              <div className="about-sandbox-text-wrap">
                <p className="about-sandbox-text">
                  I still write code. I still ship products. But now every
                  decision starts with the person on the other side of the
                  screen. I'm not just designing interfaces —{" "}
                  <span className="about-sandbox-accent">
                    I'm designing experiences that are as thoughtful as they are
                    scalable, as beautiful as they are functional.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where I've been — title styled like How I got here, experience timeline below */}
      <section className="about-sandbox-where-section">
        <div className="about-sandbox-where-inner">
          <div className="about-sandbox-how-text">
            <h2
              ref={whereTitleRef}
              className="about-sandbox-how-title about-sandbox-where-title"
            >
              <em>Where</em> I've been
            </h2>
          </div>
          <ExperienceTimeline revealEarlier />
        </div>
      </section>

      {/* What I enjoy — title styled like How/Where, one-liner + image row placeholder */}
      <section className="about-sandbox-enjoy-section">
        <div className="about-sandbox-enjoy-inner">
          <div className="about-sandbox-how-text">
            <h2
              ref={enjoyTitleRef}
              className="about-sandbox-how-title about-sandbox-enjoy-title"
            >
              <em>What</em> I enjoy
            </h2>
          </div>
          <p ref={enjoyDescRef} className="about-sandbox-enjoy-desc">
            When I'm not coding or designing, I spend my time with Boba (my cat
            & my muse), play badminton and boulder, stream video games on
            Twitch, and enjoy discussing design with other designers and
            technologists!
          </p>
          <div ref={enjoyImagesRef} className="about-sandbox-enjoy-images">
            <ExpandingPhotoRow />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
