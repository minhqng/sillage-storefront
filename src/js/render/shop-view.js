import { ALL_FAMILIES, ALL_OCCASIONS } from "../core/filter-state.js";
import { DEFAULT_SORT } from "../core/sort-state.js";
import { formatFamilyLabel } from "../core/product-service.js";
import { formatTag } from "../utils/format.js";

function formatOccasionLabel(occasion) {
  return formatTag(occasion);
}

function renderFilterControls({ familyOptions, occasionOptions, sortOptions }) {
  return `
    <form class="sl-shop-controls sl-shop-controls--panel" data-shop-form>
      <div class="sl-shop-control">
        <label class="form-label" for="shop-family">Nhóm hương</label>
        <select class="form-select" id="shop-family" name="family" data-shop-family>
          <option value="${ALL_FAMILIES}">Tất cả nhóm hương</option>
          ${familyOptions
            .map(
              (option) => `
                <option value="${option.value}">${option.label}</option>
              `
            )
            .join("")}
        </select>
      </div>
      <div class="sl-shop-control">
        <label class="form-label" for="shop-sort">Sắp xếp</label>
        <select class="form-select" id="shop-sort" name="sort" data-shop-sort>
          ${sortOptions
            .map(
              (option) => `
                <option value="${option.value}">${option.label}</option>
              `
            )
            .join("")}
        </select>
      </div>
      <div class="sl-shop-control">
        <label class="form-label" for="shop-occasion">Dịp sử dụng</label>
        <select class="form-select" id="shop-occasion" name="occasion" data-shop-occasion>
          <option value="${ALL_OCCASIONS}">Tất cả dịp dùng</option>
          ${occasionOptions
            .map(
              (option) => `
                <option value="${option.value}">${option.label}</option>
              `
            )
            .join("")}
        </select>
      </div>

      <div class="sl-shop-filter-actions">
        <button class="btn btn-secondary" type="button" data-clear-all-filters>Xóa tất cả</button>
        <button class="btn btn-primary" type="button" data-shop-close-filters>Áp dụng lựa chọn</button>
      </div>
    </form>
  `;
}

export function renderShopView({ familyOptions, occasionOptions, sortOptions }) {
  return `
    <section class="sl-section sl-section--compact sl-divider-top">
      <div class="container sl-stack sl-stack--loose" data-shop-root>
        <div class="sl-shop-toolbar">
          <div class="sl-shop-toolbar__lead sl-stack">
            <p class="sl-label sl-muted">Bộ sưu tập</p>
            <h2>Toàn bộ chai full-size, biên tập để bạn chọn rõ hơn ngay từ đầu.</h2>
            <p class="sl-section-summary">
              Bắt đầu từ toàn bộ thư viện chai lớn, rồi thu hẹp theo nhóm hương hoặc dịp sử dụng khi bạn muốn một bản tuyển chọn ngắn hơn.
              Nếu vẫn còn phân vân, hãy thử trên da qua Bộ Khám Phá trước.
            </p>
            <p class="sl-shop-toolbar__note">
              Muốn thử trên da trước? <a href="bo-kham-pha.html">Bắt đầu với Bộ Khám Phá</a>.
            </p>
          </div>
          <div class="sl-shop-toolbar__actions">
            <button class="btn btn-secondary sl-shop-filter-toggle" type="button" data-shop-open-filters>
              Mở bộ lọc &amp; sắp xếp
            </button>
            <p class="sl-shop-toolbar__bootstrap-note">
              Bộ lọc đang được đặt trong <strong>Bootstrap Offcanvas</strong> để trang cửa hàng thể hiện rõ sidebar trượt của framework.
            </p>
          </div>
        </div>

        <div class="sl-shop-status">
          <div class="sl-shop-status__summary" data-shop-summary></div>
          <div class="sl-shop-status__chips" data-shop-active-state></div>
        </div>

        <div data-shop-results>
          ${renderLoadingState()}
        </div>

        <div
          class="offcanvas offcanvas-end sl-shop-offcanvas"
          tabindex="-1"
          id="sl-shop-filters"
          aria-labelledby="sl-shop-filters-title"
          data-shop-offcanvas
        >
          <div class="offcanvas-header sl-shop-offcanvas__header">
            <div class="sl-stack sl-stack--tight">
              <p class="sl-label sl-muted">Bootstrap Offcanvas</p>
              <h2 class="offcanvas-title" id="sl-shop-filters-title">Lọc và sắp xếp bộ sưu tập</h2>
            </div>
            <button class="btn-close" type="button" aria-label="Đóng bộ lọc" data-shop-close-filters></button>
          </div>
          <div class="offcanvas-body sl-shop-offcanvas__body">
            <p class="sl-card-copy">
              Dùng sidebar này để đổi nhóm hương, dịp sử dụng và cách sắp xếp mà không phải rời khỏi trang sản phẩm.
            </p>
            ${renderFilterControls({ familyOptions, occasionOptions, sortOptions })}
          </div>
        </div>

        <div class="toast-container sl-shop-toast-container">
          <div class="toast sl-shop-toast border-0" role="status" aria-live="polite" aria-atomic="true" data-shop-toast>
            <div class="toast-header sl-shop-toast__header">
              <strong class="me-auto">Giỏ hàng</strong>
              <small>Bootstrap Toast</small>
              <button class="btn-close" type="button" aria-label="Đóng thông báo" data-shop-toast-close></button>
            </div>
            <div class="toast-body sl-shop-toast__body" data-shop-toast-body></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLoadingState() {
  return `
    <div class="sl-empty-state is-loading">
      <div class="sl-empty-state__content sl-stack">
        <p class="sl-label sl-muted">Đang mở bộ sưu tập</p>
        <h2>Đang đưa toàn bộ mùi hương vào khung chọn.</h2>
        <p class="sl-section-summary">Vui lòng chờ trong giây lát để hiển thị đủ các chai full-size.</p>
      </div>
    </div>
  `;
}

export function renderNoResultsState() {
  return `
    <div class="sl-empty-state sl-shop-empty-state">
      <div class="sl-empty-state__content sl-stack">
        <p class="sl-label sl-muted">Không tìm thấy kết quả</p>
        <h2>Không có mùi hương nào khớp với bộ lọc hiện tại.</h2>
        <p class="sl-section-summary">
          Hãy mở rộng hoặc xóa bộ lọc để xem lại toàn bộ bộ sưu tập. Nếu cần một lối vào an toàn hơn, Bộ Khám Phá sẽ giúp bạn thử trên da trước khi chốt chai lớn.
        </p>
        <div class="sl-link-row">
          <button class="btn btn-secondary" type="button" data-clear-all-filters>Xóa tất cả bộ lọc</button>
          <a class="btn btn-quiet" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
        </div>
      </div>
    </div>
  `;
}

export function renderShopSummary({ count, selectedFamily, selectedOccasion, selectedSort, sortOptions }) {
  const sortLabel = sortOptions.find((option) => option.value === selectedSort)?.label ?? sortOptions[0]?.label ?? "";
  const familyLabel = selectedFamily === ALL_FAMILIES ? "Tất cả nhóm hương" : formatFamilyLabel(selectedFamily);
  const occasionLabel = selectedOccasion === ALL_OCCASIONS ? "Tất cả dịp dùng" : formatOccasionLabel(selectedOccasion);

  return `
    <p class="sl-shop-results-count">${count} lựa chọn</p>
    <p class="sl-shop-results-meta">${familyLabel} &middot; ${occasionLabel} &middot; ${sortLabel}</p>
  `;
}

export function renderActiveState({ selectedFamily, selectedOccasion }) {
  const chips = [];

  if (selectedFamily && selectedFamily !== ALL_FAMILIES) {
    chips.push(`
      <button class="sl-shop-chip" type="button" data-clear-filter="family">
        ${formatFamilyLabel(selectedFamily)}
        <span aria-hidden="true">x</span>
      </button>
    `);
  }

  if (selectedOccasion && selectedOccasion !== ALL_OCCASIONS) {
    chips.push(`
      <button class="sl-shop-chip" type="button" data-clear-filter="occasion">
        ${formatOccasionLabel(selectedOccasion)}
        <span aria-hidden="true">x</span>
      </button>
    `);
  }

  return chips.join("");
}

export function syncShopControls(root, { selectedFamily, selectedOccasion, selectedSort }) {
  const familySelect = root.querySelector("[data-shop-family]");
  const occasionSelect = root.querySelector("[data-shop-occasion]");
  const sortSelect = root.querySelector("[data-shop-sort]");

  if (familySelect) {
    familySelect.value = selectedFamily ?? ALL_FAMILIES;
  }

  if (occasionSelect) {
    occasionSelect.value = selectedOccasion ?? ALL_OCCASIONS;
  }

  if (sortSelect) {
    sortSelect.value = selectedSort ?? DEFAULT_SORT;
  }
}
