import { syncCartWithCatalog } from "./cart-store.js";
import { formatPrice } from "../utils/format.js";

const FREE_STANDARD_THRESHOLD = 2500000;
const STANDARD_SHIPPING_PRICE = 30000;
const EXPRESS_SHIPPING_PRICE = 60000;

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function getPreferredCallName(fullName) {
  const parts = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts.at(-1) ?? "bạn";
}

export function formatCurrency(value) {
  return formatPrice(value);
}

export function getShippingOptions(subtotal) {
  const standardPrice = subtotal >= FREE_STANDARD_THRESHOLD ? 0 : STANDARD_SHIPPING_PRICE;

  return [
    {
      id: "giao-tieu-chuan",
      label: "Giao tiêu chuẩn",
      description:
        standardPrice === 0
          ? "Miễn phí giao hàng toàn quốc trong 2-5 ngày làm việc."
          : "Giao hàng toàn quốc trong 2-5 ngày làm việc.",
      price: standardPrice
    },
    {
      id: "giao-nhanh",
      label: "Giao nhanh",
      description: "Ưu tiên xử lý và giao trong 1-2 ngày làm việc tại khu vực trung tâm.",
      price: EXPRESS_SHIPPING_PRICE
    }
  ];
}

export function resolveCheckoutState(summary, selectedShippingId = "giao-tieu-chuan") {
  const shippingOptions = getShippingOptions(summary.subtotal);
  const selectedShipping =
    shippingOptions.find((option) => option.id === selectedShippingId) ?? shippingOptions[0];

  return {
    ...summary,
    shippingOptions,
    selectedShippingId: selectedShipping.id,
    shippingLabel: selectedShipping.label,
    shippingDescription: selectedShipping.description,
    shippingPrice: selectedShipping.price,
    total: summary.subtotal + selectedShipping.price
  };
}

export function getCheckoutState(products, selectedShippingId = "giao-tieu-chuan", state) {
  return resolveCheckoutState(syncCartWithCatalog(products, state), selectedShippingId);
}

export function formatCardNumberInput(value) {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatExpiryInput(value) {
  const digits = digitsOnly(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function formatCvcInput(value) {
  return digitsOnly(value).slice(0, 4);
}

export function validateCardNumber(value) {
  const digits = digitsOnly(value);
  return digits.length >= 13 && digits.length <= 19;
}

export function validatePhoneNumber(value) {
  const digits = digitsOnly(value);
  return digits.length >= 9 && digits.length <= 11;
}

export function validateExpiry(value, now = new Date()) {
  const digits = digitsOnly(value);

  if (digits.length !== 4) {
    return false;
  }

  const month = Number.parseInt(digits.slice(0, 2), 10);
  const year = Number.parseInt(digits.slice(2), 10);

  if (!Number.isInteger(month) || !Number.isInteger(year) || month < 1 || month > 12) {
    return false;
  }

  const fullYear = 2000 + year;
  const expiryDate = new Date(fullYear, month, 0, 23, 59, 59, 999);

  return expiryDate.getTime() >= now.getTime();
}

export function validateCvc(value) {
  const digits = digitsOnly(value);
  return digits.length >= 3 && digits.length <= 4;
}

function syncFieldErrorAccessibility(field, announceErrors) {
  const feedbackId = field.getAttribute("data-feedback-id");

  if (!feedbackId) {
    return;
  }

  if (!announceErrors) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-errormessage");
    return;
  }

  const isInvalid = !field.checkValidity();

  if (isInvalid) {
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-errormessage", feedbackId);
    return;
  }

  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-errormessage");
}

export function syncCheckoutValidity(form, { announceErrors = form.classList.contains("was-validated") } = {}) {
  const phoneInput = form.querySelector("[data-checkout-phone]");
  const cardNumberInput = form.querySelector("[data-checkout-card-number]");
  const expiryInput = form.querySelector("[data-checkout-expiry]");
  const cvcInput = form.querySelector("[data-checkout-cvc]");
  const termsInput = form.querySelector("[data-checkout-terms]");

  if (phoneInput instanceof HTMLInputElement) {
    phoneInput.setCustomValidity(validatePhoneNumber(phoneInput.value) ? "" : "Vui lòng nhập số điện thoại hợp lệ.");
  }

  if (cardNumberInput instanceof HTMLInputElement) {
    cardNumberInput.setCustomValidity(validateCardNumber(cardNumberInput.value) ? "" : "Vui lòng nhập số thẻ hợp lệ.");
  }

  if (expiryInput instanceof HTMLInputElement) {
    expiryInput.setCustomValidity(validateExpiry(expiryInput.value) ? "" : "Vui lòng nhập ngày hết hạn còn hiệu lực.");
  }

  if (cvcInput instanceof HTMLInputElement) {
    cvcInput.setCustomValidity(validateCvc(cvcInput.value) ? "" : "Vui lòng nhập mã bảo mật hợp lệ.");
  }

  if (termsInput instanceof HTMLInputElement) {
    termsInput.setCustomValidity(termsInput.checked ? "" : "Vui lòng xác nhận thông tin trước khi đặt hàng.");
  }

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      syncFieldErrorAccessibility(field, announceErrors);
    }
  });

  return form.checkValidity();
}

export function createOrderNumber(now = new Date()) {
  const dateStamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const sequence = Math.floor(Math.random() * 9000 + 1000);

  return `SLG-${dateStamp}-${sequence}`;
}

export function createCheckoutConfirmation(form, checkoutState) {
  const formData = new FormData(form);
  const shippingOption =
    checkoutState.shippingOptions.find((option) => option.id === formData.get("shippingMethod")) ??
    checkoutState.shippingOptions[0];
  const fullName = String(formData.get("fullName") ?? "").trim();

  return {
    orderNumber: createOrderNumber(),
    customerName: fullName,
    firstName: getPreferredCallName(fullName),
    email: String(formData.get("email") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim() || "Việt Nam",
    itemCount: checkoutState.itemCount,
    subtotal: checkoutState.subtotal,
    shippingLabel: shippingOption.label,
    shippingDescription: shippingOption.description,
    shippingPrice: shippingOption.price,
    total: checkoutState.subtotal + shippingOption.price
  };
}
