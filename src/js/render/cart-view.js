import { CART_MAX_QUANTITY } from "../core/cart-store.js";
import { formatFamilyLabel } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatPrice } from "../utils/format.js";
import { renderProductArtwork } from "./media-art.js";

function renderTrustGlyph(type) {
  if (type === "shipping") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7.5h11v8h-11Z"></path>
        <path d="M14.5 10h3l2 2.6v2.9h-5Z"></path>
        <circle cx="8" cy="18" r="1.8"></circle>
        <circle cx="17" cy="18" r="1.8"></circle>
      </svg>
    `;
  }

  if (type === "return") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7H4V3"></path>
        <path d="M4 7a8 8 0 1 1-1 8"></path>
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

function renderCartNotice({ removedStaleCount = 0, updatedPriceCount = 0 } = {}) {
  if (!removedStaleCount && !updatedPriceCount) {
    return "";
  }

  const messages = [];

  if (removedStaleCount) {
    messages.push(`${removedStaleCount} sản phẩm không còn khả dụng đã được gỡ khỏi giỏ hàng.`);
  }

  if (updatedPriceCount) {
    messages.push(`${updatedPriceCount} sản phẩm đã được cập nhật về mức giá đang niêm yết.`);
  }

  return `
    <div class="sl-cart__notice" role="status" aria-live="polite">
      <p>${messages.join(" ")}</p>
    </div>
  `;
}

function renderCartItem(item) {
  const itemId = `cart-${item.productId}-${item.sizeId}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const notesMarkup =
    item.notes.length > 0
      ? `
        <ul class="sl-cart-item__notes" aria-label="Nốt hương tiêu biểu">
          ${item.notes
            .map(
              (note) => `
                <li>${note}</li>
              `
            )
            .join("")}
        </ul>
      `
      : "";

  return `
    <article class="sl-cart-item" data-cart-item data-product-id="${item.productId}" data-size-id="${item.sizeId}">
      <div class="sl-cart-item__media">
        ${renderProductArtwork(item, {
          className: "sl-cart-item__art",
          alt: `Chai nước hoa ${item.name}`,
          sizes: "(min-width: 768px) 16rem, 100vw"
        })}
        <div class="sl-cart-item__media-meta">
          <p class="sl-label">${formatFamilyLabel(item.family)}</p>
          <p class="sl-cart-item__size-label">${item.sizeLabel}</p>
        </div>
      </div>

      <div class="sl-cart-item__content sl-stack">
        <div class="sl-cart-item__header">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">${escapeHtml(item.isDiscovery ? "Bộ khám phá" : "Chai full-size")}</p>
            <h2 class="sl-cart-item__title">
              <a href="${item.href}">${escapeHtml(item.name)}</a>
            </h2>
            <p class="sl-cart-item__tagline">${escapeHtml(item.tagline)}</p>
          </div>
          <div class="sl-cart-item__pricing">
            <p class="sl-cart-item__line-total">${formatPrice(item.lineTotal)}</p>
            <p class="sl-cart-item__unit-price">${formatPrice(item.unitPrice)} / sản phẩm</p>
          </div>
        </div>

        <p class="sl-cart-item__description">${escapeHtml(item.description)}</p>

        <div class="sl-cart-item__meta">
          <p><span class="sl-label sl-muted">Nhóm hương</span> ${formatFamilyLabel(item.family)}</p>
          <p><span class="sl-label sl-muted">Dung tích</span> ${item.sizeLabel}</p>
        </div>

        ${notesMarkup}

        <div class="sl-cart-item__footer">
          <div class="sl-cart-item__quantity-block">
            <label class="sl-label sl-muted" for="${itemId}">Số lượng</label>
            <div class="sl-cart-item__quantity-control">
              <button
                class="sl-cart-item__stepper"
                type="button"
                data-cart-step="-1"
                aria-label="Giảm số lượng của ${item.name}"
                ${item.quantity <= 1 ? "disabled" : ""}
              >
                -
              </button>
              <input
                id="${itemId}"
                class="sl-cart-item__quantity-input"
                type="number"
                min="1"
                max="${CART_MAX_QUANTITY}"
                step="1"
                value="${item.quantity}"
                inputmode="numeric"
                data-cart-quantity
              />
              <button
                class="sl-cart-item__stepper"
                type="button"
                data-cart-step="1"
                aria-label="Tăng số lượng của ${item.name}"
                ${item.quantity >= CART_MAX_QUANTITY ? "disabled" : ""}
              >
                +
              </button>
            </div>
          </div>

          <div class="sl-link-row">
            <a class="btn btn-link sl-cart-item__action" href="${item.href}">Xem lại sản phẩm</a>
            <button class="btn btn-link sl-cart-item__action" type="button" data-cart-remove>
              Xóa khỏi giỏ
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCartSummary(summary) {
  return `
    <aside class="sl-cart-summary sl-stack">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">Tóm tắt đơn hàng</p>
        <h2 class="sl-cart-summary__title">Tóm tắt đơn hàng</h2>
        <p class="sl-card-copy">Xem lại giỏ hàng rồi chuyển sang bước giao hàng và thanh toán.</p>
      </div>

      <div class="sl-cart-summary__rows">
        <div class="sl-cart-summary__row">
          <span>Số sản phẩm</span>
          <span>${summary.itemCount}</span>
        </div>
        <div class="sl-cart-summary__row">
          <span>Số lựa chọn khác nhau</span>
          <span>${summary.lineCount}</span>
        </div>
        <div class="sl-cart-summary__row is-total">
          <span>Tạm tính</span>
          <span>${formatPrice(summary.subtotal)}</span>
        </div>
      </div>

      <div class="sl-stack sl-stack--tight">
        <a class="btn btn-primary" href="thanh-toan.html">Tiến hành thanh toán</a>
        <p class="sl-cart-summary__secure">🔒 Thanh toán bảo mật và xác nhận đơn ngay trong phiên này.</p>
        <a class="btn btn-quiet" href="cua-hang.html">Tiếp tục mua sắm</a>
      </div>

      <p class="sl-cart-summary__meta">Giỏ hàng được giữ lại trên thiết bị này cho tới khi đơn được xác nhận.</p>
    </aside>
  `;
}

function renderCartTrust() {
  return `
    <section class="sl-cart-trust" aria-label="Thông tin hỗ trợ giỏ hàng">
      <article class="sl-cart-trust__card">
        <div class="sl-cart-trust__icon">${renderTrustGlyph("shipping")}</div>
        <p class="sl-label sl-muted">Giao hàng</p>
        <h3>Phương thức giao và chi phí luôn hiện rõ trước khi bạn sang bước thanh toán.</h3>
        <p class="sl-card-copy">Các đơn nội thành và liên tỉnh đều hiển thị ngay trong checkout để bạn không phải đoán thêm ở chặng cuối.</p>
      </article>
      <article class="sl-cart-trust__card">
        <div class="sl-cart-trust__icon">${renderTrustGlyph("return")}</div>
        <p class="sl-label sl-muted">Đổi trả</p>
        <h3>Chai chưa mở có thể được xem xét theo chính sách hỗ trợ trong 14 ngày.</h3>
        <p class="sl-card-copy">Đọc chi tiết tại <a href="cau-hoi-thuong-gap.html#kham-pha-doi-tra">mục đổi trả</a> trước khi bạn xác nhận đơn.</p>
      </article>
      <article class="sl-cart-trust__card">
        <div class="sl-cart-trust__icon">${renderTrustGlyph("support")}</div>
        <p class="sl-label sl-muted">Phương thức thanh toán</p>
        <h3>Visa, Mastercard và COD đều được chuẩn bị sẵn cho bước tiếp theo.</h3>
        <p class="sl-card-copy">Nếu cần chốt quà tặng hoặc xác nhận thời điểm giao, hãy <a href="cau-hoi-thuong-gap.html#lien-he-tong">liên hệ concierge</a> trước khi đặt.</p>
      </article>
    </section>
  `;
}

export function renderCartLoadingState() {
  return `
    <section class="sl-section sl-cart">
      <div class="container">
        <div class="sl-empty-state is-loading">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Đang tải giỏ hàng</p>
            <h2>Đang gom lại các lựa chọn của bạn.</h2>
            <p class="sl-section-summary">Hệ thống đang đối chiếu giỏ hàng với dung tích và giá niêm yết mới nhất.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderCartErrorState() {
  return `
    <section class="sl-section sl-cart">
      <div class="container">
        <div class="sl-cart-empty">
          <div class="sl-cart-empty__content sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Giỏ hàng tạm thời không khả dụng</p>
            <h2>Không thể mở giỏ hàng ở thời điểm này.</h2>
            <p class="sl-section-summary">
              Hãy quay lại cửa hàng, hoặc liên hệ chăm sóc khách hàng nếu bạn cần hỗ trợ khôi phục đơn hàng.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Về cửa hàng</a>
              <a class="btn btn-quiet" href="cau-hoi-thuong-gap.html#lien-he-tong">Liên hệ hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderCartView(summary, { removedStaleCount = 0, updatedPriceCount = 0 } = {}) {
  if (summary.isEmpty) {
    return `
      <section class="sl-section sl-cart">
        <div class="container sl-stack sl-stack--loose">
          ${renderCartNotice({ removedStaleCount, updatedPriceCount })}
          <div class="sl-cart-empty">
            <div class="sl-cart-empty__content sl-stack">
              <p class="sl-label sl-muted">Giỏ hàng đang trống</p>
              <h2>Bạn chưa có sản phẩm nào trong giỏ.</h2>
              <p class="sl-section-summary">
                Bắt đầu với một chai full-size, hoặc thử Bộ Khám Phá nếu bạn muốn so sánh toàn bộ dòng hương trước khi chọn một chai lớn.
              </p>
              <div class="sl-link-row">
                <a class="btn btn-primary" href="cua-hang.html">Xem bộ sưu tập</a>
                <a class="btn btn-quiet" href="bo-kham-pha.html">Khám phá bộ thử</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  return `
    <section class="sl-section sl-cart">
      <div class="container sl-stack sl-stack--loose" data-cart-root>
        ${renderCartNotice({ removedStaleCount, updatedPriceCount })}

        <div class="sl-cart__header">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Giỏ hàng của bạn</p>
            <h2 class="sl-cart__title">Xem lại đơn hàng trước khi thanh toán.</h2>
            <p class="sl-section-summary">
              Có ${summary.itemCount} sản phẩm trong giỏ. Hãy điều chỉnh số lượng, bỏ những gì không còn phù hợp và tiếp tục khi mọi thứ đã đúng.
            </p>
          </div>
        </div>

        <div class="sl-cart__layout">
          <div class="sl-cart__items">
            ${summary.items.map((item) => renderCartItem(item)).join("")}
          </div>
          ${renderCartSummary(summary)}
        </div>

        ${renderCartTrust()}
      </div>
    </section>
  `;
}
