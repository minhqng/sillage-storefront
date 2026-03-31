import { formatCurrency } from "../core/checkout-service.js";
import { formatFamilyLabel } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";

function createMessageId(id, suffix) {
  return `${id}-${suffix}`;
}

function buildAriaDescribedBy(ids) {
  const tokens = ids.filter(Boolean).join(" ");
  return tokens ? ` aria-describedby="${tokens}"` : "";
}

function renderTrustGlyph(type) {
  if (type === "security") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 18.5 6v5.5c0 4.2-2.7 7.4-6.5 9-3.8-1.6-6.5-4.8-6.5-9V6L12 3.5Z"></path>
        <path d="M9.4 11.9 11.2 13.8 14.8 10.1"></path>
      </svg>
    `;
  }

  if (type === "payment") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="2"></rect>
        <path d="M3.5 10h17"></path>
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

function renderCheckoutProgress() {
  return `
    <div class="sl-checkout-progress" aria-label="Tiến trình thanh toán">
      <div class="sl-checkout-progress__step is-complete">
        <span class="sl-checkout-progress__number">01</span>
        <span>Liên hệ &amp; Giao hàng</span>
      </div>
      <div class="sl-checkout-progress__step is-current">
        <span class="sl-checkout-progress__number">02</span>
        <span>Thanh toán</span>
      </div>
      <div class="sl-checkout-progress__step">
        <span class="sl-checkout-progress__number">03</span>
        <span>Xác nhận</span>
      </div>
    </div>
  `;
}

function renderCheckoutNotice({ removedStaleCount = 0, updatedPriceCount = 0 } = {}) {
  if (!removedStaleCount && !updatedPriceCount) {
    return "";
  }

  const messages = [];

  if (removedStaleCount) {
    messages.push(`${removedStaleCount} sản phẩm không còn khả dụng đã được gỡ trước khi vào bước thanh toán.`);
  }

  if (updatedPriceCount) {
    messages.push(`${updatedPriceCount} sản phẩm đã được cập nhật về mức giá niêm yết mới nhất.`);
  }

  return `
    <div class="sl-checkout__notice" role="status" aria-live="polite">
      <p>${messages.join(" ")}</p>
    </div>
  `;
}

function renderFeedback(message, id = "") {
  if (!message) {
    return "";
  }

  return `<div class="invalid-feedback"${id ? ` id="${id}"` : ""}>${message}</div>`;
}

function renderField({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  required = true,
  autocomplete = "",
  inputmode = "",
  note = "",
  feedback,
  dataAttribute = "",
  maxLength = "",
  readOnly = false,
  value = ""
}) {
  const noteId = note ? createMessageId(id, "note") : "";
  const feedbackId = feedback ? createMessageId(id, "feedback") : "";
  const describedBy = buildAriaDescribedBy([noteId]);

  return `
    <div class="sl-checkout-field">
      <label class="form-label" for="${id}">${label}</label>
      <input
        class="form-control"
        id="${id}"
        name="${name}"
        type="${type}"
        placeholder="${placeholder}"
        value="${value}"
        ${required ? "required" : ""}
        ${autocomplete ? `autocomplete="${autocomplete}"` : ""}
        ${inputmode ? `inputmode="${inputmode}"` : ""}
        ${dataAttribute}
        ${maxLength ? `maxlength="${maxLength}"` : ""}
        ${feedbackId ? `data-feedback-id="${feedbackId}"` : ""}
        ${readOnly ? "readonly" : ""}
        ${describedBy}
      />
      ${note ? `<p class="sl-field-note" id="${noteId}">${note}</p>` : ""}
      ${renderFeedback(feedback, feedbackId)}
    </div>
  `;
}

function renderCountryField() {
  return renderField({
    id: "checkout-country",
    name: "country",
    label: "Khu vực giao hàng",
    placeholder: "",
    required: true,
    readOnly: true,
    value: "Việt Nam",
    note: "Sillage hiện giao hàng trong phạm vi Việt Nam.",
    feedback: ""
  });
}

function renderShippingOption(option, isChecked) {
  const optionId = `checkout-shipping-${option.id}`;
  const descriptionId = createMessageId(optionId, "description");

  return `
    <label class="sl-checkout-method${isChecked ? " is-active" : ""}">
      <input
        class="form-check-input"
        type="radio"
        id="${optionId}"
        name="shippingMethod"
        value="${option.id}"
        aria-describedby="${descriptionId}"
        ${isChecked ? "checked" : ""}
      />
      <span class="sl-checkout-method__copy">
        <span class="sl-checkout-method__title">${option.label}</span>
        <span class="sl-checkout-method__description" id="${descriptionId}">${option.description}</span>
      </span>
      <span class="sl-checkout-method__price">${option.price === 0 ? "Miễn phí" : formatCurrency(option.price)}</span>
    </label>
  `;
}

function renderSummaryItem(item) {
  return `
    <article class="sl-checkout-summary__item">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${escapeHtml(formatFamilyLabel(item.family))}</p>
        <h3 class="sl-checkout-summary__item-title">${escapeHtml(item.name)}</h3>
        <p class="sl-checkout-summary__item-meta">${item.sizeLabel} &middot; SL ${item.quantity}</p>
      </div>
      <div class="sl-checkout-summary__item-price">${formatCurrency(item.lineTotal)}</div>
    </article>
  `;
}

function renderTrustBand() {
  return `
    <section class="sl-checkout-trust" aria-label="Thông tin hỗ trợ thanh toán">
      <article class="sl-checkout-trust__card">
        <div class="sl-checkout-trust__icon">${renderTrustGlyph("security")}</div>
        <p class="sl-label sl-muted">Bảo mật</p>
        <h3>Thông tin thẻ được kiểm tra cục bộ trong trình duyệt cho luồng mô phỏng này.</h3>
        <p class="sl-card-copy">Sillage không lưu dữ liệu thẻ sau khi bạn hoàn tất đơn mô phỏng, nên bạn luôn nhìn rõ dữ liệu nào đang được nhập và xác nhận.</p>
      </article>
      <article class="sl-checkout-trust__card">
        <div class="sl-checkout-trust__icon">${renderTrustGlyph("payment")}</div>
        <p class="sl-label sl-muted">Thanh toán</p>
        <h3>Visa, Mastercard và COD đã sẵn sàng cho bước chốt đơn.</h3>
        <p class="sl-card-copy">Bạn có thể tiếp tục xác nhận thông tin và hoàn tất đơn ngay trong luồng thanh toán hiện tại.</p>
      </article>
      <article class="sl-checkout-trust__card">
        <div class="sl-checkout-trust__icon">${renderTrustGlyph("support")}</div>
        <p class="sl-label sl-muted">Hỗ trợ trước khi đặt</p>
        <h3>Cần xác nhận quà tặng, giao nhanh hay đổi người nhận?</h3>
        <p class="sl-card-copy">Hãy <a href="cau-hoi-thuong-gap.html#lien-he-tong">liên hệ concierge</a> trước khi đặt nếu bạn muốn chốt lại lần cuối các chi tiết của đơn.</p>
      </article>
    </section>
  `;
}

export function renderCheckoutLoadingState() {
  return `
    <section class="sl-section sl-checkout">
      <div class="container">
        <div class="sl-empty-state is-loading">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Đang tải bước thanh toán</p>
            <h2>Đang hoàn thiện đơn hàng của bạn.</h2>
            <p class="sl-section-summary">Hệ thống đang đối chiếu giỏ hàng với phương thức giao và mức giá mới nhất.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderCheckoutErrorState() {
  return `
    <section class="sl-section sl-checkout">
      <div class="container">
        <div class="sl-checkout-empty">
          <div class="sl-checkout-empty__content sl-stack">
            <p class="sl-label sl-muted">Thanh toán tạm thời không khả dụng</p>
            <h2>Không thể mở bước thanh toán lúc này.</h2>
            <p class="sl-section-summary">
              Hãy quay lại cửa hàng, hoặc xem lại giỏ hàng trước khi thử lại.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Về cửa hàng</a>
              <a class="btn btn-quiet" href="gio-hang.html">Xem lại giỏ hàng</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderEmptyCheckoutState(notices = {}) {
  return `
    <section class="sl-section sl-checkout">
      <div class="container sl-stack sl-stack--loose">
        ${renderCheckoutNotice(notices)}
        ${renderCheckoutProgress()}
        <div class="sl-checkout-empty">
          <div class="sl-checkout-empty__content sl-stack">
            <p class="sl-label sl-muted">Cần có giỏ hàng trước khi thanh toán</p>
            <h2>Thanh toán sẽ mở khi giỏ hàng đã sẵn sàng.</h2>
            <p class="sl-section-summary">
              Hãy thêm ít nhất một sản phẩm hoặc Bộ Khám Phá. Khi giỏ hàng đã có lựa chọn, thông tin giao hàng và thanh toán sẽ hiển thị đầy đủ.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Mở cửa hàng</a>
              <a class="btn btn-quiet" href="gio-hang.html">Xem giỏ hàng</a>
            </div>
          </div>
        </div>
        ${renderTrustBand()}
      </div>
    </section>
  `;
}

export function renderCheckoutView(checkoutState, notices = {}) {
  return `
    <section class="sl-section sl-checkout">
      <div class="container sl-stack sl-stack--loose" data-checkout-root>
        ${renderCheckoutNotice(notices)}
        ${renderCheckoutProgress()}

        <div class="sl-checkout__header">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Thanh toán</p>
            <h2 class="sl-checkout__title">Xác nhận giao hàng và hoàn tất đơn.</h2>
            <p class="sl-section-summary">
              Điền thông tin nhận hàng, chọn phương thức giao và xem lại đơn một lần cuối trước khi đặt.
            </p>
          </div>
        </div>

        <div class="sl-checkout__layout">
          <form class="sl-form-layout sl-checkout-form needs-validation" id="sl-checkout-form" novalidate data-checkout-form>
            <section class="sl-checkout-panel">
              <div class="sl-stack sl-stack--tight">
                <p class="sl-label sl-muted">Liên hệ</p>
                <h3>Email và số điện thoại để cập nhật đơn hàng.</h3>
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-email",
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "minhnq@gdscptit.dev",
                  autocomplete: "email",
                  feedback: "Vui lòng nhập địa chỉ email hợp lệ."
                })}
                ${renderField({
                  id: "checkout-phone",
                  name: "phone",
                  label: "Số điện thoại",
                  type: "tel",
                  placeholder: "0909 123 456",
                  autocomplete: "tel",
                  inputmode: "tel",
                  dataAttribute: 'data-checkout-phone',
                  feedback: "Vui lòng nhập số điện thoại hợp lệ."
                })}
              </div>
            </section>

            <section class="sl-checkout-panel">
              <div class="sl-stack sl-stack--tight">
                <p class="sl-label sl-muted">Giao hàng</p>
                <h3>Địa chỉ nhận hàng và phương thức vận chuyển.</h3>
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-full-name",
                  name: "fullName",
                  label: "Họ và tên người nhận",
                  placeholder: "NGUYEN QUANG MINH",
                  autocomplete: "name",
                  feedback: "Vui lòng nhập tên người nhận."
                })}
                ${renderField({
                  id: "checkout-address-line1",
                  name: "addressLine1",
                  label: "Số nhà, tên đường",
                  placeholder: "Km 10 Nguyễn Trãi",
                  autocomplete: "address-line1",
                  feedback: "Vui lòng nhập địa chỉ nhận hàng."
                })}
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-address-line2",
                  name: "addressLine2",
                  label: "Tòa nhà, căn hộ (nếu có)",
                  placeholder: "Căn hộ 12A, tầng 8",
                  required: false,
                  autocomplete: "address-line2",
                  feedback: ""
                })}
                ${renderField({
                  id: "checkout-city",
                  name: "city",
                  label: "Tỉnh / Thành phố",
                  placeholder: "Hà Nội",
                  autocomplete: "address-level1",
                  feedback: "Vui lòng nhập tỉnh hoặc thành phố."
                })}
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-region",
                  name: "region",
                  label: "Quận / Huyện",
                  placeholder: "Hà Đông",
                  autocomplete: "address-level2",
                  feedback: "Vui lòng nhập quận hoặc huyện."
                })}
                ${renderField({
                  id: "checkout-postal-code",
                  name: "postalCode",
                  label: "Phường / Xã",
                  placeholder: "Mộ Lao",
                  autocomplete: "address-level3",
                  feedback: "Vui lòng nhập phường hoặc xã."
                })}
              </div>
              <div class="sl-form-row">
                ${renderCountryField()}
              </div>

              <fieldset class="sl-checkout-fieldset sl-stack sl-stack--tight" aria-describedby="checkout-shipping-help">
                <legend class="sl-label sl-muted">Phương thức giao hàng</legend>
                <p class="sl-card-copy" id="checkout-shipping-help">
                  Chọn tốc độ giao phù hợp với thời điểm bạn cần nhận hàng.
                </p>
                <div class="sl-checkout-methods" data-shipping-options>
                  ${checkoutState.shippingOptions
                    .map((option) => renderShippingOption(option, option.id === checkoutState.selectedShippingId))
                    .join("")}
                </div>
              </fieldset>
            </section>

            <section class="sl-checkout-panel">
              <div class="sl-stack sl-stack--tight">
                <p class="sl-label sl-muted">Thanh toán</p>
                <h3>Thông tin thẻ.</h3>
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-cardholder-name",
                  name: "cardholderName",
                  label: "Tên chủ thẻ",
                  placeholder: "NGUYEN QUANG MINH",
                  autocomplete: "cc-name",
                  feedback: "Vui lòng nhập tên in trên thẻ."
                })}
                ${renderField({
                  id: "checkout-card-number",
                  name: "cardNumber",
                  label: "Số thẻ",
                  placeholder: "4242 4242 4242 4242",
                  autocomplete: "cc-number",
                  inputmode: "numeric",
                  dataAttribute: 'data-checkout-card-number',
                  maxLength: "23",
                  feedback: "Vui lòng nhập số thẻ hợp lệ."
                })}
              </div>
              <div class="sl-form-row">
                ${renderField({
                  id: "checkout-expiry",
                  name: "expiry",
                  label: "Ngày hết hạn",
                  placeholder: "08 / 29",
                  autocomplete: "cc-exp",
                  inputmode: "numeric",
                  dataAttribute: 'data-checkout-expiry',
                  maxLength: "7",
                  feedback: "Vui lòng nhập ngày hết hạn hợp lệ."
                })}
                ${renderField({
                  id: "checkout-cvc",
                  name: "cvc",
                  label: "Mã bảo mật",
                  placeholder: "123",
                  autocomplete: "cc-csc",
                  inputmode: "numeric",
                  dataAttribute: 'data-checkout-cvc',
                  maxLength: "4",
                  feedback: "Vui lòng nhập mã bảo mật hợp lệ."
                })}
              </div>

              <div class="form-check sl-checkout-check">
                <input class="form-check-input" type="checkbox" value="yes" id="checkout-billing-same" name="billingSame" checked />
                <label class="form-check-label" for="checkout-billing-same">
                  Dùng cùng địa chỉ nhận hàng cho thông tin thanh toán.
                </label>
              </div>

              <div class="form-check sl-checkout-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="accepted"
                  id="checkout-terms"
                  name="termsAccepted"
                  required
                  data-feedback-id="checkout-terms-feedback"
                  data-checkout-terms
                />
                <label class="form-check-label" for="checkout-terms">
                  Tôi xác nhận thông tin nhận hàng và thanh toán là chính xác trước khi đặt đơn.
                </label>
                ${renderFeedback("Vui lòng xác nhận thông tin trước khi tiếp tục.", "checkout-terms-feedback")}
              </div>
            </section>
          </form>

          <aside class="sl-checkout-summary">
            <div class="sl-stack sl-stack--tight">
              <p class="sl-label sl-muted">Tóm tắt đơn hàng</p>
              <h2 class="sl-checkout-summary__title">Tóm tắt đơn hàng</h2>
              <p class="sl-card-copy">Các sản phẩm được giữ nguyên trong giỏ cho tới khi bạn xác nhận đơn.</p>
            </div>

            <div class="sl-checkout-summary__items">
              ${checkoutState.items.map((item) => renderSummaryItem(item)).join("")}
            </div>

            <div class="sl-checkout-summary__totals">
              <div class="sl-checkout-summary__row">
                <span>Tạm tính</span>
                <span>${formatCurrency(checkoutState.subtotal)}</span>
              </div>
              <div class="sl-checkout-summary__row">
                <span data-checkout-shipping-label>${checkoutState.shippingLabel}</span>
                <span data-checkout-shipping-price>${checkoutState.shippingPrice === 0 ? "Miễn phí" : formatCurrency(checkoutState.shippingPrice)}</span>
              </div>
              <p class="sl-checkout-summary__shipping-note" data-checkout-shipping-note>${checkoutState.shippingDescription}</p>
              <div class="sl-checkout-summary__row is-total">
                <span>Tổng cộng</span>
                <span data-checkout-total>${formatCurrency(checkoutState.total)}</span>
              </div>
            </div>
            <button class="btn btn-primary btn-primary--checkout" type="submit" form="sl-checkout-form" data-submit-order>
              Đặt hàng
            </button>
            <p class="sl-checkout-summary__secure">
              🔒 Thông tin thẻ chỉ được kiểm tra cục bộ trong trình duyệt cho lần mô phỏng này.
            </p>
            <p class="sl-checkout-summary__meta">
              Hãy xem lại phương thức giao, tổng tiền và địa chỉ trước khi xác nhận đơn.
            </p>
          </aside>
        </div>

        ${renderTrustBand()}
      </div>
    </section>
  `;
}

export function renderCheckoutSuccessState() {
  return `
    <section class="sl-section sl-checkout">
      <div class="container sl-stack sl-stack--loose">
        <div class="sl-checkout-success">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Đơn hàng đã được xác nhận</p>
            <h1 class="sl-checkout-success__title">Cảm ơn <span data-confirmation-first-name></span>.</h1>
            <p class="sl-section-summary">
              Xác nhận đơn hàng đã được gửi tới <span data-confirmation-email></span>. Thông tin giao hàng của đơn này được hiển thị ngay bên dưới.
            </p>
          </div>

          <div class="sl-checkout-success__grid">
            <article class="sl-checkout-success__card">
              <p class="sl-label sl-muted">Mã đơn hàng</p>
              <h3 data-confirmation-order-number></h3>
              <p class="sl-card-copy">Hãy giữ mã này để tiện đối chiếu khi cần hỏi thêm về giao hàng hoặc đơn đặt.</p>
            </article>
            <article class="sl-checkout-success__card">
              <p class="sl-label sl-muted">Phương thức giao</p>
              <h3 data-confirmation-shipping-label></h3>
              <p class="sl-card-copy" data-confirmation-shipping-description></p>
            </article>
            <article class="sl-checkout-success__card">
              <p class="sl-label sl-muted">Tổng thanh toán</p>
              <h3 data-confirmation-total></h3>
              <p class="sl-card-copy" data-confirmation-item-count></p>
            </article>
          </div>

          <div class="sl-checkout-success__meta">
            <p>
              Khu vực nhận hàng:
              <span data-confirmation-city></span>, <span data-confirmation-country></span>
            </p>
            <p>
              Email xác nhận:
              <span data-confirmation-email-meta></span>
            </p>
          </div>

          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Tiếp tục mua sắm</a>
            <a class="btn btn-quiet" href="bo-kham-pha.html#tu-van-chon-mui">Xem tư vấn chọn mùi</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function setText(root, selector, value) {
  const node = root.querySelector(selector);

  if (node instanceof HTMLElement) {
    node.textContent = String(value ?? "");
  }
}

export function hydrateCheckoutSuccessState(root, confirmation) {
  setText(root, "[data-confirmation-first-name]", confirmation.firstName);
  setText(root, "[data-confirmation-email]", confirmation.email);
  setText(root, "[data-confirmation-order-number]", confirmation.orderNumber);
  setText(root, "[data-confirmation-shipping-label]", confirmation.shippingLabel);
  setText(root, "[data-confirmation-shipping-description]", confirmation.shippingDescription);
  setText(root, "[data-confirmation-total]", formatCurrency(confirmation.total));
  setText(root, "[data-confirmation-item-count]", `${confirmation.itemCount} sản phẩm trong đơn hàng này.`);
  setText(root, "[data-confirmation-city]", confirmation.city);
  setText(root, "[data-confirmation-country]", confirmation.country);
  setText(root, "[data-confirmation-email-meta]", confirmation.email);
}
