# DESIGN_SYSTEM

## Metadata
- brand: Sillage
- category: Modern niche fragrance
- visual_mode: Luxury minimalist ecommerce
- design_intent: Quiet luxury, editorial restraint, tactile warmth, commercial believability

## Core Principles
- Prioritize calm, premium restraint over loud conversion-first ecommerce patterns.
- Use whitespace, hierarchy, and material contrast instead of saturated color or heavy decoration.
- Keep every component elegant enough for fragrance storytelling and practical enough for shopping.
- Remove all visible default Bootstrap identity.

## Color Tokens

| token | hex | usage |
| --- | --- | --- |
| `--sl-color-bg` | `#F6F1E8` | Global page background |
| `--sl-color-surface` | `#EFE7DB` | Cards, panels, secondary sections |
| `--sl-color-surface-strong` | `#E4D8C8` | Raised blocks, hover surfaces |
| `--sl-color-text` | `#181613` | Primary text |
| `--sl-color-text-muted` | `#6B645A` | Secondary text, metadata |
| `--sl-color-heading` | `#11100E` | Headings, high-emphasis text |
| `--sl-color-border` | `#D8CCBD` | Standard borders and dividers |
| `--sl-color-border-strong` | `#B5A591` | Strong borders, active outlines |
| `--sl-color-accent` | `#8B7158` | Links, focus accents, restrained highlights |
| `--sl-color-accent-hover` | `#6F5844` | Accent hover state |
| `--sl-color-inverse` | `#0F0E0C` | Primary action backgrounds, dark footer |
| `--sl-color-inverse-text` | `#F7F2EB` | Text on dark surfaces |
| `--sl-color-success` | `#5D6E5D` | Success feedback |
| `--sl-color-danger` | `#8A4E47` | Error feedback |

## Typography System
- `font_display`: `"Cormorant Garamond", Georgia, "Times New Roman", serif`
- `font_ui`: `"Manrope", "Helvetica Neue", Arial, sans-serif`
- `font_mono`: `ui-monospace, SFMono-Regular, Consolas, monospace`

| role | font | size | weight | line-height | tracking |
| --- | --- | --- | --- | --- | --- |
| `display-1` | `font_display` | `clamp(2.75rem, 6vw, 4.75rem)` | `500` | `0.95` | `-0.02em` |
| `h1` | `font_display` | `clamp(2.25rem, 4.5vw, 3.5rem)` | `500` | `1.0` | `-0.015em` |
| `h2` | `font_display` | `clamp(1.75rem, 3vw, 2.5rem)` | `500` | `1.05` | `-0.01em` |
| `h3` | `font_ui` | `1.25rem` to `1.5rem` | `600` | `1.25` | `0` |
| `body-lg` | `font_ui` | `1.125rem` | `400` | `1.7` | `0` |
| `body` | `font_ui` | `1rem` | `400` | `1.65` | `0` |
| `body-sm` | `font_ui` | `0.9375rem` | `400` | `1.6` | `0` |
| `label` | `font_ui` | `0.75rem` | `600` | `1.2` | `0.12em` |
| `price` | `font_ui` | `1rem` to `1.125rem` | `600` | `1.3` | `0.01em` |

### Type Rules
- Use `font_display` for hero headings, collection titles, and major editorial moments only.
- Use `font_ui` for navigation, product data, buttons, forms, and body copy.
- Limit uppercase styling to labels, micro-navigation, and filters.
- Keep body copy concise; fragrance copy should be sensory but controlled.

## Spacing Scale

| token | value |
| --- | --- |
| `--sl-space-0` | `0` |
| `--sl-space-1` | `0.25rem` |
| `--sl-space-2` | `0.5rem` |
| `--sl-space-3` | `0.75rem` |
| `--sl-space-4` | `1rem` |
| `--sl-space-5` | `1.5rem` |
| `--sl-space-6` | `2rem` |
| `--sl-space-7` | `3rem` |
| `--sl-space-8` | `4rem` |
| `--sl-space-9` | `6rem` |

## Radius Policy
- `--sl-radius-sm`: `0.375rem`
- `--sl-radius-md`: `0.75rem`
- `--sl-radius-lg`: `1.25rem`
- Default component radius: `--sl-radius-md`
- Never use full-pill buttons, badges, or inputs.
- Keep radius consistent within a module; do not mix sharp and soft corners in the same component.

## Shadow Policy
- Default state: no obvious shadow
- `--sl-shadow-1`: `0 10px 30px rgba(17, 16, 14, 0.08)`
- `--sl-shadow-2`: `0 20px 60px rgba(17, 16, 14, 0.14)`
- Use shadows sparingly for overlays, modals, or raised editorial panels only.
- Product cards should rely on border, surface contrast, and image treatment before shadow.

## Divider Treatment
- Standard divider: `1px solid var(--sl-color-border)`
- Strong divider: `1px solid var(--sl-color-border-strong)`
- Dividers must feel quiet and architectural, not decorative.
- Prefer whitespace plus a single line over boxed layouts with multiple borders.

## Section Rhythm
- Hero sections: `--sl-space-8` to `--sl-space-9` vertical padding
- Standard sections: `--sl-space-7` to `--sl-space-8` vertical padding
- Compact sections: `--sl-space-6`
- Internal content stacks: `--sl-space-4` to `--sl-space-5`
- Alternate section background only when needed to create rhythm; do not stripe every section.

## Grid Behavior
- Use a 12-column Bootstrap grid with custom gutters.
- Max content width: `1320px`
- Reading width for copy-heavy blocks: `680px` to `760px`
- Gutters: `24px` desktop, `20px` tablet, `16px` mobile
- Product grid target: `2` columns on mobile, `3` on tablet, `4` on desktop
- Editorial layouts may split `5/7`, `6/6`, or `4/8`; they must stack cleanly on smaller viewports.

## Button Variants
- `primary`
  - Background: `var(--sl-color-inverse)`
  - Text: `var(--sl-color-inverse-text)`
  - Border: `1px solid var(--sl-color-inverse)`
- `secondary`
  - Background: `transparent`
  - Text: `var(--sl-color-heading)`
  - Border: `1px solid var(--sl-color-border-strong)`
- `quiet`
  - Background: `transparent`
  - Text: `var(--sl-color-heading)`
  - Border: none
- All buttons:
  - Min height: `44px`
  - Horizontal padding: `1rem` to `1.5rem`
  - Font: `font_ui`
  - Weight: `600`
  - Radius: `--sl-radius-md`
  - Transition: color, background, border, transform
- Hover behavior:
  - Max movement: `translateY(-1px)`
  - No glow, bounce, or scale-heavy motion

## Card Rules
- Product cards must not use stock Bootstrap `.card` styling unchanged.
- Standard product card structure: image block, product meta, price row, optional scent family tag.
- Product card image ratio: `4:5`
- Card background: transparent or `var(--sl-color-surface)`
- Border: subtle; shadow optional only on hover
- Product names should feel editorial, not promotional.
- Avoid busy badges, ribbons, and sale stickers unless explicitly required.

## Navbar Rules
- Height target: `64px` mobile, `72px` to `80px` desktop
- Background: `var(--sl-color-bg)` or lightly translucent warm neutral
- Bottom edge: quiet divider
- Brand mark should be typographic and premium, not playful
- Nav links should use restrained spacing and small uppercase or tightly tracked small caps
- Cart count indicator must be custom-styled and minimal, not default Bootstrap badge

## Footer Rules
- Use `var(--sl-color-inverse)` background with `var(--sl-color-inverse-text)`
- Structure: brand block, navigation, support links, contact or shipping info
- Keep density controlled; footer should feel editorial, not crowded
- Use dividers and spacing, not multiple nested boxes

## Form Styling
- Labels must remain visible above inputs
- Input min height: `48px`
- Input background: transparent or `var(--sl-color-surface)`
- Border: `1px solid var(--sl-color-border)`
- Radius: `--sl-radius-md`
- Focus state: accent border plus subtle ring
- Error state: `var(--sl-color-danger)` border and helper text
- Placeholder text must be low emphasis and never substitute for labels
- Checkboxes, radios, and quantity controls must be visually aligned with the same token system

## Image Art Direction
- Product imagery: centered bottle, generous negative space, warm neutral materials, soft directional light
- Editorial imagery: stone, paper, linen, matte glass, shadows, hands only when purposeful
- Avoid neon color, glossy tech styling, or generic stock lifestyle clichés
- Ratios:
  - Product listing: `4:5`
  - Product detail primary: `4:5`
  - Editorial banners: `3:2`
  - Accessory thumbnails: `1:1` or `4:5`
- Crops must be consistent within the same row and page section

## Micro-Interaction Policy
- `--sl-duration-fast`: `160ms`
- `--sl-duration-base`: `220ms`
- `--sl-ease-standard`: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Allowed motion:
  - opacity changes
  - border and background transitions
  - subtle image scale up to `1.02`
  - vertical lift up to `2px`
- Disallowed motion:
  - bounce
  - parallax
  - auto-rotating carousels
  - long staged animations
  - large hover transforms that feel promotional

## Must Not Feel Like Default Bootstrap
- No Bootstrap blue primary buttons or links
- No pill-shaped buttons, badges, or inputs
- No untouched `.card`, `.navbar`, `.accordion`, `.modal`, or `.form-control` appearance
- No heavy generic shadow stacks
- No bright contextual color system dominating the UI
- No cramped default spacing or generic centered-hero layout
- No component mix that looks assembled from Bootstrap examples

## Bootstrap Primitives To Override
- Root variables:
  - `--bs-body-bg`
  - `--bs-body-color`
  - `--bs-primary`
  - `--bs-secondary`
  - `--bs-border-color`
  - `--bs-border-radius`
  - `--bs-box-shadow`
  - `--bs-link-color`
  - `--bs-link-hover-color`
  - `--bs-font-sans-serif`
  - `--bs-heading-color`
- Buttons:
  - `--bs-btn-padding-x`
  - `--bs-btn-padding-y`
  - `--bs-btn-font-weight`
  - `--bs-btn-border-radius`
  - `--bs-btn-border-width`
  - `--bs-btn-focus-box-shadow`
- Cards:
  - `--bs-card-bg`
  - `--bs-card-border-color`
  - `--bs-card-border-radius`
  - `--bs-card-box-shadow`
- Forms:
  - `--bs-form-control-bg`
  - `--bs-form-control-color`
  - `--bs-form-control-border-color`
  - `--bs-form-control-border-radius`
  - `--bs-form-select-bg`
  - `--bs-focus-ring-color`
- Navigation and overlays:
  - `--bs-navbar-color`
  - `--bs-navbar-hover-color`
  - `--bs-navbar-brand-color`
  - `--bs-dropdown-bg`
  - `--bs-dropdown-border-color`
  - `--bs-modal-bg`
  - `--bs-offcanvas-bg`
  - `--bs-accordion-bg`
  - `--bs-accordion-border-color`
- Classes requiring custom restyling:
  - `.btn`
  - `.card`
  - `.navbar`
  - `.nav-link`
  - `.navbar-toggler`
  - `.form-control`
  - `.form-select`
  - `.badge`
  - `.accordion`
  - `.dropdown-menu`
  - `.modal`
  - `.offcanvas`
  - `.pagination`

## CSS Variable Naming Rules
- Prefix all custom variables with `--sl-`
- Use semantic token names first:
  - `--sl-color-*`
  - `--sl-font-*`
  - `--sl-space-*`
  - `--sl-radius-*`
  - `--sl-shadow-*`
  - `--sl-duration-*`
  - `--sl-ease-*`
- Component alias variables may map to semantic tokens:
  - `--sl-button-bg`
  - `--sl-input-border`
  - `--sl-card-surface`
- Do not use raw hex or spacing values inside component blocks when a token exists.
- Do not create page-specific tokens such as `--hero-beige` or `--shop-shadow`; map pages to shared system tokens.

## Custom Class Naming Rules
- Prefix all custom classes with `sl-`
- Component pattern: `.sl-component`
- Variant pattern: `.sl-component--variant`
- State pattern: `.is-state`
- Layout/object pattern: `.sl-section`, `.sl-shell`, `.sl-stack`, `.sl-cluster`
- JavaScript hooks must not be style hooks; use `data-*` attributes or `.js-*`
- Do not create unscoped generic classes such as `.title`, `.card-custom`, `.section`, or `.button-dark`

## Responsive Principles
- Build mobile-first
- Preserve hierarchy and whitespace by scaling deliberately, not by removing structure
- Keep touch targets at least `44px`
- Stack editorial layouts before they become cramped
- Keep line length between `45` and `75` characters for copy-heavy sections
- Reduce simultaneous choices on small screens; one primary action should dominate each viewport slice
- Product imagery must stay consistent across breakpoints
- Sticky sidebars, sticky cart summaries, or multi-column checkout layouts should activate only on larger screens
- Responsive behavior must support believable demo flow on mobile, tablet, and desktop