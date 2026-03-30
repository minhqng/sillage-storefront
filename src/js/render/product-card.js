import { formatFamilyLabel, getDefaultProductSize, getProductHref } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatPrice } from "../utils/format.js";
import { renderProductArtwork } from "./media-art.js";

export function renderProductCard(product, { allowQuickAdd = false } = {}) {
  const defaultSize = allowQuickAdd ? getDefaultProductSize(product) : null;

  return `
    <article class="sl-product-card${allowQuickAdd && defaultSize ? " sl-product-card--quick-add" : ""}">
      <a class="sl-product-card__link" href="${getProductHref(product)}">
        <div class="sl-product-card__media">
          ${renderProductArtwork(product, {
            className: "sl-product-card__art",
            alt: `Chai nước hoa ${product.name}`,
            sizes: "(min-width: 992px) 24vw, (min-width: 768px) 40vw, 100vw"
          })}
        </div>
        <div class="sl-product-card__body sl-stack sl-stack--tight">
          <div class="sl-product-card__header">
            <p class="sl-product-card__family sl-label sl-muted">${escapeHtml(formatFamilyLabel(product.family))}</p>
            <p class="sl-product-card__price">${formatPrice(product.price)}</p>
          </div>
          <h3 class="sl-card-title">${escapeHtml(product.name)}</h3>
          <p class="sl-product-card__tagline">${escapeHtml(product.tagline)}</p>
        </div>
      </a>
      ${
        allowQuickAdd && defaultSize
          ? `
            <div class="sl-product-card__actions">
              <button
                class="btn btn-secondary sl-product-card__quick-add"
                type="button"
                data-quick-add
                data-product-id="${product.id}"
                data-product-name="${escapeHtml(product.name)}"
                data-size-id="${defaultSize.id}"
                data-size-label="${escapeHtml(defaultSize.label)}"
                data-size-price="${defaultSize.price}"
              >
                Thêm vào giỏ
              </button>
            </div>
          `
          : ""
      }
    </article>
  `;
}
