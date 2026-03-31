function renderFaqItem(item) {
  return `
    <details class="sl-faq-item">
      <summary>${item.question}</summary>
      <div class="sl-faq-item__body">
        <p class="sl-card-copy">${item.answer}</p>
      </div>
    </details>
  `;
}

function renderFaqGroup(group) {
  return `
    <section class="sl-faq-group" id="${group.id}">
      <div class="sl-section-head">
        <p class="sl-label sl-muted">${group.eyebrow}</p>
        <h2>${group.title}</h2>
      </div>
      <div class="sl-faq-group__items">
        ${group.items.map((item) => renderFaqItem(item)).join("")}
      </div>
    </section>
  `;
}

export function renderFaqView({ faqGroups, showContactCta = true }) {

  return `
    <section class="sl-section sl-faq">
      <div class="container sl-stack sl-stack--loose">
        ${faqGroups.map((group) => renderFaqGroup(group)).join("")}

        <section class="sl-faq-map">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Bản đồ</p>
            <h2>Xem vị trí trên Google Maps.</h2>
          </div>
          <div class="sl-faq-map__frame-wrap">
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

        ${
          showContactCta
            ? `
        <section class="sl-faq-cta">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Vẫn còn phân vân</p>
            <h2 class="sl-support-title">Trao đổi với đội ngũ chăm sóc khách hàng để nhận gợi ý trực tiếp.</h2>
            <p class="sl-card-copy">
              Đội ngũ có thể hỗ trợ về quà tặng, thời gian giao hàng, hướng dẫn Bộ Khám Phá và cách chọn giữa những chai
              đang nằm rất gần nhau trong gu của bạn.
            </p>
          </div>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cau-hoi-thuong-gap.html#lien-he-tong">Xem kênh liên hệ</a>
            <a class="btn btn-secondary" href="cua-hang.html">Mở cửa hàng</a>
          </div>
        </section>
        `
            : ""
        }
      </div>
    </section>
  `;
}
