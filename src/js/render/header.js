const primaryNav = [
  { href: "cua-hang.html", label: "Cửa hàng", key: "shop" },
  { href: "bo-kham-pha.html", label: "Bộ Khám Phá", key: "discovery" },
  { href: "cau-hoi-thuong-gap.html", label: "Liên hệ tổng", key: "faq" }
];

function resolveNavPage(currentPage) {
  if (currentPage === "product") {
    return "shop";
  }

  return currentPage;
}

function formatBadgeAriaLabel(count) {
  return `${count} sản phẩm trong giỏ hàng`;
}

export function renderHeader({ currentPage, initialCartCount = 0 }) {
  const navPage = resolveNavPage(currentPage);
  const isCartContext = currentPage === "cart" || currentPage === "checkout";
  const isCartPage = currentPage === "cart";

  return `
    <header class="sl-site-header">
      <nav class="navbar navbar-expand-lg sl-navbar">
        <div class="container">
          <a class="navbar-brand sl-wordmark" href="index.html">Sillage</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sl-primary-nav"
            aria-controls="sl-primary-nav"
            aria-expanded="false"
            aria-label="Mở menu điều hướng"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse sl-nav-panel" id="sl-primary-nav">
            <ul class="navbar-nav ms-auto mb-0 sl-nav-list">
              ${primaryNav
                .map(({ href, label, key }) => {
                  const isActive = key === navPage;

                  return `
                    <li class="nav-item">
                      <a
                        class="nav-link sl-nav-link${isActive ? " is-active" : ""}"
                        href="${href}"
                        ${isActive ? 'aria-current="page"' : ""}
                      >
                        ${label}
                      </a>
                    </li>
                  `;
                })
                .join("")}
            </ul>
            <a class="sl-cart-link ms-lg-4${isCartContext ? " is-active" : ""}" href="gio-hang.html" ${isCartPage ? 'aria-current="page"' : ""}>
              <span class="sl-cart-link__label">Giỏ hàng</span>
              <span class="sl-cart-count" aria-label="${formatBadgeAriaLabel(initialCartCount)}">${initialCartCount}</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export { formatBadgeAriaLabel };
