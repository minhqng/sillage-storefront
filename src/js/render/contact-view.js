function compactCopy(copy, maxLength = 130) {
  const text = String(copy ?? "").trim();

  if (!text || text.length <= maxLength) {
    return text;
  }

  const slice = text.slice(0, maxLength);
  const cutAt = slice.lastIndexOf(" ");

  return `${(cutAt > 0 ? slice.slice(0, cutAt) : slice).trim()}...`;
}

function renderContactMethod(method) {
  const target = method.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";

  return `
    <article class="sl-contact-method sl-contact-method--compact">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${method.eyebrow}</p>
        <h3>${method.title}</h3>
        <a class="sl-contact-method__value" href="${method.href}"${target}>${method.value}</a>
        <p class="sl-card-copy">${compactCopy(method.copy)}</p>
      </div>
    </article>
  `;
}

function renderCommitment(commitment) {
  return `
    <article class="sl-contact-commitment">
      <h3>${commitment.title}</h3>
      <p class="sl-card-copy">${commitment.copy}</p>
    </article>
  `;
}

export function renderContactView({ site }) {
  const studioAddress = Array.isArray(site.brand?.studioAddress) ? site.brand.studioAddress.join(", ") : "";
  const contactMethods = Array.isArray(site.contactMethods) ? site.contactMethods.slice(0, 3) : [];

  return `
    <section class="sl-section sl-contact">
      <div class="container sl-stack sl-stack--loose">
        <section class="sl-contact-panel sl-contact-hero">
          <div class="sl-contact-hero__lead">
            <div class="sl-section-head">
              <p class="sl-label sl-muted">Chăm sóc khách hàng</p>
              <h2>Hỗ trợ đơn hàng, quà tặng và tư vấn chọn mùi theo một luồng rõ ràng.</h2>
              <p class="sl-section-summary">
                Liên hệ Sillage khi bạn cần câu trả lời nhanh về giao hàng, Bộ Khám Phá hoặc chốt chai phù hợp trước khi đặt.
              </p>
            </div>
          </div>

          <div class="sl-contact-hero__meta">
            <article class="sl-contact-hero-card">
              <p class="sl-label sl-muted">Thời gian phản hồi</p>
              <h3>${site.brand.responseWindow}</h3>
              <p class="sl-card-copy">${site.brand.serviceHours}</p>
            </article>

            <article class="sl-contact-hero-card">
              <p class="sl-label sl-muted">Studio</p>
              <p class="sl-contact-address-line">${studioAddress}</p>
            </article>
          </div>
        </section>

        <section class="sl-contact-panel sl-contact-channels">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Kênh liên hệ</p>
            <h2>Chọn đúng kênh để nhận phản hồi nhanh nhất.</h2>
          </div>
          <div class="sl-contact-method-grid">
            ${contactMethods.map((method) => renderContactMethod(method)).join("")}
          </div>
        </section>

        <section class="sl-contact-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Phạm vi hỗ trợ</p>
            <h2>Câu trả lời trực tiếp trước và sau khi đặt hàng.</h2>
            <p class="sl-section-summary">
              Tập trung vào ba việc: phản hồi nhanh, hỗ trợ chỉnh sửa đơn đúng lúc và tư vấn chọn mùi ngắn gọn.
            </p>
          </div>
          <div class="sl-contact-commitment-grid">
            ${site.serviceCommitments.map((commitment) => renderCommitment(commitment)).join("")}
          </div>
        </section>

        <section class="sl-contact-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Lối tắt nhanh</p>
            <h2>Cần câu trả lời ngay lúc này?</h2>
            <p class="sl-section-summary">Các link dưới đây dẫn thẳng tới mục câu hỏi phổ biến nhất.</p>
          </div>
          <div class="sl-contact-shortcuts">
            ${site.faqShortcuts
              .map(
                (shortcut) => `
                  <a class="sl-contact-shortcut" href="${shortcut.href}">${shortcut.label}</a>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="sl-contact-cta">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Bước tiếp theo</p>
            <h2 class="sl-support-title">Quay lại cửa hàng khi hướng chọn đã rõ.</h2>
            <p class="sl-card-copy">
              Xem các chai full-size nếu bạn đã biết nhóm hương phù hợp, hoặc bắt đầu với Bộ Khám Phá nếu vẫn muốn thêm
              thời gian thử trên da.
            </p>
          </div>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Mở cửa hàng</a>
            <a class="btn btn-secondary" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
          </div>
        </section>
      </div>
    </section>
  `;
}
