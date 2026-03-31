import { Collapse } from "bootstrap";
import siteContent from "../../data/site.json";
import { getCartCount, subscribeToCartUpdates } from "./cart-store.js";
import { renderFooter } from "../render/footer.js";
import { formatBadgeAriaLabel, renderHeader } from "../render/header.js";
import { renderPageIntro } from "../render/page-intro.js";

const NEWSLETTER_STORAGE_KEY = "sillage-newsletter-email";
const ZALO_CHAT_URL = siteContent.brand?.zaloUrl ?? "https://zalo.me/84904112882";
const ZALO_CONTACT_NAME = siteContent.brand?.supportName ?? "NGUYEN QUANG MINH";
const ZALO_AVATAR_LABEL = "NQ";

function renderZaloWidget() {
  return `
    <div class="sl-zalo-widget" data-zalo-widget>
      <section class="sl-zalo-widget__panel" id="sl-zalo-panel" data-zalo-panel hidden>
        <header class="sl-zalo-widget__panel-head">
          <div class="sl-zalo-widget__avatar" aria-hidden="true">${ZALO_AVATAR_LABEL}</div>
          <div class="sl-zalo-widget__meta">
            <p class="sl-zalo-widget__name">${ZALO_CONTACT_NAME}</p>
            <p class="sl-zalo-widget__status">Đang trực tuyến · Phản hồi trong vài phút</p>
          </div>
          <button class="sl-zalo-widget__close" type="button" aria-label="Đóng hộp chat" data-zalo-close>
            ×
          </button>
        </header>

        <div class="sl-zalo-widget__chat" role="log" aria-live="polite">
          <p class="sl-zalo-widget__bubble is-incoming">
            Chào bạn, mình là ${ZALO_CONTACT_NAME}. Mình đang online để hỗ trợ bạn chọn mùi hương phù hợp ngay bây giờ.
          </p>
          <p class="sl-zalo-widget__time">Vừa xong</p>
          <p class="sl-zalo-widget__bubble is-incoming">
            Bạn có thể nhắn trực tiếp qua Zalo, mình sẽ phản hồi ngay khi nhận được tin.
          </p>
        </div>

        <a class="btn btn-primary sl-zalo-widget__cta" href="${ZALO_CHAT_URL}" target="_blank" rel="noreferrer">
          Nhắn trực tiếp qua Zalo
        </a>
      </section>

      <button
        class="sl-zalo-widget__fab"
        type="button"
        aria-controls="sl-zalo-panel"
        aria-expanded="false"
        data-zalo-toggle
      >
        <span class="sl-zalo-widget__icon" aria-hidden="true">Zalo</span>
        <span class="visually-hidden">Mở chat Zalo trực tiếp</span>
      </button>
    </div>
  `;
}

function getStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function bindMobileNav(root) {
  const navPanel = root.querySelector("#sl-primary-nav");
  const toggler = root.querySelector("[data-bs-target='#sl-primary-nav']");

  if (!navPanel || !toggler) {
    return;
  }

  const collapse = Collapse.getOrCreateInstance(navPanel, { toggle: false });
  const isMobileViewport = () => window.innerWidth < 992;
  const isNavOpen = () => navPanel.classList.contains("show");

  const closeMobileNav = ({ restoreFocus = false } = {}) => {
    if (isMobileViewport() && isNavOpen()) {
      collapse.hide();

      if (restoreFocus) {
        toggler.focus();
      }
    }
  };

  const resetDesktopState = () => {
    if (window.innerWidth >= 992) {
      collapse.hide();
      navPanel.style.height = "";
      toggler.setAttribute("aria-expanded", "false");
    }
  };

  const handleDocumentClick = (event) => {
    if (!isMobileViewport() || !isNavOpen()) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (navPanel.contains(target) || toggler.contains(target)) {
      return;
    }

    closeMobileNav();
  };

  const handleEscape = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeMobileNav({ restoreFocus: true });
  };

  navPanel.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleEscape);
  window.addEventListener("resize", resetDesktopState);
}

function bindCartBadge(root) {
  const badge = root.querySelector(".sl-cart-count");

  if (!badge) {
    return;
  }

  const syncBadge = (state) => {
    const count = getCartCount(state);
    badge.textContent = String(count);
    badge.setAttribute("aria-label", formatBadgeAriaLabel(count));
  };

  syncBadge();
  subscribeToCartUpdates((state) => {
    syncBadge(state);
  });
}

function bindNewsletterForm(root) {
  const form = root.querySelector("[data-newsletter-form]");
  const input = root.querySelector("[data-newsletter-email]");
  const status = root.querySelector("[data-newsletter-status]");
  const submitButton = root.querySelector("[data-newsletter-submit]");
  const storage = getStorage();

  if (
    !(form instanceof HTMLFormElement) ||
    !(input instanceof HTMLInputElement) ||
    !(status instanceof HTMLElement) ||
    !(submitButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const defaultSubmitLabel = submitButton.textContent?.trim() || "Đăng ký";
  let submitTimer = null;

  const setStatus = (message, tone = "") => {
    status.textContent = message;
    status.classList.remove("is-error", "is-success", "is-loading");

    if (tone) {
      status.classList.add(tone);
    }
  };

  const setLoadingState = (isLoading) => {
    form.classList.toggle("is-loading", isLoading);
    submitButton.disabled = isLoading;
    submitButton.setAttribute("aria-busy", String(isLoading));
    submitButton.textContent = isLoading ? "Đang lưu..." : defaultSubmitLabel;
  };

  input.addEventListener("input", () => {
    if (status.classList.contains("is-error")) {
      setStatus("");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!input.checkValidity()) {
      setStatus("Vui lòng nhập địa chỉ email hợp lệ.", "is-error");
      input.reportValidity();
      return;
    }

    if (submitTimer) {
      window.clearTimeout(submitTimer);
    }

    const trimmedEmail = input.value.trim();

    setLoadingState(true);
    setStatus("Đang lưu email của bạn cho bản tin mùi hương.", "is-loading");

    submitTimer = window.setTimeout(() => {
      if (storage) {
        try {
          storage.setItem(NEWSLETTER_STORAGE_KEY, trimmedEmail);
        } catch {
          // Continue gracefully even if localStorage is unavailable.
        }
      }

      setLoadingState(false);
      setStatus("Đăng ký thành công. Bạn sẽ nhận ghi chú mùi hương và cập nhật mới nhất.", "is-success");
      submitTimer = null;
    }, 420);
  });
}

function bindZaloWidget(root) {
  const widget = root.querySelector("[data-zalo-widget]");
  const panel = root.querySelector("[data-zalo-panel]");
  const toggle = root.querySelector("[data-zalo-toggle]");
  const close = root.querySelector("[data-zalo-close]");

  if (!(widget instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) {
    return;
  }

  const setOpenState = (isOpen) => {
    widget.classList.toggle("is-open", isOpen);
    panel.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      close?.focus();
    }
  };

  const handleOutsideClick = (event) => {
    if (!widget.classList.contains("is-open")) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node) || widget.contains(target)) {
      return;
    }

    setOpenState(false);
  };

  toggle.addEventListener("click", () => {
    setOpenState(!widget.classList.contains("is-open"));
  });

  close?.addEventListener("click", () => {
    setOpenState(false);
    toggle.focus();
  });

  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("is-open")) {
      setOpenState(false);
      toggle.focus();
    }
  });
}

export function mountAppShell({
  currentPage,
  eyebrow,
  title,
  summary,
  pageIntroNote,
  content = "",
  includePageIntro = true
}) {
  const root = document.querySelector("[data-page-root]");

  if (!root) {
    throw new Error("Missing [data-page-root] mount element.");
  }

  document.body.dataset.page = currentPage;

  root.innerHTML = `
    <div class="sl-page-shell sl-shell">
      <a class="sl-skip-link" href="#sl-main-content">Chuyển đến nội dung</a>
      ${renderHeader({ currentPage, initialCartCount: getCartCount() })}
      <main class="sl-page-main" id="sl-main-content">
        ${includePageIntro ? renderPageIntro({ eyebrow, title, summary, note: pageIntroNote }) : ""}
        ${content}
      </main>
      ${renderFooter({ currentPage })}
      ${renderZaloWidget()}
    </div>
  `;

  const yearNode = root.querySelector("[data-current-year]");

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear().toString();
  }

  bindMobileNav(root);
  bindCartBadge(root);
  bindNewsletterForm(root);
  bindZaloWidget(root);
}
