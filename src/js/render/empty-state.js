export function renderEmptyState({
  title,
  copy,
  actionLabel = "Xóa bộ lọc",
  secondaryHref = "bo-kham-pha.html",
  secondaryLabel = "Xem Bộ Khám Phá"
}) {
  return `
    <div class="sl-empty-state">
      <div class="sl-empty-state__content sl-stack">
        <p class="sl-label sl-muted">Không có mùi hương phù hợp</p>
        <h2>${title}</h2>
        <p class="sl-section-summary">${copy}</p>
        <div class="sl-link-row">
          <button class="btn btn-primary" type="button" data-reset-filters="true">
            ${actionLabel}
          </button>
          <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
        </div>
      </div>
    </div>
  `;
}
