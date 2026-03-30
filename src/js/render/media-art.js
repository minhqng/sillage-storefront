import { getProductImage, getProductTheme } from "../core/product-service.js";

function getProductSrcSet(src) {
  if (typeof src !== "string" || !src.startsWith("/images/products/")) {
    return "";
  }

  const extensionIndex = src.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return "";
  }

  const basePath = src.slice(0, extensionIndex);

  return `${basePath}-480.webp 480w, ${basePath}-768.webp 768w`;
}

export function renderProductArtwork(
  product,
  {
    className = "",
    imageClassName = "",
    alt = "",
    loading = "lazy",
    sizes = ""
  } = {}
) {
  const theme = getProductTheme(product);
  const imageSrc = getProductImage(product);
  const srcSet = getProductSrcSet(imageSrc);
  const classNames = ["sl-artwork", className].filter(Boolean).join(" ");
  const imageClassNames = ["sl-artwork__image", imageClassName].filter(Boolean).join(" ");
  const sizesAttribute = sizes ? ` sizes="${sizes}"` : "";
  const srcSetAttribute = srcSet ? ` srcset="${srcSet}"` : "";

  return `
    <div
      class="${classNames}"
      style="--sl-art-start:${theme.start}; --sl-art-end:${theme.end}; --sl-art-glow:${theme.glow};"
    >
      <img
        class="${imageClassNames}"
        src="${imageSrc}"${srcSetAttribute}
        alt="${alt || `${product.name} chai nước hoa`}"
        loading="${loading}"${sizesAttribute}
        decoding="async"
      />
    </div>
  `;
}

export function renderEditorialArtwork(src, alt, className = "", imageClassName = "") {
  const classNames = ["sl-artwork", className].filter(Boolean).join(" ");
  const imageClassNames = ["sl-artwork__image", imageClassName].filter(Boolean).join(" ");

  return `
    <div class="${classNames}">
      <img class="${imageClassNames}" src="${src}" alt="${alt}" loading="lazy" decoding="async" />
    </div>
  `;
}
