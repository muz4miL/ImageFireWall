import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import appLogo from "./assets/logo.png";

function setFaviconFromImage(src: string) {
  const linkId = "app-favicon";
  const existing = document.getElementById(linkId) as HTMLLinkElement | null;
  const link =
    existing ??
    (() => {
      const el = document.createElement("link");
      el.id = linkId;
      el.rel = "icon";
      el.type = "image/png";
      document.head.appendChild(el);
      return el;
    })();

  const img = new Image();
  img.decoding = "async";
  img.src = src;

  img.onload = () => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Draw original to a temp canvas to find non-transparent bounds.
    const tmp = document.createElement("canvas");
    tmp.width = img.naturalWidth || img.width;
    tmp.height = img.naturalHeight || img.height;
    const tctx = tmp.getContext("2d", { willReadFrequently: true });
    if (!tctx || tmp.width === 0 || tmp.height === 0) return;
    tctx.clearRect(0, 0, tmp.width, tmp.height);
    tctx.drawImage(img, 0, 0);

    const { data, width, height } = tctx.getImageData(
      0,
      0,
      tmp.width,
      tmp.height
    );
    let minX = width,
      minY = height,
      maxX = 0,
      maxY = 0;
    let found = false;

    // Alpha threshold to ignore faint antialias.
    const threshold = 12;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = data[(y * width + x) * 4 + 3];
        if (a > threshold) {
          found = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Fallback: no alpha content detected.
    const sx = found ? minX : 0;
    const sy = found ? minY : 0;
    const sw = found ? Math.max(1, maxX - minX + 1) : width;
    const sh = found ? Math.max(1, maxY - minY + 1) : height;

    // Add a small margin so the icon doesn't touch edges.
    const margin = 6;
    const target = size - margin * 2;
    const scale = Math.min(target / sw, target / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (size - dw) / 2;
    const dy = (size - dh) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(tmp, sx, sy, sw, sh, dx, dy, dw, dh);

    const dataUrl = canvas.toDataURL("image/png");
    link.href = dataUrl;
    link.sizes = `${size}x${size}`;
  };
}

// Make the favicon appear larger by cropping padding.
setFaviconFromImage(appLogo);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
