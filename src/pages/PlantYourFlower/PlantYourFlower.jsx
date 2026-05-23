import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer/Footer";
import GrassGlobe from "../../components/GrassGlobe/GrassGlobe";
import useScrollReset from "../../hooks/useScrollReset";
import { fetchFlowers, plantFlower } from "../../utils/flowersApi";
import { recordGardenSession } from "../../utils/gardenStatsApi";
import FlowerModal from "./FlowerModal";
import "./PlantYourFlower.css";

export default function PlantYourFlower() {
  useScrollReset();
  const globeRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [flowers, setFlowers] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [plantError, setPlantError] = useState("");
  const [isPlanting, setIsPlanting] = useState(false);
  const [sessionCount, setSessionCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchFlowers()
      .then((loaded) => {
        if (!cancelled) {
          setFlowers(loaded);
          setLoadError("");
        }
      })
      .catch((err) => {
        console.error("[PlantYourFlower] load flowers", err);
        if (!cancelled) {
          setFlowers([]);
          setLoadError(err.message || "Could not load flowers.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    recordGardenSession()
      .then((count) => {
        if (!cancelled) setSessionCount(count);
      })
      .catch((err) => {
        console.error("[PlantYourFlower] session count", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlant = async (flower) => {
    setPlantError("");
    setIsPlanting(true);

    try {
      const saved = await plantFlower({
        name: flower.name,
        image: flower.image,
      });
      setFlowers((prev) => [...(prev ?? []), saved]);
      await globeRef.current?.addFlower(saved);
      setModalOpen(false);
    } catch (err) {
      console.error("[PlantYourFlower] plant flower", err);
      setPlantError(err.message || "Could not plant your flower.");
    } finally {
      setIsPlanting(false);
    }
  };

  return (
    <main className="plant-your-flower-page">
      <section className="plant-your-flower-hero">
        <div className="plant-your-flower-globe-wrap">
          {flowers === null ? (
            <p className="plant-your-flower-status" aria-live="polite">
              Loading the garden…
            </p>
          ) : (
            <GrassGlobe ref={globeRef} initialFlowers={flowers} />
          )}
        </div>

        {loadError ? (
          <p className="plant-your-flower-status plant-your-flower-status--error">
            {loadError}
          </p>
        ) : null}

        {plantError ? (
          <p className="plant-your-flower-status plant-your-flower-status--error">
            {plantError}
          </p>
        ) : null}

        <div className="plant-your-flower-actions">
          <p className="plant-your-flower-welcome" aria-live="polite">
            {sessionCount === null ? (
              "Loading garden stats…"
            ) : sessionCount === 1 ? (
              <>
                1 visitor{" "}
                <span className="plant-your-flower-welcome-muted">
                  has checked out this garden.
                </span>
              </>
            ) : (
              <>
                {sessionCount.toLocaleString()} visitors{" "}
                <span className="plant-your-flower-welcome-muted">
                  have checked out this garden.
                </span>
              </>
            )}
          </p>
          <button
            type="button"
            className="plant-your-flower-cta"
            onClick={() => setModalOpen(true)}
            disabled={flowers === null || isPlanting}
          >
            plant my flower
          </button>
        </div>
      </section>

      <FlowerModal
        isOpen={modalOpen}
        onClose={() => {
          if (!isPlanting) setModalOpen(false);
        }}
        onPlant={handlePlant}
        isPlanting={isPlanting}
      />

      <Footer />
    </main>
  );
}
