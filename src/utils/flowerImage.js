function getBgRemovalPublicPath() {
  return new URL(
    `${import.meta.env.BASE_URL}imgly-background-removal/`,
    window.location.origin,
  ).href;
}

function getBgRemovalConfig() {
  return {
    publicPath: getBgRemovalPublicPath(),
    output: { format: "image/png" },
  };
}

let bgRemovalModulePromise = null;
let preloadPromise = null;

function loadBgRemoval() {
  if (!bgRemovalModulePromise) {
    bgRemovalModulePromise = import("@imgly/background-removal");
  }
  return bgRemovalModulePromise;
}

async function ensureBgRemovalAssets() {
  const { preload } = await loadBgRemoval();
  if (!preloadPromise) {
    preloadPromise = preload(getBgRemovalConfig());
  }
  await preloadPromise;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Remove image background for compositing on the grass globe. */
export async function applyTransparency(src) {
  await ensureBgRemovalAssets();
  const { removeBackground } = await loadBgRemoval();
  const blob = await removeBackground(src, getBgRemovalConfig());
  return blobToDataUrl(blob);
}

export async function generateFlowerImage({ name, color, message }) {
  const res = await fetch("/api/generate-flower", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color, message }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  const rawSrc = `data:${data.mimeType};base64,${data.image}`;
  const transparentSrc = await applyTransparency(rawSrc);

  return {
    image: transparentSrc,
    name,
    message,
    color,
    model: data.model,
    createdAt: Date.now(),
  };
}
