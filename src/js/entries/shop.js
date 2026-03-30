import { addCartItem } from "../core/cart-store.js";
import { getProducts } from "../core/data-store.js";
import {
  ALL_FAMILIES,
  ALL_OCCASIONS,
  applyFamilyFilter,
  applyOccasionFilter,
  getSelectedFamily,
  getSelectedOccasion,
  updateFamilyInQuery,
  updateOccasionInQuery
} from "../core/filter-state.js";
import { getFamilyOptions, getListingProducts, getOccasionOptions } from "../core/product-service.js";
import { DEFAULT_SORT, SORT_OPTIONS, getSelectedSort, sortProducts, updateSortInQuery } from "../core/sort-state.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderProductGrid } from "../render/product-grid.js";
import {
  renderActiveState,
  renderNoResultsState,
  renderShopSummary,
  renderShopView,
  syncShopControls
} from "../render/shop-view.js";

function renderFetchError() {
  return `
    <div class="sl-empty-state">
      <div class="sl-empty-state__content sl-stack">
        <p class="sl-label sl-muted">Bộ sưu tập tạm thời không khả dụng</p>
        <h2>Không thể mở cửa hàng ở thời điểm này.</h2>
        <p class="sl-section-summary">
          Vui lòng thử lại sau ít phút, hoặc bắt đầu với Bộ Khám Phá để xem toàn bộ thư viện mùi hương theo cách chậm rãi hơn.
        </p>
        <div class="sl-link-row">
          <a class="btn btn-primary" href="cua-hang.html">Thử lại</a>
          <a class="btn btn-quiet" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
        </div>
      </div>
    </div>
  `;
}

function deriveShopState(products) {
  const familyOptions = getFamilyOptions(products);
  const occasionOptions = getOccasionOptions(products);
  const availableFamilies = familyOptions.map((option) => option.value);
  const availableOccasions = occasionOptions.map((option) => option.value);

  return {
    familyOptions,
    occasionOptions,
    selectedFamily: getSelectedFamily(availableFamilies),
    selectedOccasion: getSelectedOccasion(availableOccasions),
    selectedSort: getSelectedSort()
  };
}

function applyShopState(products, { selectedFamily, selectedOccasion, selectedSort }) {
  const familyFilteredProducts = applyFamilyFilter(products, selectedFamily);
  const filteredProducts = applyOccasionFilter(familyFilteredProducts, selectedOccasion);

  return sortProducts(filteredProducts, selectedSort);
}

function showQuickAddToast(root, message) {
  const toastNode = root.querySelector("[data-shop-toast]");

  if (!(toastNode instanceof HTMLElement)) {
    return;
  }

  if (toastNode.dataset.showTimeoutId) {
    window.clearTimeout(Number(toastNode.dataset.showTimeoutId));
  }

  if (toastNode.dataset.hideTimeoutId) {
    window.clearTimeout(Number(toastNode.dataset.hideTimeoutId));
  }

  toastNode.textContent = message;
  toastNode.hidden = false;
  toastNode.classList.add("is-visible");

  const showTimeoutId = window.setTimeout(() => {
    toastNode.classList.remove("is-visible");

    const hideTimeoutId = window.setTimeout(() => {
      toastNode.hidden = true;
      delete toastNode.dataset.showTimeoutId;
      delete toastNode.dataset.hideTimeoutId;
    }, 220);

    toastNode.dataset.hideTimeoutId = String(hideTimeoutId);
  }, 1800);

  toastNode.dataset.showTimeoutId = String(showTimeoutId);
}

function pulseQuickAddButton(button) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  if (button.dataset.pulseTimeoutId) {
    window.clearTimeout(Number(button.dataset.pulseTimeoutId));
  }

  button.classList.add("is-added");

  const pulseTimeoutId = window.setTimeout(() => {
    button.classList.remove("is-added");
    delete button.dataset.pulseTimeoutId;
  }, 1400);

  button.dataset.pulseTimeoutId = String(pulseTimeoutId);
}

function mountShopResults(root, products, state) {
  const summaryNode = root.querySelector("[data-shop-summary]");
  const activeStateNode = root.querySelector("[data-shop-active-state]");
  const resultsNode = root.querySelector("[data-shop-results]");

  const nextProducts = applyShopState(products, state);

  if (summaryNode) {
    summaryNode.innerHTML = renderShopSummary({
      count: nextProducts.length,
      selectedFamily: state.selectedFamily,
      selectedOccasion: state.selectedOccasion,
      selectedSort: state.selectedSort,
      sortOptions: SORT_OPTIONS
    });
  }

  if (activeStateNode) {
    activeStateNode.innerHTML = renderActiveState({
      selectedFamily: state.selectedFamily,
      selectedOccasion: state.selectedOccasion
    });
  }

  if (resultsNode) {
    resultsNode.innerHTML = nextProducts.length > 0 ? renderProductGrid(nextProducts) : renderNoResultsState();
  }
}

async function initShopPage() {
  mountPageShell({
    currentPage: "shop",
    eyebrow: "Cửa hàng",
    title: "Toàn bộ mùi hương được sắp theo cấu trúc, chất liệu và dịp dùng.",
    summary:
      "Duyệt toàn bộ bộ sưu tập Sillage, rồi thu hẹp theo nhóm hương hoặc dịp sử dụng khi bạn đã cảm thấy gần với một hướng mùi nhất định.",
    pageIntroNote:
      "Bắt đầu với toàn bộ bộ sưu tập, sau đó lọc dần theo nhóm hương và dịp dùng để giữ quyết định rõ và gọn.",
    content: renderShopView({
      familyOptions: [],
      occasionOptions: [],
      sortOptions: SORT_OPTIONS
    })
  });

  const root = document.querySelector("[data-shop-root]");

  if (!root) {
    throw new Error("Missing shop root mount.");
  }

  try {
    const products = getListingProducts(await getProducts());
    const state = deriveShopState(products);

    root.outerHTML = renderShopView({
      familyOptions: state.familyOptions,
      occasionOptions: state.occasionOptions,
      sortOptions: SORT_OPTIONS
    });

    const hydratedRoot = document.querySelector("[data-shop-root]");

    if (!hydratedRoot) {
      throw new Error("Missing hydrated shop root.");
    }

    syncShopControls(hydratedRoot, state);
    mountShopResults(hydratedRoot, products, state);

    hydratedRoot.addEventListener("change", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLSelectElement)) {
        return;
      }

      if (target.matches("[data-shop-family]")) {
        state.selectedFamily = target.value || ALL_FAMILIES;
        updateFamilyInQuery(state.selectedFamily);
      }

      if (target.matches("[data-shop-occasion]")) {
        state.selectedOccasion = target.value || ALL_OCCASIONS;
        updateOccasionInQuery(state.selectedOccasion);
      }

      if (target.matches("[data-shop-sort]")) {
        state.selectedSort = target.value || DEFAULT_SORT;
        updateSortInQuery(state.selectedSort);
      }

      syncShopControls(hydratedRoot, state);
      mountShopResults(hydratedRoot, products, state);
    });

    hydratedRoot.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const quickAddTrigger = target.closest("[data-quick-add]");

      if (quickAddTrigger instanceof HTMLButtonElement) {
        const { productId, productName, sizeId, sizeLabel, sizePrice } = quickAddTrigger.dataset;
        const unitPrice = Number.parseFloat(sizePrice ?? "");

        if (!productId || !sizeId || !Number.isFinite(unitPrice)) {
          return;
        }

        addCartItem({
          productId,
          sizeId,
          quantity: 1,
          unitPrice
        });

        pulseQuickAddButton(quickAddTrigger);
        showQuickAddToast(
          hydratedRoot,
          `Đã thêm ${productName ?? "sản phẩm"}${sizeLabel ? ` (${sizeLabel})` : ""} vào giỏ hàng.`
        );
        return;
      }

      const resetTrigger = target.closest("[data-reset-filters]");
      const clearAllTrigger = target.closest("[data-clear-all-filters]");

      if (resetTrigger || clearAllTrigger) {
        state.selectedFamily = ALL_FAMILIES;
        state.selectedOccasion = ALL_OCCASIONS;
        updateFamilyInQuery(state.selectedFamily);
        updateOccasionInQuery(state.selectedOccasion);
        syncShopControls(hydratedRoot, state);
        mountShopResults(hydratedRoot, products, state);
        return;
      }

      const clearTrigger = target.closest("[data-clear-filter]");

      if (!clearTrigger) {
        return;
      }

      const filterName = clearTrigger.getAttribute("data-clear-filter");

      if (filterName === "family") {
        state.selectedFamily = ALL_FAMILIES;
        updateFamilyInQuery(state.selectedFamily);
      }

      if (filterName === "occasion") {
        state.selectedOccasion = ALL_OCCASIONS;
        updateOccasionInQuery(state.selectedOccasion);
      }

      syncShopControls(hydratedRoot, state);
      mountShopResults(hydratedRoot, products, state);
    });
  } catch (error) {
    const failureRoot = document.querySelector("[data-shop-root]") ?? root;
    failureRoot.innerHTML = renderFetchError();

    console.error(error);
  }
}

initShopPage();
