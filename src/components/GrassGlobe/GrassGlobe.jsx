import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import flowerIcon from "../../assets/img/flower.png";
import { initGrassGlobe } from "./grassGlobeScene";
import "./GrassGlobe.css";

function formatFlowerDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const GrassGlobe = forwardRef(function GrassGlobe({ initialFlowers = [] }, ref) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const flowersRef = useRef(initialFlowers);
  const [tooltip, setTooltip] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);

  useImperativeHandle(ref, () => ({
    addFlower(flowerData) {
      flowersRef.current = [...flowersRef.current, flowerData];
      return sceneRef.current?.addFlower(flowerData);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;

    initGrassGlobe(container, {
      initialFlowers: flowersRef.current,
      onFlowerTooltipUpdate: setTooltip,
    })
      .then((scene) => {
        if (cancelled) {
          scene.destroy();
          return;
        }
        sceneRef.current = scene;
        requestAnimationFrame(() => {
          if (!cancelled) setIsVisible(true);
        });
      })
      .catch((err) => {
        console.error("[GrassGlobe]", err);
      });

    return () => {
      cancelled = true;
      setIsVisible(false);
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!tooltip) return undefined;

    const onDocPointerDown = (e) => {
      if (e.target.closest(".grass-globe")) return;
      setTooltip(null);
      sceneRef.current?.clearFlowerSelection?.();
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [tooltip]);

  const handleLoaderTransitionEnd = (e) => {
    if (e.propertyName !== "opacity" || !isVisible) return;
    setLoaderMounted(false);
  };

  return (
    <div className="grass-globe-root">
      {loaderMounted ? (
        <div
          className={`grass-globe-loader${isVisible ? " grass-globe-loader--hiding" : ""}`}
          aria-hidden="true"
          onTransitionEnd={handleLoaderTransitionEnd}
        >
          <div className="grass-globe-loader-flowers">
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                className="grass-globe-loader-flower"
                src={flowerIcon}
                alt=""
                draggable={false}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div
        className={`grass-globe${isVisible ? " grass-globe--visible" : ""}`}
        ref={containerRef}
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      />
      {tooltip ? (
        <div
          className="flower-globe-tooltip"
          role="tooltip"
          style={{
            left: `${tooltip.x + 36}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <p className="flower-globe-tooltip-name">
            {tooltip.name?.toLowerCase() ?? ""}
          </p>
          {tooltip.createdAt ? (
            <time
              className="flower-globe-tooltip-date"
              dateTime={new Date(tooltip.createdAt).toISOString()}
            >
              {formatFlowerDate(tooltip.createdAt)}
            </time>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

export default GrassGlobe;
