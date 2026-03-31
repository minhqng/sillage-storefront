import { formatFamilyLabel, getDefaultProductSize, getProductHref, getProductNotes } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatProductPrice } from "./product-detail.js";
import { renderProductArtwork } from "./media-art.js";

function renderIncludedProduct(product) {
  const quickNotes = getProductNotes(product).slice(0, 2);

  return `
    <article class="sl-discovery-include-card">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${escapeHtml(formatFamilyLabel(product.family))}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="sl-card-copy sl-discovery-include-card__summary">${escapeHtml(product.tagline)}</p>
        <p class="sl-discovery-include-card__notes">${escapeHtml(quickNotes.join(" | "))}</p>
      </div>
      <a class="sl-discovery-link" href="${getProductHref(product)}">Xem chai lớn</a>
    </article>
  `;
}

function renderGuideFamilyCard(family) {
  const familyId = typeof family.id === "string" ? family.id : "";
  const familyHref = familyId ? `cua-hang.html?nhom-huong=${encodeURIComponent(familyId)}` : "cua-hang.html";
  const signals = Array.isArray(family.signals) ? family.signals.slice(0, 2) : [];
  const wearMoments = Array.isArray(family.wearMoments) ? family.wearMoments.slice(0, 1) : [];
  const quickMeta = [...signals, ...wearMoments].join(" | ");

  return `
    <article class="sl-guide-family-card sl-discovery-guide-family-card">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${escapeHtml(family.label)}</p>
        <h3>${escapeHtml(family.title)}</h3>
        <p class="sl-card-copy">${escapeHtml(family.summary)}</p>
      </div>
      ${quickMeta ? `<p class="sl-discovery-guide-family-card__meta">${escapeHtml(quickMeta)}</p>` : ""}
      <a class="btn btn-link sl-guide-family-link" href="${familyHref}">Xem nhóm hương này</a>
    </article>
  `;
}

function renderGuideChoiceStep(step) {
  return `
    <article class="sl-guide-step sl-discovery-guide-step">
      <p class="sl-label sl-muted">${escapeHtml(step.label)}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sl-card-copy">${escapeHtml(step.copy)}</p>
    </article>
  `;
}

function renderRitualStep(step) {
  return `
    <article class="sl-discovery-step">
      <p class="sl-label sl-muted">${escapeHtml(step.label)}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sl-card-copy">${escapeHtml(step.copy)}</p>
    </article>
  `;
}

export function renderDiscoveryView({ product, includedProducts, site, guide }) {
  const size = getDefaultProductSize(product) ?? {
    id: "default",
    label: "Dung tích tiêu chuẩn",
    price: product.price
  };
  const familyHighlights = Array.isArray(guide?.families) ? guide.families.slice(0, 6) : [];
  const choosingSteps = Array.isArray(guide?.howToChoose) ? guide.howToChoose.slice(0, 3) : [];

  return `
    <section class="sl-section sl-discovery">
      <div class="container sl-stack sl-stack--loose">
        <div class="sl-discovery-hero">
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
              <p class="sl-card-copy sl-discovery-purchase__description">${product.shortDescription}</p>
            </div>

            <div class="sl-discovery-purchase__meta">
              <div class="sl-discovery-purchase__meta-row">
                <span class="sl-label sl-muted">Dung tích</span>
                <p class="sl-discovery-purchase__meta-value">${size.label}</p>
              </div>
              <div class="sl-discovery-purchase__meta-row">
                <span class="sl-label sl-muted">Phù hợp nhất</span>
                <p class="sl-discovery-purchase__meta-value">Lần mua đầu, quà tặng và thử chậm rãi.</p>
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

            <div class="sl-link-row sl-discovery-purchase__actions">
              <button
                class="btn btn-primary sl-discovery-purchase__primary"
                type="button"
                data-discovery-add-to-cart
                data-size-id="${size.id}"
                data-size-price="${size.price}"
              >
                Thêm vào giỏ
              </button>
              <a class="btn btn-secondary sl-discovery-purchase__secondary" href="cua-hang.html">Xem chai full-size</a>
            </div>

            <div class="sl-product-detail__status" data-discovery-status aria-live="polite"></div>
          </aside>
        </div>

        <section class="sl-discovery-panel sl-discovery-guide" id="tu-van-chon-mui">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Tư vấn chọn mùi</p>
            <h2>Giữ quyết định mua hàng gọn bằng cách thu hẹp từ nhóm hương.</h2>
            <p class="sl-section-summary">
              Đây là phần nội dung cốt lõi từ trang hướng dẫn cũ, được tích hợp vào Bộ Khám Phá để bạn vừa thử trên da
              vừa chọn đúng nhóm mùi và đi thẳng tới chai lớn phù hợp.
            </p>
          </div>

          ${
            familyHighlights.length
              ? `
                <div class="sl-guide-family-grid">
                  ${familyHighlights.map((family) => renderGuideFamilyCard(family)).join("")}
                </div>
              `
              : ""
          }

          ${
            choosingSteps.length
              ? `
                <div class="sl-stack sl-stack--tight">
                  <p class="sl-label sl-muted">Quy trình chọn nhanh</p>
                  <div class="sl-guide-step-grid">
                    ${choosingSteps.map((step) => renderGuideChoiceStep(step)).join("")}
                  </div>
                </div>
              `
              : ""
          }
        </section>

        <section class="sl-discovery-panel" id="nghi-thuc-thu-mui">
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
            <h2 class="sl-support-title">Muốn chuyển sang chai lớn ngay hôm nay?</h2>
            <p class="sl-card-copy">
              Khi đã chốt được nhóm hương phù hợp từ phần tư vấn và trải nghiệm trên da, hãy mở cửa hàng để chọn dung
              tích full-size phù hợp nhịp sử dụng của bạn.
            </p>
          </div>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Xem bộ sưu tập</a>
            <a class="btn btn-secondary" href="#tu-van-chon-mui">Xem lại tư vấn chọn mùi</a>
          </div>
        </section>
      </div>
    </section>
  `;
}
