import { clearCart } from "../core/cart-store.js";
import {
  createCheckoutConfirmation,
  formatCardNumberInput,
  formatCurrency,
  formatCvcInput,
  formatExpiryInput,
  getCheckoutState,
  resolveCheckoutState,
  syncCheckoutValidity
} from "../core/checkout-service.js";
import { getProducts } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import {
  renderCheckoutErrorState,
  renderCheckoutLoadingState,
  hydrateCheckoutSuccessState,
  renderCheckoutSuccessState,
  renderCheckoutView,
  renderEmptyCheckoutState
} from "../render/checkout-view.js";

let productsCatalog = [];
let currentCheckoutState = null;
let submissionInFlight = false;
let confirmationVisible = false;

const emptyCheckoutNotices = {
  removedStaleCount: 0,
  updatedPriceCount: 0
};
let checkoutNoticeState = {
  key: "",
  ...emptyCheckoutNotices
};

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function getContentMount() {
  return document.querySelector("[data-checkout-content]");
}

function renderContent(markup) {
  const mount = getContentMount();

  if (!mount) {
    throw new Error("Missing checkout content mount.");
  }

  mount.innerHTML = markup;
}

function getCheckoutNotices(checkoutState) {
  const noticeKey = checkoutState.state?.updatedAt ?? "";

  if (checkoutState.removedStaleCount || checkoutState.updatedPriceCount) {
    checkoutNoticeState = {
      key: noticeKey,
      removedStaleCount: checkoutState.removedStaleCount || 0,
      updatedPriceCount: checkoutState.updatedPriceCount || 0
    };

    return {
      removedStaleCount: checkoutNoticeState.removedStaleCount,
      updatedPriceCount: checkoutNoticeState.updatedPriceCount
    };
  }

  if (checkoutNoticeState.key !== noticeKey) {
    checkoutNoticeState = {
      key: noticeKey,
      ...emptyCheckoutNotices
    };
  }

  return {
    removedStaleCount: checkoutNoticeState.removedStaleCount,
    updatedPriceCount: checkoutNoticeState.updatedPriceCount
  };
}

function getCheckoutForm() {
  return document.querySelector("[data-checkout-form]");
}

function syncShippingSelection(root) {
  root.querySelectorAll(".sl-checkout-method").forEach((methodCard) => {
    const input = methodCard.querySelector("input[name='shippingMethod']");
    methodCard.classList.toggle("is-active", Boolean(input?.checked));
  });
}

function syncSummaryUI(root) {
  if (!currentCheckoutState || currentCheckoutState.isEmpty) {
    return;
  }

  const selectedShippingInput = root.querySelector("input[name='shippingMethod']:checked");
  const selectedShippingId = selectedShippingInput?.value ?? currentCheckoutState.selectedShippingId;

  currentCheckoutState = resolveCheckoutState(currentCheckoutState, selectedShippingId);

  const shippingLabelNode = root.querySelector("[data-checkout-shipping-label]");
  const shippingPriceNode = root.querySelector("[data-checkout-shipping-price]");
  const shippingNoteNode = root.querySelector("[data-checkout-shipping-note]");
  const totalNode = root.querySelector("[data-checkout-total]");
  const submitButton = root.querySelector("[data-submit-order]");

  if (shippingLabelNode) {
    shippingLabelNode.textContent = currentCheckoutState.shippingLabel;
  }

  if (shippingPriceNode) {
    shippingPriceNode.textContent =
      currentCheckoutState.shippingPrice === 0 ? "Miễn phí" : formatCurrency(currentCheckoutState.shippingPrice);
  }

  if (shippingNoteNode) {
    shippingNoteNode.textContent = currentCheckoutState.shippingDescription;
  }

  if (totalNode) {
    totalNode.textContent = formatCurrency(currentCheckoutState.total);
  }

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = currentCheckoutState.isEmpty || submissionInFlight;
    submitButton.textContent = submissionInFlight ? "Đang xử lý đơn..." : "Đặt hàng";
  }
}

function focusFirstInvalidField(form) {
  const invalidField = form.querySelector(":invalid");

  if (invalidField instanceof HTMLElement) {
    invalidField.focus();
  }
}

function renderCheckoutPage(state) {
  if (!productsCatalog.length || confirmationVisible) {
    return;
  }

  const existingForm = document.querySelector("[data-checkout-form]");

  if (existingForm && (existingForm.classList.contains("was-validated") || existingForm.querySelector(":focus"))) {
    return;
  }

  const selectedShippingId = currentCheckoutState?.selectedShippingId ?? "giao-tieu-chuan";
  const nextCheckoutState = getCheckoutState(productsCatalog, selectedShippingId, state);
  const notices = getCheckoutNotices(nextCheckoutState);
  currentCheckoutState = nextCheckoutState;

  if (currentCheckoutState.isEmpty) {
    renderContent(renderEmptyCheckoutState(notices));
    return;
  }

  renderContent(renderCheckoutView(currentCheckoutState, notices));

  const mount = getContentMount();

  if (mount instanceof HTMLElement) {
    syncShippingSelection(mount);
    syncSummaryUI(mount);
  }
}

function bindCheckoutPage() {
  const mount = getContentMount();

  if (!mount) {
    return;
  }

  mount.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    if (event.target.hasAttribute("data-checkout-card-number")) {
      event.target.value = formatCardNumberInput(event.target.value);
    }

    if (event.target.hasAttribute("data-checkout-expiry")) {
      event.target.value = formatExpiryInput(event.target.value);
    }

    if (event.target.hasAttribute("data-checkout-cvc")) {
      event.target.value = formatCvcInput(event.target.value);
    }

    const form = getCheckoutForm();

    if (form && form.classList.contains("was-validated")) {
      syncCheckoutValidity(form, { announceErrors: true });
    }
  });

  mount.addEventListener("change", (event) => {
    const root = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;

    if (!root) {
      return;
    }

    if (event.target instanceof HTMLInputElement && event.target.name === "shippingMethod") {
      syncShippingSelection(root);
      syncSummaryUI(root);
      return;
    }

    const form = getCheckoutForm();

    if (form && form.classList.contains("was-validated")) {
      syncCheckoutValidity(form, { announceErrors: true });
    }
  });

  mount.addEventListener("submit", async (event) => {
    if (!(event.target instanceof HTMLFormElement) || !event.target.matches("[data-checkout-form]")) {
      return;
    }

    event.preventDefault();

    if (!currentCheckoutState || currentCheckoutState.isEmpty || submissionInFlight) {
      return;
    }

    const form = event.target;
    syncCheckoutValidity(form, { announceErrors: true });
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      focusFirstInvalidField(form);
      return;
    }

    submissionInFlight = true;
    syncSummaryUI(mount);

    const confirmation = createCheckoutConfirmation(form, currentCheckoutState);

    await wait(320);

    confirmationVisible = true;
    clearCart();
    submissionInFlight = false;
    renderContent(renderCheckoutSuccessState());

    const contentMount = getContentMount();

    if (contentMount instanceof HTMLElement) {
      hydrateCheckoutSuccessState(contentMount, confirmation);
    }

    document.title = "Đơn hàng đã xác nhận | Sillage";
  });
}

async function initCheckoutPage() {
  mountPageShell({
    currentPage: "checkout",
    eyebrow: "Thanh toán",
    title: "Hoàn tất đơn hàng với thông tin giao hàng và thanh toán.",
    summary:
      "Xem lại đơn, chọn phương thức giao và xác nhận chi tiết mua hàng trong bước cuối cùng.",
    content: `<div data-checkout-content>${renderCheckoutLoadingState()}</div>`
  });

  bindCheckoutPage();

  try {
    productsCatalog = await getProducts();
    document.title = "Thanh toán | Sillage";
    renderCheckoutPage();
  } catch (error) {
    document.title = "Thanh toán không khả dụng | Sillage";
    renderContent(renderCheckoutErrorState());
    console.error(error);
  }
}

initCheckoutPage();
