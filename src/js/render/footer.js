import siteContent from "../../data/site.json";

const footerGroups = (Array.isArray(siteContent.footer?.groups) ? siteContent.footer.groups : [])
  .map((group) => ({
    ...group,
    links: Array.isArray(group.links) ? group.links : []
  }))
  .filter((group) => group.links.length > 0);

const footerBrandCopy =
  siteContent.footer?.brandCopy ??
  "Nhà hương hiện đại xây quanh cấu trúc rõ ràng, chất liệu tinh gọn và khả năng dùng lặp lại mỗi ngày.";
const footerNote = siteContent.brand?.responseWindow ?? "Phản hồi trong vòng một ngày làm việc.";
const footerSupportEmail = siteContent.brand?.supportEmail ?? "";
const footerAddressSource =
  (Array.isArray(siteContent.brand?.studioAddress) && siteContent.brand.studioAddress) ||
  (Array.isArray(siteContent.brand?.showroomAddress) && siteContent.brand.showroomAddress);
const footerAddress = footerAddressSource ?? [
  "Học viện Công nghệ Bưu chính Viễn thông",
  "Km 10 Nguyễn Trãi, P. Mộ Lao, Q. Hà Đông",
  "Hà Nội"
];
const footerAddressLine = footerAddress.join(", ");
const footerMapMeta = siteContent.footer?.map ?? {};
const footerMapLabel =
  typeof footerMapMeta.label === "string" && footerMapMeta.label.trim() ? footerMapMeta.label.trim() : "Bản đồ";
const footerMapAddress =
  typeof footerMapMeta.shortAddress === "string" && footerMapMeta.shortAddress.trim()
    ? footerMapMeta.shortAddress.trim()
    : footerAddress.slice(-2).join(", ");
const footerMapCta =
  typeof footerMapMeta.cta === "string" && footerMapMeta.cta.trim()
    ? footerMapMeta.cta.trim()
    : "Mở Google Maps";
const footerNewsletter = siteContent.footer?.newsletter ?? {
  title: "Nhận ghi chú mùi hương",
  copy: "Gợi ý chọn mùi, cách thử trên da và cập nhật từ nhà hương."
};
const footerMapLink =
  siteContent.contactMethods?.find(
    (method) => typeof method?.href === "string" && method.href.includes("maps.google")
  )?.href ?? "https://maps.google.com/?q=20.980913,105.7874165";
const footerNewsletterTitle =
  typeof footerNewsletter.title === "string" && footerNewsletter.title.trim()
    ? footerNewsletter.title.trim()
    : "Nhận ghi chú mùi hương";
const footerNewsletterCopy =
  typeof footerNewsletter.copy === "string" && footerNewsletter.copy.trim() ? footerNewsletter.copy.trim() : "";
const footerUtilityLinks = Array.isArray(siteContent.footer?.utilityLinks)
  ? siteContent.footer.utilityLinks
      .filter((entry) => typeof entry?.href === "string" && typeof entry?.label === "string")
      .slice(0, 3)
  : [];
const footerSocialLinks = Array.isArray(siteContent.footer?.socialLinks)
  ? siteContent.footer.socialLinks
  : [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" }
    ];

function renderExternalIcon(className = "") {
  return `
    <svg class="${className}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 4h7v7" />
      <path d="M4.2 11.8 12 4" />
    </svg>
  `;
}

function renderSocialIcon(label) {
  if (label === "Instagram") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
        <circle cx="12" cy="12" r="4.1"></circle>
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 8.2h2.3V4.5h-2.7c-3 0-4.9 2-4.9 5.2v2H6.9v3.8h2.3v4.9h4v-4.9h2.7l.5-3.8h-3.2V10c0-1 .4-1.8 1.3-1.8Z" fill="currentColor"></path>
    </svg>
  `;
}

function renderSocialLinks() {
  return footerSocialLinks
    .map(
      ({ href, label }) => `
        <a class="sl-footer-social" href="${href}" target="_blank" rel="noreferrer">
          <span class="sl-footer-social__icon">${renderSocialIcon(label)}</span>
          <span>${label}</span>
          ${renderExternalIcon("sl-footer-social__external")}
        </a>
      `
    )
    .join("");
}

function isSupportGroup({ title, links }) {
  const normalizedTitle = String(title ?? "")
    .trim()
    .toLowerCase();

  if (normalizedTitle === "hỗ trợ" || normalizedTitle === "ho tro") {
    return true;
  }

  const keys = Array.isArray(links)
    ? links.map((entry) => String(entry?.key ?? "").trim().toLowerCase())
    : [];

  return keys.includes("contact") || keys.includes("checkout");
}

function renderFooterMapLink() {
  return `
    <section class="sl-footer-map-link" aria-label="Bản đồ showroom">
      <p class="sl-footer-title">${footerMapLabel}</p>
      <p class="sl-footer-map-link__address">${footerMapAddress}</p>
      <a class="sl-footer-link sl-footer-map-link__cta" href="${footerMapLink}" target="_blank" rel="noreferrer">
        <span>${footerMapCta}</span>
        ${renderExternalIcon("sl-footer-map-link__icon")}
      </a>
    </section>
  `;
}

function renderFooterUtilityLinks() {
  if (!footerUtilityLinks.length) {
    return "";
  }

  return `
    <ul class="sl-footer-meta-links" aria-label="Liên kết tiện ích">
      ${footerUtilityLinks
        .map(
          ({ href, label }) => `
            <li>
              <a class="sl-footer-link" href="${href}">${label}</a>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

export function renderFooter({ currentPage }) {
  return `
    <footer class="sl-site-footer">
      <div class="container">
        <div class="sl-footer-top">
          <div class="sl-footer-brand">
            <section class="sl-footer-brand__statement sl-stack sl-stack--tight">
              <p class="sl-label">Sillage</p>
              <p>${footerBrandCopy}</p>
            </section>

            <section class="sl-footer-brand__credibility sl-stack sl-stack--tight">
              <div class="sl-footer-address">
                <p class="sl-label sl-muted">Showroom</p>
                <address>
                  <span>${footerAddressLine}</span>
                </address>
              </div>
              <p class="sl-footer-note">${footerNote}</p>
            </section>

            <section class="sl-footer-brand__connect sl-stack sl-stack--tight">
              ${footerSupportEmail ? `<a class="sl-footer-link" href="mailto:${footerSupportEmail}">${footerSupportEmail}</a>` : ""}
              <div class="sl-footer-socials" aria-label="Kênh xã hội">
                ${renderSocialLinks()}
              </div>
            </section>
          </div>

          <div class="sl-footer-nav-grid">
            ${footerGroups
              .map(({ title, links }) => {
                const supportGroup = isSupportGroup({ title, links });

                return `
                  <div class="sl-footer-column${supportGroup ? " sl-footer-column--support" : ""}">
                    <h2 class="sl-footer-title">${title}</h2>
                    <ul class="sl-footer-list">
                      ${links
                        .map(({ href, label, key }) => {
                          const isActive = key === currentPage;

                          return `
                            <li>
                              <a
                                class="sl-footer-link${isActive ? " is-active" : ""}"
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
                    ${supportGroup ? `<div class="sl-footer-column__map">${renderFooterMapLink()}</div>` : ""}
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>

        <section class="sl-footer-newsletter sl-footer-newsletter--bar" aria-label="Bản tin">
          <div class="sl-footer-newsletter__intro sl-stack sl-stack--tight">
            <div class="sl-stack sl-stack--tight">
              <p class="sl-footer-title">Bản tin</p>
              <h2 class="sl-footer-newsletter__title">${footerNewsletterTitle}</h2>
              ${footerNewsletterCopy ? `<p>${footerNewsletterCopy}</p>` : ""}
            </div>
          </div>

          <form class="sl-footer-newsletter__form" data-newsletter-form novalidate>
            <label class="visually-hidden" for="footer-newsletter-email">Email nhận bản tin</label>
            <div class="sl-footer-newsletter__controls">
              <input
                class="form-control"
                id="footer-newsletter-email"
                name="email"
                type="email"
                placeholder="Email của bạn"
                autocomplete="email"
                required
                data-newsletter-email
              />
              <button class="btn btn-primary" type="submit" data-newsletter-submit>
                Đăng ký
              </button>
            </div>
            <p class="sl-footer-newsletter__status" data-newsletter-status aria-live="polite"></p>
          </form>
        </section>

        <div class="sl-footer-meta">
          <p>Nhà hương Sillage. <span data-current-year></span></p>
          ${renderFooterUtilityLinks()}
        </div>
      </div>
    </footer>
  `;
}
