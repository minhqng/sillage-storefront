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
const footerNewsletter = siteContent.footer?.newsletter ?? {
  title: "Nhận ghi chú mùi hương",
  copy: ""
};
const footerNewsletterTitle =
  typeof footerNewsletter.title === "string" && footerNewsletter.title.trim()
    ? footerNewsletter.title.trim()
    : "Nhận ghi chú mùi hương";
const footerNewsletterCopy =
  typeof footerNewsletter.copy === "string" && footerNewsletter.copy.trim() ? footerNewsletter.copy.trim() : "";
const footerSocialLinks = Array.isArray(siteContent.footer?.socialLinks)
  ? siteContent.footer.socialLinks
  : [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" }
    ];

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
        </a>
      `
    )
    .join("");
}

function renderFooterMap() {
  return `
    <section class="sl-footer-map" aria-label="Bản đồ vị trí">
      <div class="sl-footer-map__head">
        <p class="sl-footer-title">Bản đồ</p>
        <h2 class="sl-footer-map__title">Xem vị trí trên Google Maps</h2>
      </div>
      <div class="sl-footer-map__frame-wrap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2924008216164!2d105.78741649999999!3d20.980913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1774880777131!5m2!1svi!2s"
          width="600"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  `;
}

export function renderFooter({ currentPage }) {
  return `
    <footer class="sl-site-footer">
      <div class="container">
        <div class="sl-footer-top">
          <div class="sl-footer-brand">
            <div class="sl-stack sl-stack--tight">
              <p class="sl-label">Sillage</p>
              <p>${footerBrandCopy}</p>
            </div>
            <div class="sl-footer-address">
              <p class="sl-label sl-muted">Showroom</p>
              <address>
                <span>${footerAddressLine}</span>
              </address>
            </div>
            <p class="sl-footer-note">${footerNote}</p>
            ${footerSupportEmail ? `<a class="sl-footer-link" href="mailto:${footerSupportEmail}">${footerSupportEmail}</a>` : ""}
            <div class="sl-footer-socials" aria-label="Kênh xã hội">
              ${renderSocialLinks()}
            </div>
          </div>

          <div class="sl-footer-nav-grid">
            ${footerGroups
              .map(
                ({ title, links }) => `
                  <div class="sl-footer-column">
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
                  </div>
                `
              )
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
                placeholder="minhnq@gdscptit.dev"
                autocomplete="email"
                required
                data-newsletter-email
              />
              <button class="btn btn-primary" type="submit">Đăng ký</button>
            </div>
            <p class="sl-footer-newsletter__status" data-newsletter-status aria-live="polite"></p>
          </form>
        </section>

        <div class="sl-footer-meta">
          <p>Nhà hương Sillage. <span data-current-year></span></p>
        </div>

        ${renderFooterMap()}
      </div>
    </footer>
  `;
}
