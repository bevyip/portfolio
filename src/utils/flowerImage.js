/** Remove near-white background for compositing on the grass globe. */
export function applyTransparency(src, threshold = 248) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
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
