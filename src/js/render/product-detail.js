import {
  formatFamilyLabel,
  getDefaultProductSize,
  getProductCategoryLabel,
  getProductGallery,
  getProductNotes,
  getProductSizes
} from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatPrice, formatTag } from "../utils/format.js";
import { renderEditorialArtwork, renderProductArtwork } from "./media-art.js";

export function formatProductPrice(price) {
  return formatPrice(price);
}

function formatList(items) {
  return items.length > 0 ? items.map((item) => formatTag(item)).join(" / ") : "Chưa cập nhật";
}

function renderTrustGlyph(type) {
  if (type === "occasion") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5v3M17 3.5v3M4 8.5h16M5.5 6.5h13a1.5 1.5 0 0 1 1.5 1.5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a1.5 1.5 0 0 1 1.5-1.5Z"></path>
      </svg>
    `;
  }

  if (type === "discovery") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18.5V9.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9"></path>
        <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7"></path>
        <path d="M3.5 18.5h17"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5c4.4 0 8-3.6 8-8a8 8 0 1 0-16 0c0 4.4 3.6 8 8 8Z"></path>
      <path d="M8.5 12.6 10.8 15l4.8-5.2"></path>
    </svg>
  `;
}

function renderNoteGroup(title, notes) {
  return `
    <div class="sl-product-detail__note-group">
      <p class="sl-label sl-muted">${escapeHtml(title)}</p>
      <p class="sl-product-detail__note-copy">${notes.map((note) => escapeHtml(note)).join(", ")}</p>
    </div>
  `;
}

function renderSizeOptions(sizes) {
  return sizes
    .map(
      (size) => `
        <label
          class="sl-product-detail__size${size.isDefault ? " is-active" : ""}"
          for="product-size-${size.id}"
        >
          <input
            class="sl-product-detail__size-input"
            id="product-size-${size.id}"
            type="radio"
            name="product-size"
            value="${size.id}"
            data-size-option
            ${size.isDefault ? "checked" : ""}
          />
          <span class="sl-product-detail__size-copy">
            <span>${size.label}</span>
            <span>${formatProductPrice(size.price)}</span>
          </span>
        </label>
      `
    )
    .join("");
}

function renderMetadata(product) {
  const sizeCount = product.volumes?.length ?? 1;
  const details = [
    { label: "Nhóm hương", value: escapeHtml(formatFamilyLabel(product.family)) },
    { label: "Dịp dùng", value: escapeHtml(formatList(product.occasionTags ?? [])) },
    { label: "Mùa phù hợp", value: escapeHtml(formatList(product.seasonTags ?? [])) },
    { label: "Dung tích", value: `${sizeCount} lựa chọn` }
  ];

  return details
    .map(
      (detail) => `
        <div class="sl-product-detail__meta-item">
          <p class="sl-label sl-muted">${detail.label}</p>
          <p>${detail.value}</p>
        </div>
      `
    )
    .join("");
}

function renderGalleryImages(product) {
  const galleryImages = getProductGallery(product).slice(0, 2);
  const notes = getProductNotes(product);
  const captions = [
    {
      eyebrow: "Chất liệu nổi bật",
      title: notes[0] ?? "Điểm nhấn chủ đạo",
      copy: product.shortDescription
    },
    {
      eyebrow: "Cách mùi hương vận hành",
      title: (product.occasionTags ?? [])[0] ?? "Dùng hàng ngày",
      copy: product.longDescription
    }
  ];

  return galleryImages
    .map((image, index) => {
      const caption = captions[index] ?? captions[0];

      return `
        <article class="sl-product-detail__gallery-tile${index === 0 ? " is-primary" : " is-secondary"}">
          ${renderEditorialArtwork(image, `${product.name} hình ảnh biên tập ${index + 1}`, "sl-product-detail__gallery-art")}
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">${caption.eyebrow}</p>
            <h3>${formatTag(caption.title)}</h3>
            <p class="sl-card-copy">${caption.copy}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTrustCards(product) {
  const occasionTags = product.occasionTags ?? [];
  const primaryOccasion = formatTag(occasionTags[0] ?? "dùng hàng ngày");
  const secondaryOccasion = formatTag(occasionTags[1] ?? occasionTags[0] ?? "nhịp sống thành thị");
  const familyLabel = formatFamilyLabel(product.family).toLowerCase();

  const cards = [
    {
      eyebrow: "Dịp dùng",
      title: `Hợp với ${primaryOccasion} và ${secondaryOccasion}.`,
      copy: `${product.name} được biên tập để giữ khung ${familyLabel} rõ trên da mà không cần đợi đến một dịp quá đặc biệt mới dùng được.`,
      glyph: "occasion"
    },
    {
      eyebrow: "So sánh trên da",
      title: "Chưa chắc chai lớn? Bắt đầu bằng Bộ Khám Phá.",
      copy: "Nếu bạn đang cân giữa hai hướng mùi, bộ thử sẽ cho phép so sánh nhịp mở, độ bám và cảm giác thật trên da trước khi chốt dung tích lớn.",
      glyph: "discovery"
    },
    {
      eyebrow: "Tư vấn trước khi đặt",
      title: "Cần chốt quà tặng hoặc dung tích phù hợp?",
      copy: "Đội ngũ có thể hỗ trợ chọn chai cho quà tặng, xác nhận thời điểm giao hoặc gợi ý cách bắt đầu an toàn hơn nếu đây là lần mua đầu.",
      glyph: "support"
    }
  ];

  return cards
    .map(
      (card) => `
        <article class="sl-product-detail__trust-card">
          <div class="sl-product-detail__trust-icon">${renderTrustGlyph(card.glyph)}</div>
          <p class="sl-label sl-muted">${card.eyebrow}</p>
          <h3>${card.title}</h3>
          <p class="sl-card-copy">${card.copy}</p>
        </article>
      `
    )
    .join("");
}

export function renderProductLoadingState() {
  return `
    <section class="sl-section sl-section--hero">
      <div class="container">
        <div class="sl-page-frame">
          <p class="sl-label sl-muted">Đang tải sản phẩm</p>
          <h1 class="sl-page-title">Đang chuẩn bị hồ sơ mùi hương.</h1>
          <p class="sl-page-summary">Đang lấy nốt hương, dung tích và thông tin sử dụng cho lựa chọn bạn vừa mở.</p>
        </div>
      </div>
    </section>
  `;
}

export function renderInvalidProductState() {
  return `
    <section class="sl-section sl-section--hero">
      <div class="container">
        <div class="sl-page-frame">
          <p class="sl-label sl-muted">Không tìm thấy sản phẩm</p>
          <h1 class="sl-page-title">Mùi hương này hiện không khả dụng.</h1>
          <p class="sl-page-summary">
            Quay lại cửa hàng để xem toàn bộ bộ sưu tập, hoặc bắt đầu bằng Bộ Khám Phá nếu bạn muốn so sánh trước khi chọn chai lớn.
          </p>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Về cửa hàng</a>
            <a class="btn btn-quiet" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderProductDetail(product) {
  const sizes = getProductSizes(product);
  const defaultSize = getDefaultProductSize(product) ?? sizes[0];

  return `
    <section class="sl-section sl-product-detail">
      <div class="container sl-stack sl-stack--loose" data-product-root data-product-id="${product.id}">
        <nav class="sl-product-detail__breadcrumbs" aria-label="Điều hướng phân cấp">
          <a href="index.html">Trang chủ</a>
          <span>/</span>
          <a href="cua-hang.html">Cửa hàng</a>
          <span>/</span>
          <span aria-current="page">${product.name}</span>
        </nav>

        <div class="sl-product-detail__grid">
          <section class="sl-product-detail__media">
            <div class="sl-product-detail__hero-visual">
              ${renderProductArtwork(product, {
                className: "sl-product-detail__hero-art",
                alt: `Chai nước hoa ${product.name}`,
                loading: "eager",
                sizes: "(min-width: 992px) 48vw, 100vw"
              })}
            </div>
            <div class="sl-product-detail__gallery">
              ${renderGalleryImages(product)}
            </div>
          </section>

          <section class="sl-product-detail__purchase sl-stack sl-stack--loose">
            <div class="sl-stack">
              <p class="sl-label sl-muted">${getProductCategoryLabel(product)}</p>
              <h1 class="sl-product-detail__title">${product.name}</h1>
              <p class="sl-product-detail__subtitle">${product.tagline}</p>
              <p class="sl-product-detail__price" data-product-price>${formatProductPrice(defaultSize.price)}</p>
              <p class="sl-product-detail__description">${product.longDescription}</p>
            </div>

            <div class="sl-stack">
              <fieldset class="sl-product-detail__sizes" aria-describedby="product-size-help">
                <legend class="sl-label sl-muted">Dung tích</legend>
                <p class="sl-card-copy" id="product-size-help">Chọn dung tích phù hợp với nhịp dùng và ngân sách của bạn.</p>
                <div class="sl-product-detail__size-grid">
                  ${renderSizeOptions(sizes)}
                </div>
              </fieldset>

              <div class="sl-product-detail__quantity-block">
                <label class="sl-label sl-muted" for="product-quantity">Số lượng</label>
                <div class="sl-product-detail__quantity-control">
                  <button class="sl-product-detail__stepper" type="button" data-quantity-step="-1" aria-label="Giảm số lượng">-</button>
                  <input
                    id="product-quantity"
                    class="sl-product-detail__quantity-input"
                    type="text"
                    value="1"
                    inputmode="numeric"
                    readonly
                    data-quantity-input
                  />
                  <button class="sl-product-detail__stepper" type="button" data-quantity-step="1" aria-label="Tăng số lượng">+</button>
                </div>
              </div>

              <div class="sl-link-row sl-product-detail__actions">
                <button
                  class="btn btn-primary sl-product-detail__primary-action"
                  type="button"
                  data-add-to-cart
                  data-product-id="${product.id}"
                  data-size-id="${defaultSize.id}"
                  data-size-label="${defaultSize.label}"
                  data-size-price="${defaultSize.price}"
                >
                  Thêm vào giỏ
                </button>
                <a class="btn btn-quiet sl-product-detail__secondary-action" href="bo-kham-pha.html">So sánh qua Bộ Khám Phá</a>
              </div>

              <div class="sl-product-detail__status" data-cart-status aria-live="polite"></div>
            </div>

            <div class="sl-product-detail__meta-grid">
              ${renderMetadata(product)}
            </div>
          </section>
        </div>

        <section class="sl-product-detail__notes-section">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Cấu trúc nốt hương</p>
            <h2>Ba tầng hương rõ ràng, không xếp chồng quá mức.</h2>
            <p class="sl-section-summary">
              Mùi hương mở sáng, đi vào tầng giữa có kiểm soát và khép lại bằng những chất liệu được chọn vì kết cấu, độ bám và sự cân bằng trên da.
            </p>
          </div>
          <div class="sl-product-detail__notes-grid">
            ${renderNoteGroup("Nốt đầu", product.topNotes ?? [])}
            ${renderNoteGroup("Nốt giữa", product.middleNotes ?? [])}
            ${renderNoteGroup("Nốt cuối", product.baseNotes ?? [])}
          </div>
        </section>

        <section class="sl-product-detail__trust">
          ${renderTrustCards(product)}
        </section>
      </div>
    </section>
  `;
}
