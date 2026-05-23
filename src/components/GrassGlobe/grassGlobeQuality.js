export const GRASS_GLOBE_QUALITY_PRESETS = {
  high: {
    bladeCount: 100000,
    maxPixelRatio: 2,
    antialias: true,
    sphereSegments: 64,
    usePostProcessing: true,
  },
  medium: {
    bladeCount: 48000,
    maxPixelRatio: 1.25,
    antialias: true,
    sphereSegments: 48,
    usePostProcessing: true,
  },
  low: {
    bladeCount: 20000,
    maxPixelRatio: 1,
    antialias: false,
    sphereSegments: 32,
    usePostProcessing: false,
  },
};

const TIER_ORDER = ["high", "medium", "low"];

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints ?? 0) > 1
  );
}

export async function resolveGrassGlobeQuality() {
  const mobile = isMobileDevice();
  const memory = navigator.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  let webgpuAvailable = false;

  if (typeof navigator !== "undefined" && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: mobile ? "low-power" : "high-performance",
      });
      webgpuAvailable = Boolean(adapter);
    } catch {
      webgpuAvailable = false;
    }
  }

  if (!webgpuAvailable) {
    return { tier: "lite", webgpuAvailable: false, ...GRASS_GLOBE_QUALITY_PRESETS.low };
  }

  if (prefersReducedMotion || mobile || memory <= 4 || cores <= 4) {
    return { tier: "low", webgpuAvailable: true, ...GRASS_GLOBE_QUALITY_PRESETS.low };
  }

  if (!mobile && memory >= 8 && cores >= 8) {
    return { tier: "high", webgpuAvailable: true, ...GRASS_GLOBE_QUALITY_PRESETS.high };
  }

  return { tier: "medium", webgpuAvailable: true, ...GRASS_GLOBE_QUALITY_PRESETS.medium };
}

export function getQualityRetryOrder(startTier) {
  const startIndex = Math.max(0, TIER_ORDER.indexOf(startTier));
  return TIER_ORDER.slice(startIndex);
}

export function getEffectivePixelRatio(maxPixelRatio, width) {
  const cap = width < 1200 ? Math.min(maxPixelRatio, 1.25) : maxPixelRatio;
  return Math.min(window.devicePixelRatio || 1, cap);
}
