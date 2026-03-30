export function renderPageIntro({ eyebrow, title, summary, note }) {
  return `
    <section class="sl-section sl-section--hero">
      <div class="container">
        <div class="sl-page-frame">
          <p class="sl-label sl-muted">${eyebrow}</p>
          <h1 class="sl-page-title">${title}</h1>
          <p class="sl-page-summary">${summary}</p>
          ${note ? `<div class="sl-page-note"><p>${note}</p></div>` : ""}
        </div>
      </div>
    </section>
  `;
}
