import { formatFamilyLabel, getDefaultProductSize, getProductHref, getProductNotes } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatProductPrice } from "./product-detail.js";
import { renderProductArtwork } from "./media-art.js";

function renderIncludedProduct(product) {
  return `
    <article class="sl-discovery-include-card">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${escapeHtml(formatFamilyLabel(product.family))}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="sl-card-copy">${escapeHtml(product.tagline)}</p>
      </div>
      <ul class="sl-discovery-note-list">
        ${getProductNotes(product)
          .map(
            (note) => `
              <li>${note}</li>
            `
          )
          .join("")}
      </ul>
      <a class="sl-discovery-link" href="${getProductHref(product)}">Xem chai lớn</a>
    </article>
  `;
}

function renderBenefit(benefit) {
  return `
    <article class="sl-discovery-benefit">
      <h3>${benefit.title}</h3>
      <p class="sl-card-copy">${benefit.copy}</p>
    </article>
  `;
}

function renderRitualStep(step) {
  return `
    <article class="sl-discovery-step">
      <p class="sl-label sl-muted">${step.label}</p>
      <h3>${step.title}</h3>
      <p class="sl-card-copy">${step.copy}</p>
    </article>
  `;
}

export function renderDiscoveryView({ product, includedProducts, site }) {
  const size = getDefaultProductSize(product) ?? {
    id: "default",
    label: "Dung tích tiêu chuẩn",
    price: product.price
  };

  return `
    <section class="sl-section sl-discovery">
      <div class="container sl-stack sl-stack--loose">
        <div class="sl-discovery-hero">
          <div class="sl-stack sl-stack--loose">
            <div class="sl-section-head">
              <p class="sl-label sl-muted">${site.discovery.eyebrow}</p>
              <h2>${site.discovery.title}</h2>
              <p class="sl-section-summary">${site.discovery.summary}</p>
            </div>
            <p class="sl-discovery-copy">${product.longDescription}</p>
            <div class="sl-discovery-benefits">
              ${site.discovery.benefits.map((benefit) => renderBenefit(benefit)).join("")}
            </div>
          </div>

          <aside class="sl-discovery-purchase">
            ${renderProductArtwork(product, {
              className: "sl-discovery-purchase__art",
              alt: `${product.name} dạng bộ thử`,
              sizes: "(min-width: 992px) 32vw, 100vw"
            })}
            <div class="sl-stack sl-stack--tight">
              <p class="sl-label sl-muted">Bộ khám phá</p>
              <h2 class="sl-discovery-purchase__title">${product.name}</h2>
              <p class="sl-discovery-purchase__tagline">${product.tagline}</p>
              <p class="sl-discovery-purchase__price">${formatProductPrice(size.price)}</p>
              <p class="sl-card-copy">${product.shortDescription}</p>
            </div>

            <div class="sl-discovery-purchase__meta">
              <div>
                <span class="sl-label sl-muted">Dung tích</span>
                <p>${size.label}</p>
              </div>
              <div>
                <span class="sl-label sl-muted">Phù hợp nhất</span>
                <p>Lần mua đầu, quà tặng và quá trình so sánh chậm rãi.</p>
              </div>
            </div>

            <div class="sl-discovery-quantity">
              <label class="sl-label sl-muted" for="discovery-quantity">Số lượng</label>
              <div class="sl-product-detail__quantity-control">
                <button
                  class="sl-product-detail__stepper"
                  type="button"
                  data-discovery-step="-1"
                  aria-label="Giảm số lượng Bộ Khám Phá"
                >
                  -
                </button>
                <input
                  id="discovery-quantity"
                  class="sl-product-detail__quantity-input"
                  type="text"
                  value="1"
                  inputmode="numeric"
                  readonly
                  data-discovery-quantity
                />
                <button
                  class="sl-product-detail__stepper"
                  type="button"
                  data-discovery-step="1"
                  aria-label="Tăng số lượng Bộ Khám Phá"
                >
                  +
                </button>
              </div>
            </div>

            <div class="sl-link-row">
              <button
                class="btn btn-primary"
                type="button"
                data-discovery-add-to-cart
                data-size-id="${size.id}"
                data-size-price="${size.price}"
              >
                Thêm vào giỏ
              </button>
              <a class="btn btn-secondary" href="cua-hang.html">Xem chai full-size</a>
            </div>

            <div class="sl-product-detail__status" data-discovery-status aria-live="polite"></div>
          </aside>
        </div>

        <section class="sl-discovery-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Các mùi hương bên trong</p>
            <h2>Đủ bảy hướng mùi cốt lõi trong một bản tuyển chọn.</h2>
            <p class="sl-section-summary">
              Bộ thử trải từ hổ phách, sung, diên vĩ, cỏ hương bài, cam khoáng, gỗ khói đến hoa cam để gu mùi yêu thích
              hiện ra rõ ràng qua quá trình mặc thật.
            </p>
          </div>
          <div class="sl-discovery-include-grid">
            ${includedProducts.map((entry) => renderIncludedProduct(entry)).join("")}
          </div>
        </section>

        <section class="sl-discovery-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Cách sử dụng</p>
            <h2>Hãy dùng bộ thử như một phòng fitting yên tĩnh cho nhà hương.</h2>
            <p class="sl-section-summary">
              Đi từng mùi một, quay lại với lựa chọn còn đọng trong trí nhớ, rồi chỉ chuyển sang chai lớn khi câu trả
              lời đã trở nên tự nhiên.
            </p>
          </div>
          <div class="sl-discovery-step-grid">
            ${site.discovery.ritualSteps.map((step) => renderRitualStep(step)).join("")}
          </div>
        </section>

        <section class="sl-discovery-cta">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Bước tiếp theo</p>
            <h2 class="sl-support-title">${site.discovery.ctaTitle}</h2>
            <p class="sl-card-copy">${site.discovery.ctaCopy}</p>
          </div>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Xem bộ sưu tập</a>
            <a class="btn btn-secondary" href="huong-dan-mui-huong.html">Đọc hướng dẫn chọn mùi</a>
          </div>
        </section>
      </div>
    </section>
  `;
}
